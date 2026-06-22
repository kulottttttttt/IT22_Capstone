using Microsoft.EntityFrameworkCore;
using SmartParking.Application.Common.DTOs.Prediction;
using SmartParking.Application.Common.Interfaces;
using SmartParking.Domain.Enums;

namespace SmartParking.Infrastructure.Services;

/// <summary>
/// Service for generating rule-based parking occupancy predictions.
/// </summary>
public class PredictionService : IPredictionService
{
    private readonly IApplicationDbContext _context;
    private readonly IAnalyticsService _analyticsService;

    public PredictionService(IApplicationDbContext context, IAnalyticsService analyticsService)
    {
        _context = context;
        _analyticsService = analyticsService;
    }

    public async Task<ZonePredictionDto> PredictZoneOccupancyAsync(
        Guid zoneId,
        CancellationToken cancellationToken = default)
    {
        // Get zone with parking area
        var zone = await _context.Zones
            .Include(z => z.ParkingArea)
            .FirstOrDefaultAsync(z => z.Id == zoneId && !z.IsDeleted, cancellationToken);

        if (zone == null)
        {
            throw new KeyNotFoundException($"Zone with ID {zoneId} not found.");
        }

        // Get all slots in zone
        var slots = await _context.ParkingSlots
            .Where(ps => ps.ZoneId == zoneId && !ps.IsDeleted)
            .ToListAsync(cancellationToken);

        var totalSlots = slots.Count;
        var currentOccupied = slots.Count(s => s.CurrentStatus == SlotStatus.Occupied);
        var currentOccupancyPercentage = totalSlots > 0
            ? Math.Round((decimal)currentOccupied / totalSlots * 100, 2)
            : 0;

        // Get analytics data
        var historicalAverage = await _analyticsService.GetHistoricalAverageOccupancyAsync(zoneId, 30, cancellationToken);
        var peakHourOccupancy = await _analyticsService.GetPeakHourOccupancyAsync(zoneId, cancellationToken);
        var recentTrend = await _analyticsService.GetRecentTrendAsync(zoneId, cancellationToken);

        var now = DateTime.UtcNow;
        var currentHour = now.Hour;
        var currentDayOfWeek = now.DayOfWeek;

        // Generate predictions for 30min, 1hr, 2hr windows
        var predictions = new List<PredictionWindowDto>();

        // 30 minutes prediction
        predictions.Add(await GeneratePredictionWindow(
            zoneId, totalSlots, currentOccupancyPercentage, historicalAverage,
            peakHourOccupancy, recentTrend, currentHour, currentDayOfWeek,
            now.AddMinutes(30), cancellationToken));

        // 1 hour prediction
        predictions.Add(await GeneratePredictionWindow(
            zoneId, totalSlots, currentOccupancyPercentage, historicalAverage,
            peakHourOccupancy, recentTrend, currentHour, currentDayOfWeek,
            now.AddHours(1), cancellationToken));

        // 2 hours prediction
        predictions.Add(await GeneratePredictionWindow(
            zoneId, totalSlots, currentOccupancyPercentage, historicalAverage,
            peakHourOccupancy, recentTrend, currentHour, currentDayOfWeek,
            now.AddHours(2), cancellationToken));

        return new ZonePredictionDto
        {
            ZoneId = zoneId,
            ZoneName = zone.Name,
            ParkingAreaName = zone.ParkingArea?.Name ?? string.Empty,
            TotalSlots = totalSlots,
            CurrentOccupiedSlots = currentOccupied,
            CurrentOccupancyPercentage = currentOccupancyPercentage,
            HistoricalAverageOccupancy = historicalAverage,
            PeakHourOccupancy = peakHourOccupancy,
            Predictions = predictions,
            GeneratedAt = now
        };
    }

    public async Task<ParkingAreaPredictionDto> PredictParkingAreaOccupancyAsync(
        Guid parkingAreaId,
        CancellationToken cancellationToken = default)
    {
        // Get parking area with zones
        var parkingArea = await _context.ParkingAreas
            .Include(pa => pa.Zones.Where(z => !z.IsDeleted))
            .FirstOrDefaultAsync(pa => pa.Id == parkingAreaId && !pa.IsDeleted, cancellationToken);

        if (parkingArea == null)
        {
            throw new KeyNotFoundException($"Parking area with ID {parkingAreaId} not found.");
        }

        // Get all slots in parking area
        var slots = await _context.ParkingSlots
            .Include(ps => ps.Zone)
            .Where(ps => ps.Zone.ParkingAreaId == parkingAreaId && !ps.IsDeleted && !ps.Zone.IsDeleted)
            .ToListAsync(cancellationToken);

        var totalSlots = slots.Count;
        var currentOccupied = slots.Count(s => s.CurrentStatus == SlotStatus.Occupied);
        var currentOccupancyPercentage = totalSlots > 0
            ? Math.Round((decimal)currentOccupied / totalSlots * 100, 2)
            : 0;

        // Generate zone breakdowns
        var zoneBreakdowns = new List<ZonePredictionDto>();
        foreach (var zone in parkingArea.Zones)
        {
            var zonePrediction = await PredictZoneOccupancyAsync(zone.Id, cancellationToken);
            zoneBreakdowns.Add(zonePrediction);
        }

        // Aggregate historical averages and peak hour from zones
        var historicalAverage = zoneBreakdowns.Any()
            ? Math.Round(zoneBreakdowns.Average(z => z.HistoricalAverageOccupancy), 2)
            : 0;

        var peakHourOccupancy = zoneBreakdowns.Any()
            ? Math.Round(zoneBreakdowns.Average(z => z.PeakHourOccupancy), 2)
            : 0;

        // Aggregate predictions from zones
        var now = DateTime.UtcNow;
        var predictions = new List<PredictionWindowDto>();

        // Aggregate 30min predictions
        predictions.Add(AggregatePredictions(zoneBreakdowns, 0, totalSlots, now.AddMinutes(30)));

        // Aggregate 1hr predictions
        predictions.Add(AggregatePredictions(zoneBreakdowns, 1, totalSlots, now.AddHours(1)));

        // Aggregate 2hr predictions
        predictions.Add(AggregatePredictions(zoneBreakdowns, 2, totalSlots, now.AddHours(2)));

        return new ParkingAreaPredictionDto
        {
            ParkingAreaId = parkingAreaId,
            ParkingAreaName = parkingArea.Name,
            TotalSlots = totalSlots,
            CurrentOccupiedSlots = currentOccupied,
            CurrentOccupancyPercentage = currentOccupancyPercentage,
            HistoricalAverageOccupancy = historicalAverage,
            PeakHourOccupancy = peakHourOccupancy,
            Predictions = predictions,
            ZoneBreakdowns = zoneBreakdowns,
            GeneratedAt = now
        };
    }

    public async Task<DashboardPredictionDto> PredictDashboardOccupancyAsync(
        CancellationToken cancellationToken = default)
    {
        // Get all parking areas
        var parkingAreas = await _context.ParkingAreas
            .Where(pa => !pa.IsDeleted)
            .ToListAsync(cancellationToken);

        // Get all slots
        var slots = await _context.ParkingSlots
            .Include(ps => ps.Zone)
            .Where(ps => !ps.IsDeleted && !ps.Zone.IsDeleted)
            .ToListAsync(cancellationToken);

        var totalSlots = slots.Count;
        var currentOccupied = slots.Count(s => s.CurrentStatus == SlotStatus.Occupied);
        var currentOccupancyPercentage = totalSlots > 0
            ? Math.Round((decimal)currentOccupied / totalSlots * 100, 2)
            : 0;

        // Generate parking area breakdowns
        var parkingAreaBreakdowns = new List<ParkingAreaPredictionDto>();
        foreach (var parkingArea in parkingAreas)
        {
            var areaPrediction = await PredictParkingAreaOccupancyAsync(parkingArea.Id, cancellationToken);
            parkingAreaBreakdowns.Add(areaPrediction);
        }

        // Aggregate historical averages from parking areas
        var historicalAverage = parkingAreaBreakdowns.Any()
            ? Math.Round(parkingAreaBreakdowns.Average(pa => pa.HistoricalAverageOccupancy), 2)
            : 0;

        // Aggregate predictions from parking areas
        var now = DateTime.UtcNow;
        var predictions = new List<PredictionWindowDto>();

        // Aggregate 30min predictions
        predictions.Add(AggregateDashboardPredictions(parkingAreaBreakdowns, 0, totalSlots, now.AddMinutes(30)));

        // Aggregate 1hr predictions
        predictions.Add(AggregateDashboardPredictions(parkingAreaBreakdowns, 1, totalSlots, now.AddHours(1)));

        // Aggregate 2hr predictions
        predictions.Add(AggregateDashboardPredictions(parkingAreaBreakdowns, 2, totalSlots, now.AddHours(2)));

        return new DashboardPredictionDto
        {
            TotalSlots = totalSlots,
            CurrentOccupiedSlots = currentOccupied,
            CurrentOccupancyPercentage = currentOccupancyPercentage,
            HistoricalAverageOccupancy = historicalAverage,
            Predictions = predictions,
            ParkingAreaBreakdowns = parkingAreaBreakdowns,
            GeneratedAt = now
        };
    }

    private async Task<PredictionWindowDto> GeneratePredictionWindow(
        Guid zoneId,
        int totalSlots,
        decimal currentOccupancy,
        decimal historicalAverage,
        decimal peakHourOccupancy,
        decimal recentTrend,
        int currentHour,
        DayOfWeek currentDayOfWeek,
        DateTime forecastTime,
        CancellationToken cancellationToken)
    {
        var forecastHour = forecastTime.Hour;
        var forecastDayOfWeek = forecastTime.DayOfWeek;

        // Rule-based prediction logic
        var predictedOccupancy = currentOccupancy;

        // Factor 1: Historical average at forecast hour
        var hourlyAverage = await _analyticsService.GetAverageOccupancyByHourAsync(
            zoneId, forecastHour, 30, cancellationToken);

        // Factor 2: Day of week pattern
        var dayOfWeekAverage = await _analyticsService.GetAverageOccupancyByDayOfWeekAsync(
            zoneId, forecastDayOfWeek, 4, cancellationToken);

        // Factor 3: Recent trend
        var trendAdjustment = recentTrend * 0.3m; // 30% weight to recent trend

        // Combine factors (weighted average)
        predictedOccupancy = (
            currentOccupancy * 0.3m +        // 30% current
            hourlyAverage * 0.25m +          // 25% hourly pattern
            dayOfWeekAverage * 0.15m +       // 15% day pattern
            historicalAverage * 0.15m +      // 15% historical
            peakHourOccupancy * 0.15m        // 15% peak hour reference
        ) + trendAdjustment;

        // Clamp to 0-100
        predictedOccupancy = Math.Max(0, Math.Min(100, predictedOccupancy));

        // Calculate predicted occupied slots
        var predictedOccupiedSlots = (int)Math.Round(totalSlots * predictedOccupancy / 100);
        var predictedAvailableSlots = totalSlots - predictedOccupiedSlots;

        // Calculate confidence score based on data availability
        var confidenceScore = CalculateConfidenceScore(hourlyAverage, dayOfWeekAverage, historicalAverage);
        var confidenceLevel = GetConfidenceLevel(confidenceScore);

        return new PredictionWindowDto
        {
            ForecastTime = forecastTime,
            PredictedOccupiedSlots = predictedOccupiedSlots,
            PredictedAvailableSlots = predictedAvailableSlots,
            PredictedOccupancyPercentage = Math.Round(predictedOccupancy, 2),
            ConfidenceLevel = confidenceLevel,
            ConfidenceScore = confidenceScore
        };
    }

    private PredictionWindowDto AggregatePredictions(
        List<ZonePredictionDto> zoneBreakdowns,
        int predictionIndex,
        int totalSlots,
        DateTime forecastTime)
    {
        if (!zoneBreakdowns.Any() || totalSlots == 0)
        {
            return new PredictionWindowDto
            {
                ForecastTime = forecastTime,
                PredictedOccupiedSlots = 0,
                PredictedAvailableSlots = 0,
                PredictedOccupancyPercentage = 0,
                ConfidenceLevel = "Low",
                ConfidenceScore = 0
            };
        }

        var totalPredictedOccupied = zoneBreakdowns
            .Where(z => z.Predictions.Count > predictionIndex)
            .Sum(z => z.Predictions[predictionIndex].PredictedOccupiedSlots);

        var averageConfidence = zoneBreakdowns
            .Where(z => z.Predictions.Count > predictionIndex)
            .Average(z => z.Predictions[predictionIndex].ConfidenceScore);

        var predictedOccupancyPercentage = Math.Round((decimal)totalPredictedOccupied / totalSlots * 100, 2);

        return new PredictionWindowDto
        {
            ForecastTime = forecastTime,
            PredictedOccupiedSlots = totalPredictedOccupied,
            PredictedAvailableSlots = totalSlots - totalPredictedOccupied,
            PredictedOccupancyPercentage = predictedOccupancyPercentage,
            ConfidenceLevel = GetConfidenceLevel(averageConfidence),
            ConfidenceScore = Math.Round(averageConfidence, 2)
        };
    }

    private PredictionWindowDto AggregateDashboardPredictions(
        List<ParkingAreaPredictionDto> parkingAreaBreakdowns,
        int predictionIndex,
        int totalSlots,
        DateTime forecastTime)
    {
        if (!parkingAreaBreakdowns.Any() || totalSlots == 0)
        {
            return new PredictionWindowDto
            {
                ForecastTime = forecastTime,
                PredictedOccupiedSlots = 0,
                PredictedAvailableSlots = 0,
                PredictedOccupancyPercentage = 0,
                ConfidenceLevel = "Low",
                ConfidenceScore = 0
            };
        }

        var totalPredictedOccupied = parkingAreaBreakdowns
            .Where(pa => pa.Predictions.Count > predictionIndex)
            .Sum(pa => pa.Predictions[predictionIndex].PredictedOccupiedSlots);

        var averageConfidence = parkingAreaBreakdowns
            .Where(pa => pa.Predictions.Count > predictionIndex)
            .Average(pa => pa.Predictions[predictionIndex].ConfidenceScore);

        var predictedOccupancyPercentage = Math.Round((decimal)totalPredictedOccupied / totalSlots * 100, 2);

        return new PredictionWindowDto
        {
            ForecastTime = forecastTime,
            PredictedOccupiedSlots = totalPredictedOccupied,
            PredictedAvailableSlots = totalSlots - totalPredictedOccupied,
            PredictedOccupancyPercentage = predictedOccupancyPercentage,
            ConfidenceLevel = GetConfidenceLevel(averageConfidence),
            ConfidenceScore = Math.Round(averageConfidence, 2)
        };
    }

    private decimal CalculateConfidenceScore(
        decimal hourlyAverage,
        decimal dayOfWeekAverage,
        decimal historicalAverage)
    {
        // Confidence based on consistency of data
        var hasHourlyData = hourlyAverage > 0;
        var hasDayData = dayOfWeekAverage > 0;
        var hasHistoricalData = historicalAverage > 0;

        var dataPoints = 0m;
        if (hasHourlyData) dataPoints += 40;
        if (hasDayData) dataPoints += 30;
        if (hasHistoricalData) dataPoints += 30;

        return Math.Round(dataPoints, 2);
    }

    private string GetConfidenceLevel(decimal confidenceScore)
    {
        if (confidenceScore >= 70)
            return "High";
        else if (confidenceScore >= 40)
            return "Medium";
        else
            return "Low";
    }
}

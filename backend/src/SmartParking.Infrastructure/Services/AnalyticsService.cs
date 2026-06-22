using Microsoft.EntityFrameworkCore;
using SmartParking.Application.Common.Interfaces;
using SmartParking.Domain.Enums;

namespace SmartParking.Infrastructure.Services;

/// <summary>
/// Service for analyzing historical parking data.
/// </summary>
public class AnalyticsService : IAnalyticsService
{
    private readonly IApplicationDbContext _context;

    public AnalyticsService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<decimal> GetHistoricalAverageOccupancyAsync(
        Guid zoneId,
        int lookbackDays = 30,
        CancellationToken cancellationToken = default)
    {
        var startDate = DateTime.UtcNow.AddDays(-lookbackDays);

        // Get all status changes in the lookback period for this zone
        var history = await _context.SlotStatusHistory
            .Where(h => h.Slot.ZoneId == zoneId && h.ChangedAt >= startDate)
            .OrderBy(h => h.ChangedAt)
            .Select(h => new
            {
                h.ChangedAt,
                h.NewStatus
            })
            .ToListAsync(cancellationToken);

        if (!history.Any())
        {
            // No history, return current occupancy
            return await GetCurrentOccupancyAsync(zoneId, cancellationToken);
        }

        // Get total slots in zone
        var totalSlots = await _context.ParkingSlots
            .Where(ps => ps.ZoneId == zoneId && !ps.IsDeleted)
            .CountAsync(cancellationToken);

        if (totalSlots == 0)
            return 0;

        // Calculate time-weighted average
        var totalMinutes = (DateTime.UtcNow - startDate).TotalMinutes;
        var occupiedMinutes = 0.0;

        // Group by hour and calculate occupancy
        var hourlyGroups = history
            .GroupBy(h => new DateTime(h.ChangedAt.Year, h.ChangedAt.Month, h.ChangedAt.Day, h.ChangedAt.Hour, 0, 0));

        foreach (var hourGroup in hourlyGroups)
        {
            var occupiedCount = hourGroup.Count(h => h.NewStatus == SlotStatus.Occupied);
            occupiedMinutes += occupiedCount * 60; // Each hour = 60 minutes
        }

        var averageOccupancyPercentage = totalMinutes > 0
            ? (decimal)(occupiedMinutes / totalMinutes) * 100
            : 0;

        return Math.Round(Math.Min(averageOccupancyPercentage, 100), 2);
    }

    public async Task<decimal> GetPeakHourOccupancyAsync(
        Guid zoneId,
        CancellationToken cancellationToken = default)
    {
        var startDate = DateTime.UtcNow.AddDays(-30);

        // Get status changes grouped by hour of day
        var history = await _context.SlotStatusHistory
            .Where(h => h.Slot.ZoneId == zoneId && h.ChangedAt >= startDate && h.NewStatus == SlotStatus.Occupied)
            .Select(h => h.ChangedAt.Hour)
            .ToListAsync(cancellationToken);

        if (!history.Any())
        {
            return await GetCurrentOccupancyAsync(zoneId, cancellationToken);
        }

        // Find the hour with most occupancy changes
        var peakHour = history
            .GroupBy(h => h)
            .OrderByDescending(g => g.Count())
            .Select(g => g.Key)
            .FirstOrDefault();

        // Get average occupancy for that peak hour
        return await GetAverageOccupancyByHourAsync(zoneId, peakHour, 30, cancellationToken);
    }

    public async Task<decimal> GetAverageOccupancyByHourAsync(
        Guid zoneId,
        int hourOfDay,
        int lookbackDays = 30,
        CancellationToken cancellationToken = default)
    {
        var startDate = DateTime.UtcNow.AddDays(-lookbackDays);

        // Get total slots in zone
        var totalSlots = await _context.ParkingSlots
            .Where(ps => ps.ZoneId == zoneId && !ps.IsDeleted)
            .CountAsync(cancellationToken);

        if (totalSlots == 0)
            return 0;

        // Count occupied status changes in the specified hour
        var occupancyCount = await _context.SlotStatusHistory
            .Where(h => h.Slot.ZoneId == zoneId
                && h.ChangedAt >= startDate
                && h.ChangedAt.Hour == hourOfDay
                && h.NewStatus == SlotStatus.Occupied)
            .CountAsync(cancellationToken);

        // Calculate days in the lookback period
        var daysCount = Math.Max(lookbackDays, 1);

        // Average occupied slots per day at this hour
        var averageOccupied = (decimal)occupancyCount / daysCount;

        // Convert to percentage
        var percentage = totalSlots > 0
            ? (averageOccupied / totalSlots) * 100
            : 0;

        return Math.Round(Math.Min(percentage, 100), 2);
    }

    public async Task<decimal> GetAverageOccupancyByDayOfWeekAsync(
        Guid zoneId,
        DayOfWeek dayOfWeek,
        int lookbackWeeks = 4,
        CancellationToken cancellationToken = default)
    {
        var startDate = DateTime.UtcNow.AddDays(-lookbackWeeks * 7);

        // Get total slots in zone
        var totalSlots = await _context.ParkingSlots
            .Where(ps => ps.ZoneId == zoneId && !ps.IsDeleted)
            .CountAsync(cancellationToken);

        if (totalSlots == 0)
            return 0;

        // Count occupied status changes on the specified day of week
        // Fixed: Split the query to avoid LINQ translation error
        var occupancyCount = await _context.SlotStatusHistory
            .Join(_context.ParkingSlots,
                h => h.SlotId,
                ps => ps.Id,
                (h, ps) => new { History = h, Slot = ps })
            .Where(x => x.Slot.ZoneId == zoneId
                && x.History.ChangedAt >= startDate
                && x.History.NewStatus == SlotStatus.Occupied)
            .Select(x => x.History)
            .ToListAsync(cancellationToken);
        
        // Filter by day of week in memory to avoid EF translation issues
        var filteredCount = occupancyCount.Count(h => h.ChangedAt.DayOfWeek == dayOfWeek);

        // Calculate weeks in the lookback period
        var weeksCount = Math.Max(lookbackWeeks, 1);

        // Average occupied slots per week on this day
        var averageOccupied = (decimal)filteredCount / weeksCount;

        // Convert to percentage
        var percentage = totalSlots > 0
            ? (averageOccupied / totalSlots) * 100
            : 0;

        return Math.Round(Math.Min(percentage, 100), 2);
    }

    public async Task<decimal> GetRecentTrendAsync(
        Guid zoneId,
        CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var last24Hours = now.AddHours(-24);
        var last12Hours = now.AddHours(-12);

        // Get total slots
        var totalSlots = await _context.ParkingSlots
            .Where(ps => ps.ZoneId == zoneId && !ps.IsDeleted)
            .CountAsync(cancellationToken);

        if (totalSlots == 0)
            return 0;

        // Get occupancy in first 12 hours
        var firstHalfOccupied = await _context.SlotStatusHistory
            .Where(h => h.Slot.ZoneId == zoneId
                && h.ChangedAt >= last24Hours
                && h.ChangedAt < last12Hours
                && h.NewStatus == SlotStatus.Occupied)
            .CountAsync(cancellationToken);

        // Get occupancy in last 12 hours
        var secondHalfOccupied = await _context.SlotStatusHistory
            .Where(h => h.Slot.ZoneId == zoneId
                && h.ChangedAt >= last12Hours
                && h.NewStatus == SlotStatus.Occupied)
            .CountAsync(cancellationToken);

        // Calculate trend as percentage change
        var firstHalfPercentage = totalSlots > 0 ? (decimal)firstHalfOccupied / totalSlots * 100 : 0;
        var secondHalfPercentage = totalSlots > 0 ? (decimal)secondHalfOccupied / totalSlots * 100 : 0;

        var trend = secondHalfPercentage - firstHalfPercentage;

        return Math.Round(trend, 2);
    }

    private async Task<decimal> GetCurrentOccupancyAsync(
        Guid zoneId,
        CancellationToken cancellationToken = default)
    {
        var slots = await _context.ParkingSlots
            .Where(ps => ps.ZoneId == zoneId && !ps.IsDeleted)
            .ToListAsync(cancellationToken);

        if (!slots.Any())
            return 0;

        var occupiedCount = slots.Count(s => s.CurrentStatus == SlotStatus.Occupied);
        return Math.Round((decimal)occupiedCount / slots.Count * 100, 2);
    }
}

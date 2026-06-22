using SmartParking.Application.Common.DTOs.Prediction;

namespace SmartParking.Application.Common.Interfaces;

/// <summary>
/// Service for generating rule-based parking occupancy predictions.
/// </summary>
public interface IPredictionService
{
    /// <summary>
    /// Generates predictions for a specific zone.
    /// </summary>
    Task<ZonePredictionDto> PredictZoneOccupancyAsync(Guid zoneId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Generates predictions for a specific parking area.
    /// </summary>
    Task<ParkingAreaPredictionDto> PredictParkingAreaOccupancyAsync(Guid parkingAreaId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Generates dashboard-wide predictions across all parking areas.
    /// </summary>
    Task<DashboardPredictionDto> PredictDashboardOccupancyAsync(CancellationToken cancellationToken = default);
}

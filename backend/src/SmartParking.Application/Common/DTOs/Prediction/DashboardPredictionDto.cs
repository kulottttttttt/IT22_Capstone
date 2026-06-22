namespace SmartParking.Application.Common.DTOs.Prediction;

/// <summary>
/// Represents dashboard-wide prediction data across all parking areas.
/// </summary>
public class DashboardPredictionDto
{
    /// <summary>
    /// Gets or sets the total number of slots across all parking areas.
    /// </summary>
    public int TotalSlots { get; set; }

    /// <summary>
    /// Gets or sets the current total occupied slots.
    /// </summary>
    public int CurrentOccupiedSlots { get; set; }

    /// <summary>
    /// Gets or sets the current overall occupancy percentage.
    /// </summary>
    public decimal CurrentOccupancyPercentage { get; set; }

    /// <summary>
    /// Gets or sets the historical average occupancy percentage.
    /// </summary>
    public decimal HistoricalAverageOccupancy { get; set; }

    /// <summary>
    /// Gets or sets the prediction windows (30min, 1hr, 2hr).
    /// </summary>
    public List<PredictionWindowDto> Predictions { get; set; } = new();

    /// <summary>
    /// Gets or sets the per-parking-area breakdowns.
    /// </summary>
    public List<ParkingAreaPredictionDto> ParkingAreaBreakdowns { get; set; } = new();

    /// <summary>
    /// Gets or sets the timestamp when the prediction was generated.
    /// </summary>
    public DateTime GeneratedAt { get; set; }
}

namespace SmartParking.Application.Common.DTOs.Prediction;

/// <summary>
/// Represents aggregated prediction data for a parking area.
/// </summary>
public class ParkingAreaPredictionDto
{
    /// <summary>
    /// Gets or sets the parking area identifier.
    /// </summary>
    public Guid ParkingAreaId { get; set; }

    /// <summary>
    /// Gets or sets the parking area name.
    /// </summary>
    public string ParkingAreaName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the total number of slots in the parking area.
    /// </summary>
    public int TotalSlots { get; set; }

    /// <summary>
    /// Gets or sets the current number of occupied slots.
    /// </summary>
    public int CurrentOccupiedSlots { get; set; }

    /// <summary>
    /// Gets or sets the current occupancy percentage.
    /// </summary>
    public decimal CurrentOccupancyPercentage { get; set; }

    /// <summary>
    /// Gets or sets the historical average occupancy percentage.
    /// </summary>
    public decimal HistoricalAverageOccupancy { get; set; }

    /// <summary>
    /// Gets or sets the peak hour occupancy percentage.
    /// </summary>
    public decimal PeakHourOccupancy { get; set; }

    /// <summary>
    /// Gets or sets the prediction windows (30min, 1hr, 2hr).
    /// </summary>
    public List<PredictionWindowDto> Predictions { get; set; } = new();

    /// <summary>
    /// Gets or sets the per-zone breakdowns.
    /// </summary>
    public List<ZonePredictionDto> ZoneBreakdowns { get; set; } = new();

    /// <summary>
    /// Gets or sets the timestamp when the prediction was generated.
    /// </summary>
    public DateTime GeneratedAt { get; set; }
}

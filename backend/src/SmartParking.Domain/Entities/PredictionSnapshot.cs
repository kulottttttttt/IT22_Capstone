using SmartParking.Domain.Common;
using SmartParking.Domain.Enums;

namespace SmartParking.Domain.Entities;

/// <summary>
/// Represents a captured prediction of parking occupancy for a future time.
/// </summary>
public class PredictionSnapshot : BaseEntity
{
    /// <summary>
    /// Gets or sets the parking area identifier this prediction belongs to.
    /// </summary>
    public Guid ParkingAreaId { get; set; }

    /// <summary>
    /// Gets or sets the zone identifier this prediction is for.
    /// </summary>
    public Guid ZoneId { get; set; }

    /// <summary>
    /// Gets or sets the vehicle type this prediction applies to.
    /// </summary>
    public VehicleType VehicleType { get; set; }

    /// <summary>
    /// Gets or sets the future time this prediction is forecasting for.
    /// </summary>
    public DateTime ForecastTime { get; set; }

    /// <summary>
    /// Gets or sets the predicted number of occupied slots.
    /// </summary>
    public int PredictedOccupancyCount { get; set; }

    /// <summary>
    /// Gets or sets the predicted occupancy as a percentage (0-100).
    /// </summary>
    public decimal PredictedOccupancyPercentage { get; set; }

    /// <summary>
    /// Gets or sets the confidence level of this prediction.
    /// </summary>
    public ConfidenceLevel ConfidenceLevel { get; set; }

    /// <summary>
    /// Gets or sets the JSON metadata describing the calculation basis (optional).
    /// </summary>
    public string? CalculationBasis { get; set; }

    // Navigation properties

    /// <summary>
    /// Gets or sets the parking area this prediction belongs to.
    /// </summary>
    public ParkingArea ParkingArea { get; set; } = null!;

    /// <summary>
    /// Gets or sets the zone this prediction is for.
    /// </summary>
    public Zone Zone { get; set; } = null!;
}

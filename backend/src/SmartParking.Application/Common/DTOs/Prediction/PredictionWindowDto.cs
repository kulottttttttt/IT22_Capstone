namespace SmartParking.Application.Common.DTOs.Prediction;

/// <summary>
/// Represents a prediction for a specific time window.
/// </summary>
public class PredictionWindowDto
{
    /// <summary>
    /// Gets or sets the forecast time.
    /// </summary>
    public DateTime ForecastTime { get; set; }

    /// <summary>
    /// Gets or sets the predicted number of occupied slots.
    /// </summary>
    public int PredictedOccupiedSlots { get; set; }

    /// <summary>
    /// Gets or sets the predicted number of available slots.
    /// </summary>
    public int PredictedAvailableSlots { get; set; }

    /// <summary>
    /// Gets or sets the predicted occupancy percentage.
    /// </summary>
    public decimal PredictedOccupancyPercentage { get; set; }

    /// <summary>
    /// Gets or sets the confidence level.
    /// </summary>
    public string ConfidenceLevel { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the confidence score (0-100).
    /// </summary>
    public decimal ConfidenceScore { get; set; }
}

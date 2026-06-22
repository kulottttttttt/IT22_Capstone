namespace SmartParking.Domain.Enums;

/// <summary>
/// Represents the confidence level of a prediction snapshot.
/// </summary>
public enum ConfidenceLevel
{
    /// <summary>
    /// Low confidence - insufficient historical data or high uncertainty.
    /// </summary>
    Low = 0,

    /// <summary>
    /// Medium confidence - moderate historical data available.
    /// </summary>
    Medium = 1,

    /// <summary>
    /// High confidence - sufficient historical data and stable patterns.
    /// </summary>
    High = 2
}

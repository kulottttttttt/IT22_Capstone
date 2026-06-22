namespace SmartParking.Domain.Enums;

/// <summary>
/// Represents the severity level of a notification.
/// </summary>
public enum NotificationSeverity
{
    /// <summary>
    /// Informational notification.
    /// </summary>
    Info = 0,

    /// <summary>
    /// Warning notification requiring attention.
    /// </summary>
    Warning = 1,

    /// <summary>
    /// Error notification requiring immediate action.
    /// </summary>
    Error = 2
}

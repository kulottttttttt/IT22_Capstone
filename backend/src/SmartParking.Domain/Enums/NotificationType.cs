namespace SmartParking.Domain.Enums;

/// <summary>
/// Represents the type of notification.
/// </summary>
public enum NotificationType
{
    /// <summary>
    /// Alert about a parking incident.
    /// </summary>
    Incident_Alert = 0,

    /// <summary>
    /// Alert about maintenance requirements.
    /// </summary>
    Maintenance_Alert = 1,

    /// <summary>
    /// General system notification.
    /// </summary>
    System_Notification = 2,

    /// <summary>
    /// Alert about parking availability predictions.
    /// </summary>
    Prediction_Alert = 3,

    /// <summary>
    /// Alert about sensor issues or failures.
    /// </summary>
    Sensor_Alert = 4
}

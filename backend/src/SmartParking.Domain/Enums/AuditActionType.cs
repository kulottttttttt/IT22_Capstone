namespace SmartParking.Domain.Enums;

/// <summary>
/// Represents the type of action recorded in the audit log.
/// </summary>
public enum AuditActionType
{
    /// <summary>
    /// Entity creation action.
    /// </summary>
    Create = 0,

    /// <summary>
    /// Entity update action.
    /// </summary>
    Update = 1,

    /// <summary>
    /// Entity deletion action.
    /// </summary>
    Delete = 2,

    /// <summary>
    /// Status change action (e.g., slot status, incident status).
    /// </summary>
    StatusChange = 3,

    /// <summary>
    /// User login action.
    /// </summary>
    Login = 4,

    /// <summary>
    /// User logout action.
    /// </summary>
    Logout = 5,

    /// <summary>
    /// System configuration change action.
    /// </summary>
    ConfigurationChange = 6
}

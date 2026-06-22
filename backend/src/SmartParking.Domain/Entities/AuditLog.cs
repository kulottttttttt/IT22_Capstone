using SmartParking.Domain.Enums;

namespace SmartParking.Domain.Entities;

/// <summary>
/// Represents an audit log entry for tracking administrative actions.
/// Note: This entity does NOT inherit from BaseEntity as per design specification.
/// </summary>
public class AuditLog
{
    /// <summary>
    /// Gets or sets the unique identifier for this audit log entry.
    /// </summary>
    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>
    /// Gets or sets the user identifier who performed the action (nullable for system actions).
    /// </summary>
    public Guid? UserId { get; set; }

    /// <summary>
    /// Gets or sets the type of action performed.
    /// </summary>
    public AuditActionType ActionType { get; set; }

    /// <summary>
    /// Gets or sets the name of the entity affected by the action.
    /// </summary>
    public string EntityName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the identifier of the entity affected.
    /// </summary>
    public string EntityId { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the old values before the action (JSON format).
    /// </summary>
    public string? OldValues { get; set; }

    /// <summary>
    /// Gets or sets the new values after the action (JSON format).
    /// </summary>
    public string? NewValues { get; set; }

    /// <summary>
    /// Gets or sets the IP address from which the action was performed.
    /// </summary>
    public string? IpAddress { get; set; }

    /// <summary>
    /// Gets or sets the user agent string from the request.
    /// </summary>
    public string? UserAgent { get; set; }

    /// <summary>
    /// Gets or sets the timestamp when the action occurred.
    /// </summary>
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    // Navigation properties

    /// <summary>
    /// Gets or sets the user who performed the action (nullable for system actions).
    /// </summary>
    public User? User { get; set; }
}

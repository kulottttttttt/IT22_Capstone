using SmartParking.Domain.Common;
using SmartParking.Domain.Enums;

namespace SmartParking.Domain.Entities;

/// <summary>
/// Represents a notification sent to a user.
/// </summary>
public class Notification : BaseEntity
{
    /// <summary>
    /// Gets or sets the user identifier this notification is for.
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// Gets or sets the type of notification.
    /// </summary>
    public NotificationType NotificationType { get; set; }

    /// <summary>
    /// Gets or sets the severity level of this notification.
    /// </summary>
    public NotificationSeverity Severity { get; set; }

    /// <summary>
    /// Gets or sets the notification title.
    /// </summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the notification message content.
    /// </summary>
    public string Message { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets a value indicating whether the notification has been read.
    /// </summary>
    public bool IsRead { get; set; } = false;

    /// <summary>
    /// Gets or sets the timestamp when the notification was read.
    /// </summary>
    public DateTime? ReadAt { get; set; }

    /// <summary>
    /// Gets or sets the type of related entity (e.g., "Incident", "Slot").
    /// </summary>
    public string? RelatedEntityType { get; set; }

    /// <summary>
    /// Gets or sets the identifier of the related entity.
    /// </summary>
    public string? RelatedEntityId { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the notification has been archived.
    /// </summary>
    public bool IsArchived { get; set; } = false;

    // Navigation properties

    /// <summary>
    /// Gets or sets the user this notification belongs to.
    /// </summary>
    public User User { get; set; } = null!;
}

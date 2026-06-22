using SmartParking.Domain.Common;
using SmartParking.Domain.Enums;

namespace SmartParking.Domain.Entities;

/// <summary>
/// Represents a user in the smart parking system with authentication and authorization capabilities.
/// </summary>
public class User : BaseEntity
{
    /// <summary>
    /// Gets or sets the unique username for login.
    /// </summary>
    public string Username { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the user's email address.
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the BCrypt hashed password.
    /// </summary>
    public string PasswordHash { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the user's role (SuperAdmin, Admin, or Staff).
    /// </summary>
    public UserRole Role { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the user account is active.
    /// </summary>
    public bool IsActive { get; set; } = true;

    // Navigation properties

    /// <summary>
    /// Gets or sets the collection of refresh tokens associated with this user.
    /// </summary>
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

    /// <summary>
    /// Gets or sets the collection of parking incidents reported by this user.
    /// </summary>
    public ICollection<ParkingIncident> ReportedIncidents { get; set; } = new List<ParkingIncident>();

    /// <summary>
    /// Gets or sets the collection of parking incidents resolved by this user.
    /// </summary>
    public ICollection<ParkingIncident> ResolvedIncidents { get; set; } = new List<ParkingIncident>();

    /// <summary>
    /// Gets or sets the collection of notifications sent to this user.
    /// </summary>
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    /// <summary>
    /// Gets or sets the collection of audit log entries created by this user.
    /// </summary>
    public ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();
}

using SmartParking.Domain.Common;

namespace SmartParking.Domain.Entities;

/// <summary>
/// Represents a refresh token for JWT authentication, allowing users to obtain new access tokens.
/// </summary>
public class RefreshToken : BaseEntity
{
    /// <summary>
    /// Gets or sets the user ID this refresh token belongs to.
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// Gets or sets the refresh token value.
    /// </summary>
    public string Token { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the date and time when this refresh token expires.
    /// </summary>
    public DateTime ExpiryDate { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether this refresh token has been revoked.
    /// </summary>
    public bool IsRevoked { get; set; } = false;

    // Navigation property

    /// <summary>
    /// Gets or sets the user associated with this refresh token.
    /// </summary>
    public User User { get; set; } = null!;
}

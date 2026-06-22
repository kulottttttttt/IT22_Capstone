namespace SmartParking.Application.Common.DTOs.Auth;

/// <summary>
/// Data transfer object for user information.
/// </summary>
public class UserDto
{
    /// <summary>
    /// Gets or sets the user ID.
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Gets or sets the username.
    /// </summary>
    public string Username { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the email address.
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the user role.
    /// </summary>
    public string Role { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets whether the user account is active.
    /// </summary>
    public bool IsActive { get; set; }
}

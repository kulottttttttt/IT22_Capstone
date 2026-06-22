namespace SmartParking.Application.Common.DTOs.Auth;

/// <summary>
/// Response model containing authentication tokens.
/// </summary>
public class LoginResponse
{
    /// <summary>
    /// Gets or sets the JWT access token.
    /// </summary>
    public string AccessToken { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the refresh token.
    /// </summary>
    public string RefreshToken { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the access token expiration date.
    /// </summary>
    public DateTime ExpiresAt { get; set; }

    /// <summary>
    /// Gets or sets the user information.
    /// </summary>
    public UserDto User { get; set; } = null!;
}

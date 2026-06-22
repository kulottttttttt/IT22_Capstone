namespace SmartParking.Application.Common.DTOs.Auth;

/// <summary>
/// Request model for refreshing an access token.
/// </summary>
public class RefreshTokenRequest
{
    /// <summary>
    /// Gets or sets the refresh token.
    /// </summary>
    public string RefreshToken { get; set; } = string.Empty;
}

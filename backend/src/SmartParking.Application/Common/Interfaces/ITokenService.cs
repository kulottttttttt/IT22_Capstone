using SmartParking.Domain.Entities;
using System.Security.Claims;

namespace SmartParking.Application.Common.Interfaces;

/// <summary>
/// Service for generating and validating JWT tokens.
/// </summary>
public interface ITokenService
{
    /// <summary>
    /// Generates a JWT access token for the specified user.
    /// </summary>
    /// <param name="user">The user to generate the token for.</param>
    /// <returns>The JWT access token.</returns>
    string GenerateAccessToken(User user);

    /// <summary>
    /// Generates a refresh token.
    /// </summary>
    /// <returns>A unique refresh token string.</returns>
    string GenerateRefreshToken();

    /// <summary>
    /// Gets the principal from an expired token.
    /// </summary>
    /// <param name="token">The expired JWT token.</param>
    /// <returns>The ClaimsPrincipal if valid; otherwise, null.</returns>
    ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);

    /// <summary>
    /// Gets the access token expiration date.
    /// </summary>
    /// <returns>The expiration DateTime.</returns>
    DateTime GetAccessTokenExpiration();
}

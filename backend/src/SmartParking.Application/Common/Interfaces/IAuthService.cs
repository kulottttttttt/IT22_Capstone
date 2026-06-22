using SmartParking.Application.Common.DTOs.Auth;

namespace SmartParking.Application.Common.Interfaces;

/// <summary>
/// Service for authentication operations.
/// </summary>
public interface IAuthService
{
    /// <summary>
    /// Authenticates a user with username and password.
    /// </summary>
    /// <param name="request">The login request containing credentials.</param>
    /// <returns>The login response with tokens if successful; otherwise, null.</returns>
    Task<LoginResponse?> LoginAsync(LoginRequest request);

    /// <summary>
    /// Refreshes an access token using a refresh token.
    /// </summary>
    /// <param name="request">The refresh token request.</param>
    /// <returns>The login response with new tokens if successful; otherwise, null.</returns>
    Task<LoginResponse?> RefreshTokenAsync(RefreshTokenRequest request);

    /// <summary>
    /// Logs out a user by revoking their refresh token.
    /// </summary>
    /// <param name="refreshToken">The refresh token to revoke.</param>
    /// <returns>True if logout was successful; otherwise, false.</returns>
    Task<bool> LogoutAsync(string refreshToken);

    /// <summary>
    /// Gets the current authenticated user's information.
    /// </summary>
    /// <param name="userId">The user ID from JWT claims.</param>
    /// <returns>The user DTO if found; otherwise, null.</returns>
    Task<UserDto?> GetCurrentUserAsync(Guid userId);
}

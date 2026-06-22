using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartParking.Application.Common.DTOs.Auth;
using SmartParking.Application.Common.Interfaces;
using System.Security.Claims;

namespace SmartParking.Presentation.Controllers;

/// <summary>
/// Controller for authentication and authorization operations.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    /// <summary>
    /// Authenticates a user and returns JWT tokens.
    /// </summary>
    /// <param name="request">Login credentials.</param>
    /// <returns>Login response with access and refresh tokens.</returns>
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { message = "Username and password are required." });
        }

        var response = await _authService.LoginAsync(request);

        if (response == null)
        {
            return Unauthorized(new { message = "Invalid username or password." });
        }

        return Ok(response);
    }

    /// <summary>
    /// Refreshes an access token using a refresh token.
    /// </summary>
    /// <param name="request">Refresh token request.</param>
    /// <returns>New login response with fresh tokens.</returns>
    [HttpPost("refresh")]
    [AllowAnonymous]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.RefreshToken))
        {
            return BadRequest(new { message = "Refresh token is required." });
        }

        var response = await _authService.RefreshTokenAsync(request);

        if (response == null)
        {
            return Unauthorized(new { message = "Invalid or expired refresh token." });
        }

        return Ok(response);
    }

    /// <summary>
    /// Logs out a user by revoking their refresh token.
    /// </summary>
    /// <param name="request">Refresh token to revoke.</param>
    /// <returns>Success status.</returns>
    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout([FromBody] RefreshTokenRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.RefreshToken))
        {
            return BadRequest(new { message = "Refresh token is required." });
        }

        var success = await _authService.LogoutAsync(request.RefreshToken);

        if (!success)
        {
            return BadRequest(new { message = "Logout failed. Token not found or already revoked." });
        }

        return Ok(new { message = "Logged out successfully." });
    }

    /// <summary>
    /// Gets the current authenticated user's profile.
    /// </summary>
    /// <returns>Current user information.</returns>
    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "Invalid token." });
        }

        var user = await _authService.GetCurrentUserAsync(userId);

        if (user == null)
        {
            return NotFound(new { message = "User not found." });
        }

        return Ok(user);
    }
}

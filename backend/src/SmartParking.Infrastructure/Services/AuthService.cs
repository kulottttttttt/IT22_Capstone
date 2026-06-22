using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SmartParking.Application.Common.DTOs.Auth;
using SmartParking.Application.Common.Interfaces;
using SmartParking.Application.Common.Settings;
using SmartParking.Domain.Entities;

namespace SmartParking.Infrastructure.Services;

/// <summary>
/// Implementation of authentication service.
/// </summary>
public class AuthService : IAuthService
{
    private readonly IApplicationDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;
    private readonly JwtSettings _jwtSettings;

    public AuthService(
        IApplicationDbContext context,
        IPasswordHasher passwordHasher,
        ITokenService tokenService,
        IOptions<JwtSettings> jwtSettings)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
        _jwtSettings = jwtSettings.Value;
    }

    /// <summary>
    /// Authenticates a user and generates tokens.
    /// </summary>
    public async Task<LoginResponse?> LoginAsync(LoginRequest request)
    {
        // Find user by username
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == request.Username && !u.IsDeleted);

        if (user == null || !user.IsActive)
        {
            return null;
        }

        // Verify password
        if (!_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
        {
            return null;
        }

        // Generate tokens
        var accessToken = _tokenService.GenerateAccessToken(user);
        var refreshToken = _tokenService.GenerateRefreshToken();

        // Store refresh token
        var refreshTokenEntity = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = refreshToken,
            ExpiryDate = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays),
            CreatedAt = DateTime.UtcNow
        };

        _context.RefreshTokens.Add(refreshTokenEntity);
        await _context.SaveChangesAsync();

        return new LoginResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = _tokenService.GetAccessTokenExpiration(),
            User = MapToUserDto(user)
        };
    }

    /// <summary>
    /// Refreshes an access token using a valid refresh token.
    /// </summary>
    public async Task<LoginResponse?> RefreshTokenAsync(RefreshTokenRequest request)
    {
        // Find refresh token
        var refreshToken = await _context.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.Token == request.RefreshToken && !rt.IsRevoked && !rt.IsDeleted);

        if (refreshToken == null || refreshToken.ExpiryDate < DateTime.UtcNow)
        {
            return null;
        }

        var user = refreshToken.User;

        if (user == null || !user.IsActive || user.IsDeleted)
        {
            return null;
        }

        // Generate new tokens
        var accessToken = _tokenService.GenerateAccessToken(user);
        var newRefreshToken = _tokenService.GenerateRefreshToken();

        // Revoke old refresh token
        refreshToken.IsRevoked = true;
        refreshToken.UpdatedAt = DateTime.UtcNow;

        // Create new refresh token
        var newRefreshTokenEntity = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = newRefreshToken,
            ExpiryDate = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays),
            CreatedAt = DateTime.UtcNow
        };

        _context.RefreshTokens.Add(newRefreshTokenEntity);
        await _context.SaveChangesAsync();

        return new LoginResponse
        {
            AccessToken = accessToken,
            RefreshToken = newRefreshToken,
            ExpiresAt = _tokenService.GetAccessTokenExpiration(),
            User = MapToUserDto(user)
        };
    }

    /// <summary>
    /// Logs out a user by revoking their refresh token.
    /// </summary>
    public async Task<bool> LogoutAsync(string refreshToken)
    {
        var token = await _context.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == refreshToken && !rt.IsRevoked && !rt.IsDeleted);

        if (token == null)
        {
            return false;
        }

        token.IsRevoked = true;
        token.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Gets the current authenticated user's information.
    /// </summary>
    public async Task<UserDto?> GetCurrentUserAsync(Guid userId)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId && !u.IsDeleted && u.IsActive);

        return user == null ? null : MapToUserDto(user);
    }

    /// <summary>
    /// Maps a User entity to UserDto.
    /// </summary>
    private static UserDto MapToUserDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Role = user.Role.ToString(),
            IsActive = user.IsActive
        };
    }
}

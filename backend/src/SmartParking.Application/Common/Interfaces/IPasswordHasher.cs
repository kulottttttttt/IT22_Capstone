namespace SmartParking.Application.Common.Interfaces;

/// <summary>
/// Service for hashing and verifying passwords using BCrypt.
/// </summary>
public interface IPasswordHasher
{
    /// <summary>
    /// Hashes a plain text password.
    /// </summary>
    /// <param name="password">The plain text password.</param>
    /// <returns>The BCrypt hashed password.</returns>
    string HashPassword(string password);

    /// <summary>
    /// Verifies a plain text password against a hashed password.
    /// </summary>
    /// <param name="password">The plain text password.</param>
    /// <param name="hashedPassword">The BCrypt hashed password.</param>
    /// <returns>True if the password matches; otherwise, false.</returns>
    bool VerifyPassword(string password, string hashedPassword);
}

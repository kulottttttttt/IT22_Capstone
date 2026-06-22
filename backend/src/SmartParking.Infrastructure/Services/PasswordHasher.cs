using SmartParking.Application.Common.Interfaces;

namespace SmartParking.Infrastructure.Services;

/// <summary>
/// Implementation of password hashing using BCrypt.
/// </summary>
public class PasswordHasher : IPasswordHasher
{
    /// <summary>
    /// Hashes a plain text password using BCrypt.
    /// </summary>
    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    /// <summary>
    /// Verifies a plain text password against a BCrypt hashed password.
    /// </summary>
    public bool VerifyPassword(string password, string hashedPassword)
    {
        return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
    }
}

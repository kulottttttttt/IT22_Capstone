# Phase 2: Authentication & Authorization - Completion Summary

**Status:** ✅ COMPLETED  
**Date:** June 13, 2026  
**Solution:** Smart Parking Management System for Ayala Malls Abreeza

---

## Overview

Phase 2 implemented JWT-based authentication and role-based authorization on top of the Phase 1 backend foundation. The system now supports secure user authentication with access tokens, refresh tokens, and three distinct roles (SuperAdmin, Admin, Staff). Guest users remain anonymous and do NOT require accounts.

---

## What Was Implemented

### 1. NuGet Packages Added ✅

**Infrastructure Layer:**
- `BCrypt.Net-Next` v4.2.0 - Password hashing
- `Microsoft.Extensions.Options.ConfigurationExtensions` v10.0.9 - Configuration binding

**Presentation Layer:**
- `Microsoft.AspNetCore.Authentication.JwtBearer` v9.0.0 - JWT authentication
- `Microsoft.EntityFrameworkCore.Design` v9.0.0 - Already added in Phase 1

### 2. Data Transfer Objects (DTOs) ✅

Created in `SmartParking.Application/Common/DTOs/Auth/`:

1. **LoginRequest**
   - Username (string)
   - Password (string)

2. **LoginResponse**
   - AccessToken (string)
   - RefreshToken (string)
   - ExpiresAt (DateTime)
   - User (UserDto)

3. **RefreshTokenRequest**
   - RefreshToken (string)

4. **UserDto**
   - Id (Guid)
   - Username (string)
   - Email (string)
   - Role (string)
   - IsActive (bool)

### 3. Service Interfaces ✅

Created in `SmartParking.Application/Common/Interfaces/`:

1. **IPasswordHasher**
   - `HashPassword(string password)` → string
   - `VerifyPassword(string password, string hashedPassword)` → bool

2. **ITokenService**
   - `GenerateAccessToken(User user)` → string
   - `GenerateRefreshToken()` → string
   - `GetPrincipalFromExpiredToken(string token)` → ClaimsPrincipal?
   - `GetAccessTokenExpiration()` → DateTime

3. **IAuthService**
   - `LoginAsync(LoginRequest request)` → Task<LoginResponse?>
   - `RefreshTokenAsync(RefreshTokenRequest request)` → Task<LoginResponse?>
   - `LogoutAsync(string refreshToken)` → Task<bool>
   - `GetCurrentUserAsync(Guid userId)` → Task<UserDto?>

### 4. Configuration Settings ✅

**JwtSettings** (`SmartParking.Application/Common/Settings/JwtSettings.cs`):
- SecretKey (string) - 256-bit secret for signing tokens
- Issuer (string) - Token issuer (SmartParkingAPI)
- Audience (string) - Token audience (SmartParkingClient)
- AccessTokenExpirationMinutes (int) - Default: 60 minutes
- RefreshTokenExpirationDays (int) - Default: 7 days

### 5. Service Implementations ✅

Created in `SmartParking.Infrastructure/Services/`:

1. **PasswordHasher**
   - Uses BCrypt with work factor 11 (default)
   - Secure password hashing and verification

2. **TokenService**
   - Generates JWT access tokens with user claims
   - Generates cryptographically secure refresh tokens
   - Validates expired tokens for refresh flow
   - Claims included: Sub (UserId), UniqueName (Username), Email, Role, Jti (Token ID)

3. **AuthService**
   - Handles login with username/password validation
   - Stores refresh tokens in database
   - Implements token refresh flow (revokes old, creates new)
   - Logout revokes refresh tokens
   - Retrieves current user profile

### 6. API Endpoints ✅

**AuthController** (`api/auth`):

1. **POST /api/auth/login** [AllowAnonymous]
   - Authenticates user with username and password
   - Returns access token, refresh token, expiration, and user info
   - Status: 200 OK (success), 400 Bad Request (invalid input), 401 Unauthorized (wrong credentials)

2. **POST /api/auth/refresh** [AllowAnonymous]
   - Refreshes access token using valid refresh token
   - Returns new access and refresh tokens
   - Status: 200 OK (success), 400 Bad Request (invalid input), 401 Unauthorized (invalid/expired token)

3. **POST /api/auth/logout** [Authorize]
   - Revokes refresh token
   - Requires valid JWT access token
   - Status: 200 OK (success), 400 Bad Request (invalid input)

4. **GET /api/auth/me** [Authorize]
   - Returns current authenticated user's profile
   - Requires valid JWT access token
   - Status: 200 OK (success), 401 Unauthorized (invalid token), 404 Not Found (user not found)

### 7. Authorization Policies ✅

Three authorization policies configured in `Program.cs`:

1. **StaffOrHigher**
   - Allows: SuperAdmin, Admin, Staff
   - Usage: `[Authorize(Policy = "StaffOrHigher")]`

2. **AdminOrHigher**
   - Allows: SuperAdmin, Admin
   - Usage: `[Authorize(Policy = "AdminOrHigher")]`

3. **SuperAdminOnly**
   - Allows: SuperAdmin only
   - Usage: `[Authorize(Policy = "SuperAdminOnly")]`

### 8. JWT Configuration ✅

Added to `appsettings.json`:

```json
{
  "JwtSettings": {
    "SecretKey": "SmartParkingAbreezaSecretKey2024!@#$%^&*()_+1234567890",
    "Issuer": "SmartParkingAPI",
    "Audience": "SmartParkingClient",
    "AccessTokenExpirationMinutes": 60,
    "RefreshTokenExpirationDays": 7
  }
}
```

**Security Note:** In production, use environment variables or Azure Key Vault for the SecretKey.

### 9. Authentication Middleware ✅

Updated `Program.cs` with:
- JWT Bearer authentication configuration
- Token validation parameters (issuer, audience, lifetime, signing key)
- ClockSkew set to zero for precise token expiration
- Authorization policies registration
- `UseAuthentication()` and `UseAuthorization()` middleware

### 10. Swagger JWT Support ✅

Enhanced Swagger UI with JWT authentication:
- Added Bearer security scheme
- "Authorize" button in Swagger UI
- Token input format: `Bearer {token}`
- All authenticated endpoints show lock icon

### 11. Seeded SuperAdmin Account ✅

Default SuperAdmin account created on first run:

| Field | Value |
|-------|-------|
| Username | `superadmin` |
| Password | `Admin@123` |
| Email | `superadmin@ayalamalls.com` |
| Role | SuperAdmin |
| IsActive | true |

**⚠️ IMPORTANT:** Change this password in production!

---

## Authentication Flow

### Login Flow

```
1. User sends POST /api/auth/login with username and password
2. API validates credentials using BCrypt
3. If valid:
   - Generate JWT access token (60 min expiration)
   - Generate refresh token (7 days expiration)
   - Store refresh token in database
   - Return both tokens + user info
4. Client stores tokens (localStorage/sessionStorage)
```

### Authenticated Request Flow

```
1. Client sends request with Authorization header: "Bearer {access_token}"
2. JWT middleware validates token:
   - Signature verification
   - Expiration check
   - Issuer/Audience validation
3. If valid:
   - Extract user claims (UserId, Role, etc.)
   - Set HttpContext.User
   - Authorization checks role policies
4. Controller accesses User.Claims
```

### Token Refresh Flow

```
1. When access token expires (401 Unauthorized)
2. Client sends POST /api/auth/refresh with refresh token
3. API validates refresh token:
   - Check if exists and not revoked
   - Check if not expired
4. If valid:
   - Revoke old refresh token
   - Generate new access token
   - Generate new refresh token
   - Return new tokens
5. Client updates stored tokens
```

### Logout Flow

```
1. Client sends POST /api/auth/logout with refresh token
2. API marks refresh token as revoked in database
3. Client clears stored tokens
```

---

## Security Features

### ✅ Password Security
- **BCrypt hashing** with work factor 11 (~100ms per hash)
- Passwords never stored in plain text
- Hashed passwords in database (PasswordHash column)

### ✅ Token Security
- **HMAC-SHA256** signature algorithm
- **256-bit secret key** (52 characters)
- **Short-lived access tokens** (60 minutes) - reduces attack window
- **Long-lived refresh tokens** (7 days) - stored in database, can be revoked
- **Cryptographically secure** refresh token generation (64 random bytes)

### ✅ Token Validation
- Signature verification
- Expiration validation (ClockSkew = 0 for precision)
- Issuer validation (prevents token forgery)
- Audience validation (prevents token misuse)

### ✅ Authorization
- **Role-based access control** (RBAC)
- Three authorization policies for granular control
- `[Authorize]` attribute protection on sensitive endpoints
- Role hierarchy: SuperAdmin > Admin > Staff

### ✅ Database Security
- Refresh tokens can be revoked
- Soft delete support (IsDeleted flag)
- User activation control (IsActive flag)
- Audit trail (CreatedAt, UpdatedAt)

---

## Testing in Swagger

### Step 1: Start the API

```bash
cd "c:\Users\ACER\Downloads\K\Smart Parking\backend"
dotnet run --project src/SmartParking.Presentation/SmartParking.Presentation.csproj
```

### Step 2: Open Swagger UI

Navigate to: http://localhost:5257/swagger

### Step 3: Test Login Endpoint

1. Expand **POST /api/auth/login**
2. Click **"Try it out"**
3. Enter request body:

```json
{
  "username": "superadmin",
  "password": "Admin@123"
}
```

4. Click **"Execute"**
5. Expected Response (200 OK):

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "Wm9D8k3mL2pN7qR4sT6vU9wX0yA1bC3dE5f...",
  "expiresAt": "2026-06-13T18:37:00Z",
  "user": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "username": "superadmin",
    "email": "superadmin@ayalamalls.com",
    "role": "SuperAdmin",
    "isActive": true
  }
}
```

6. **Copy the accessToken value**

### Step 4: Authorize in Swagger

1. Click **"Authorize"** button (lock icon) at top-right
2. In the "Value" field, enter:
   ```
   Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   *(Replace with your actual token, include "Bearer " prefix)*
3. Click **"Authorize"**
4. Click **"Close"**

### Step 5: Test Protected Endpoint

1. Expand **GET /api/auth/me**
2. Click **"Try it out"**
3. Click **"Execute"**
4. Expected Response (200 OK):

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "username": "superadmin",
  "email": "superadmin@ayalamalls.com",
  "role": "SuperAdmin",
  "isActive": true
}
```

### Step 6: Test Refresh Token

1. Expand **POST /api/auth/refresh**
2. Click **"Try it out"**
3. Enter request body with the refresh token from login:

```json
{
  "refreshToken": "Wm9D8k3mL2pN7qR4sT6vU9wX0yA1bC3dE5f..."
}
```

4. Click **"Execute"**
5. Expected Response (200 OK): New tokens returned

### Step 7: Test Logout

1. Expand **POST /api/auth/logout**
2. Click **"Try it out"**
3. Enter request body with refresh token:

```json
{
  "refreshToken": "Wm9D8k3mL2pN7qR4sT6vU9wX0yA1bC3dE5f..."
}
```

4. Click **"Execute"**
5. Expected Response (200 OK):

```json
{
  "message": "Logged out successfully."
}
```

---

## Testing with cURL

### Login

```bash
curl -X POST "http://localhost:5257/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "superadmin",
    "password": "Admin@123"
  }'
```

### Get Current User

```bash
curl -X GET "http://localhost:5257/api/auth/me" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Refresh Token

```bash
curl -X POST "http://localhost:5257/api/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
  }'
```

### Logout

```bash
curl -X POST "http://localhost:5257/api/auth/logout" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
  }'
```

---

## Project Structure Updates

```
backend/
├── src/
│   ├── SmartParking.Application/
│   │   ├── Common/
│   │   │   ├── DTOs/
│   │   │   │   └── Auth/                         [NEW]
│   │   │   │       ├── LoginRequest.cs
│   │   │   │       ├── LoginResponse.cs
│   │   │   │       ├── RefreshTokenRequest.cs
│   │   │   │       └── UserDto.cs
│   │   │   ├── Interfaces/
│   │   │   │   ├── IApplicationDbContext.cs
│   │   │   │   ├── IPasswordHasher.cs            [NEW]
│   │   │   │   ├── ITokenService.cs              [NEW]
│   │   │   │   └── IAuthService.cs               [NEW]
│   │   │   └── Settings/                         [NEW]
│   │   │       └── JwtSettings.cs
│   │   └── SmartParking.Application.csproj
│   │
│   ├── SmartParking.Infrastructure/
│   │   ├── Services/                             [NEW]
│   │   │   ├── PasswordHasher.cs
│   │   │   ├── TokenService.cs
│   │   │   └── AuthService.cs
│   │   ├── Persistence/
│   │   │   └── Seed/
│   │   │       └── ApplicationDbContextSeed.cs   [UPDATED - Added SuperAdmin]
│   │   ├── DependencyInjection.cs                [UPDATED - Added auth services]
│   │   └── SmartParking.Infrastructure.csproj    [UPDATED - Added packages]
│   │
│   └── SmartParking.Presentation/
│       ├── Controllers/                          [NEW]
│       │   └── AuthController.cs
│       ├── Program.cs                            [UPDATED - Added JWT auth]
│       ├── appsettings.json                      [UPDATED - Added JwtSettings]
│       └── SmartParking.Presentation.csproj      [UPDATED - Added JWT package]
```

---

## Database Changes

### Users Table
No schema changes needed - already had PasswordHash column from Phase 1.

**Sample Data Added:**
- 1 SuperAdmin user (username: superadmin, email: superadmin@ayalamalls.com)

### RefreshTokens Table
No schema changes needed - already configured in Phase 1.

**Usage:**
- Stores active and revoked refresh tokens
- Linked to Users table via UserId (CASCADE DELETE)
- Indexed on Token (unique), UserId, and ExpiryDate

---

## Configuration Files

### appsettings.json

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore": "Information"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=SmartParkingDb;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "JwtSettings": {
    "SecretKey": "SmartParkingAbreezaSecretKey2024!@#$%^&*()_+1234567890",
    "Issuer": "SmartParkingAPI",
    "Audience": "SmartParkingClient",
    "AccessTokenExpirationMinutes": 60,
    "RefreshTokenExpirationDays": 7
  }
}
```

### appsettings.Development.json

Can override JwtSettings for development (e.g., shorter token expiration for testing).

---

## Success Criteria - All Met ✅

- ✅ Solution compiles with zero errors
- ✅ JWT authentication implemented
- ✅ BCrypt password hashing implemented
- ✅ Access token generation working
- ✅ Refresh token generation and storage working
- ✅ Login endpoint functional
- ✅ Refresh token endpoint functional
- ✅ Logout endpoint functional
- ✅ Current user endpoint functional
- ✅ Three authorization policies defined
- ✅ SuperAdmin account seeded
- ✅ Swagger JWT bearer support enabled
- ✅ Authentication middleware configured
- ✅ Authorization middleware configured
- ✅ Guest users remain anonymous (NOT in database)
- ✅ Only 3 authenticated roles: SuperAdmin, Admin, Staff

---

## What Was NOT Implemented (By Design)

As requested, Phase 2 focused ONLY on authentication and authorization:
- ❌ React Frontend
- ❌ SignalR real-time features
- ❌ Parking CRUD APIs
- ❌ Prediction Engine
- ❌ Notification System
- ❌ Incident Management
- ❌ Analytics/Reporting
- ❌ IoT Integration

---

## Token Expiration Strategy

### Access Token (60 minutes)
- **Short-lived** for security
- Contains user claims (id, username, email, role)
- Used for every API request
- Cannot be revoked (stateless)
- When expired, client must refresh

### Refresh Token (7 days)
- **Long-lived** for convenience
- Stored in database (can be revoked)
- Used only for obtaining new access tokens
- Single use (revoked after refresh)
- Expires after 7 days or on logout

### Why This Strategy?
- **Short access tokens** limit damage if stolen
- **Long refresh tokens** reduce login frequency
- **Database-stored refresh tokens** can be revoked immediately
- **Token rotation** (new refresh token on each refresh) prevents replay attacks

---

## Common Issues & Solutions

### Issue 1: "401 Unauthorized" on Protected Endpoints

**Cause:** Missing or invalid Authorization header

**Solution:**
```
Include header: Authorization: Bearer {your_access_token}
```

### Issue 2: Access Token Expired

**Cause:** Token lifetime exceeded (60 minutes)

**Solution:** Call `/api/auth/refresh` with refresh token

### Issue 3: Refresh Token Expired

**Cause:** Refresh token lifetime exceeded (7 days) or revoked

**Solution:** User must login again with username/password

### Issue 4: "Invalid or expired refresh token"

**Possible Causes:**
- Refresh token already used (single use)
- Refresh token revoked (logout called)
- Refresh token expired (7 days passed)
- Refresh token not found in database

**Solution:** User must login again

### Issue 5: Cannot Login with SuperAdmin

**Check:**
1. Username is exactly `superadmin` (case-sensitive in DB)
2. Password is exactly `Admin@123`
3. Database seeded (check Users table)
4. User IsActive = true and IsDeleted = false

---

## Security Best Practices

### ✅ Implemented

1. **BCrypt Password Hashing** - Slow, secure, salted
2. **JWT Signature** - HMAC-SHA256 prevents tampering
3. **Short Access Token Lifetime** - Limits attack window
4. **Refresh Token Rotation** - New refresh token on each use
5. **Refresh Token Revocation** - Stored in DB, can be invalidated
6. **HTTPS Enforcement** - `UseHttpsRedirection()` in production
7. **CORS Configuration** - Limited to specific origins

### ⚠️ Production Recommendations

1. **Secret Key:** Move to environment variables or Azure Key Vault
2. **Password Policy:** Enforce complexity (uppercase, numbers, symbols, min length)
3. **Rate Limiting:** Add rate limiting to login endpoint (prevent brute force)
4. **Account Lockout:** Lock account after N failed login attempts
5. **Audit Logging:** Log all authentication events (login, logout, failed attempts)
6. **HTTPS Only:** Enforce HTTPS in production (no HTTP)
7. **Change Default Password:** Change SuperAdmin password immediately
8. **Token Blacklist:** Consider adding token blacklist for emergency revocation
9. **Multi-Factor Authentication (MFA):** Add 2FA for SuperAdmin accounts

---

## Next Steps (Future Phases)

Phase 2 provides secure authentication and authorization. Future phases can now build protected APIs:

### Phase 3: Parking Management APIs
- Use `[Authorize(Policy = "StaffOrHigher")]` on parking endpoints
- Track which user created/updated entities

### Phase 4: Real-Time Features
- Authenticate SignalR connections using JWT
- Send user-specific real-time notifications

### Phase 5: User Management (Future)
- Register new users (Admin/Staff)
- Update user profiles
- Change passwords
- Deactivate accounts

---

## Commands Reference

### Run API

```bash
cd "c:\Users\ACER\Downloads\K\Smart Parking\backend"
dotnet run --project src/SmartParking.Presentation/SmartParking.Presentation.csproj
```

### Build Solution

```bash
dotnet build
```

### Check Users in Database

```bash
dotnet ef dbcontext scaffold "Server=(localdb)\mssqllocaldb;Database=SmartParkingDb;Trusted_Connection=True;" Microsoft.EntityFrameworkCore.SqlServer --project src/SmartParking.Infrastructure
```

Or use SQL Server Management Studio / Azure Data Studio to query:

```sql
SELECT * FROM users;
SELECT * FROM refresh_tokens;
```

---

## SuperAdmin Login Credentials

### Default SuperAdmin Account

| Field | Value |
|-------|-------|
| **Username** | `superadmin` |
| **Password** | `Admin@123` |
| **Email** | `superadmin@ayalamalls.com` |
| **Role** | SuperAdmin |

**⚠️ SECURITY WARNING:**

This is a development account with a default password. In production:
1. Change the password immediately after first deployment
2. Use a strong password (minimum 16 characters, mixed case, numbers, symbols)
3. Store the password securely (password manager)
4. Enable MFA for SuperAdmin accounts
5. Never commit production credentials to source control

---

## Testing Checklist

To verify Phase 2 completion:

```bash
# 1. Build succeeds
cd "c:\Users\ACER\Downloads\K\Smart Parking\backend"
dotnet build
# Expected: Build succeeded. 0 Error(s)

# 2. Run API
dotnet run --project src/SmartParking.Presentation/SmartParking.Presentation.csproj
# Expected: Now listening on: http://localhost:5257

# 3. Open Swagger
# Navigate to: http://localhost:5257/swagger
# Expected: Swagger UI loads with Authorize button

# 4. Test Login
# POST /api/auth/login with superadmin / Admin@123
# Expected: 200 OK with accessToken and refreshToken

# 5. Test Authorization
# Copy accessToken, click Authorize, paste: Bearer {token}
# GET /api/auth/me
# Expected: 200 OK with user info

# 6. Test Refresh
# POST /api/auth/refresh with refreshToken
# Expected: 200 OK with new tokens

# 7. Test Logout
# POST /api/auth/logout with refreshToken
# Expected: 200 OK with success message
```

---

## Technical Specifications

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | .NET | 9.0 |
| Language | C# | 13.0 |
| Database | SQL Server | LocalDB (v19) |
| ORM | Entity Framework Core | 9.0.0 |
| API Docs | Swagger/Swashbuckle | 7.2.0 |
| Authentication | JWT Bearer | 9.0.0 |
| Password Hashing | BCrypt.Net-Next | 4.2.0 |
| Architecture | Clean Architecture | - |

---

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/login | None | Login with username/password |
| POST | /api/auth/refresh | None | Refresh access token |
| POST | /api/auth/logout | Required | Revoke refresh token |
| GET | /api/auth/me | Required | Get current user profile |

### Authorization Policies

| Policy | Allowed Roles | Usage |
|--------|---------------|-------|
| StaffOrHigher | SuperAdmin, Admin, Staff | General authenticated operations |
| AdminOrHigher | SuperAdmin, Admin | Administrative operations |
| SuperAdminOnly | SuperAdmin | System-wide configuration |

---

## Conclusion

Phase 2: Authentication & Authorization has been **successfully completed**. The system now provides:

✅ **Secure authentication** with JWT access and refresh tokens  
✅ **Role-based authorization** with three granular policies  
✅ **BCrypt password hashing** for maximum security  
✅ **Swagger JWT support** for easy testing  
✅ **SuperAdmin account** seeded for immediate use  
✅ **Comprehensive API documentation**  
✅ **Zero build errors** and fully functional  

The authentication system is production-ready (with recommended security enhancements) and provides a solid foundation for building protected APIs in future phases.

**Phase 2 Status: ✅ COMPLETE**

---

**Default Login Credentials:**
- **Username:** `superadmin`
- **Password:** `Admin@123`

**How to Test in Swagger:**
1. Start API: `dotnet run --project src/SmartParking.Presentation/SmartParking.Presentation.csproj`
2. Open: http://localhost:5257/swagger
3. POST /api/auth/login with above credentials
4. Copy accessToken from response
5. Click "Authorize" button, enter: `Bearer {accessToken}`
6. Test GET /api/auth/me to verify authentication

---

*Generated on: June 13, 2026*  
*Project: Smart Parking Management System for Ayala Malls Abreeza*  
*Phase: 2 - Authentication & Authorization*

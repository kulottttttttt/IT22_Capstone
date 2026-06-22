# Smart Parking API - Authentication Guide

## Quick Start

### Default Credentials

```
Username: superadmin
Password: Admin@123
```

⚠️ **Change this password in production!**

## Testing in Swagger

### Step 1: Start API

```bash
cd "c:\Users\ACER\Downloads\K\Smart Parking\backend"
dotnet run --project src/SmartParking.Presentation/SmartParking.Presentation.csproj
```

### Step 2: Open Swagger

Navigate to: **http://localhost:5257/swagger**

### Step 3: Login

1. Find **POST /api/auth/login**
2. Click **"Try it out"**
3. Enter:

```json
{
  "username": "superadmin",
  "password": "Admin@123"
}
```

4. Click **"Execute"**
5. **Copy the `accessToken`** from the response

### Step 4: Authorize

1. Click the **"Authorize"** button (lock icon) at the top
2. Paste in the Value field:

```
Bearer YOUR_ACCESS_TOKEN_HERE
```

*Important: Include "Bearer " before the token!*

3. Click **"Authorize"**
4. Click **"Close"**

### Step 5: Test Protected Endpoint

1. Find **GET /api/auth/me**
2. Click **"Try it out"**
3. Click **"Execute"**
4. You should see your user profile!

## API Endpoints

### 1. Login
**POST** `/api/auth/login`

**Request:**
```json
{
  "username": "superadmin",
  "password": "Admin@123"
}
```

**Response (200 OK):**
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

### 2. Get Current User
**GET** `/api/auth/me`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200 OK):**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "username": "superadmin",
  "email": "superadmin@ayalamalls.com",
  "role": "SuperAdmin",
  "isActive": true
}
```

### 3. Refresh Token
**POST** `/api/auth/refresh`

**Request:**
```json
{
  "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "NEW_REFRESH_TOKEN_HERE",
  "expiresAt": "2026-06-13T19:37:00Z",
  "user": { ... }
}
```

### 4. Logout
**POST** `/api/auth/logout`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Request:**
```json
{
  "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
}
```

**Response (200 OK):**
```json
{
  "message": "Logged out successfully."
}
```

## cURL Examples

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

## Authorization Policies

Use these in your controllers:

### Staff or Higher
```csharp
[Authorize(Policy = "StaffOrHigher")]
public async Task<IActionResult> ViewParkingSlots()
{
    // SuperAdmin, Admin, or Staff can access
}
```

### Admin or Higher
```csharp
[Authorize(Policy = "AdminOrHigher")]
public async Task<IActionResult> ManageZones()
{
    // SuperAdmin or Admin can access
}
```

### SuperAdmin Only
```csharp
[Authorize(Policy = "SuperAdminOnly")]
public async Task<IActionResult> ManageUsers()
{
    // Only SuperAdmin can access
}
```

## Roles

### SuperAdmin
- Full system access
- Can manage all users, zones, and settings
- Cannot be created via API (must be seeded or added directly to DB)

### Admin
- Manage parking areas, zones, and slots
- View reports and analytics
- Cannot manage other admins

### Staff
- View parking status
- Update slot availability
- Report incidents

### Guest (Anonymous)
- **NOT stored in database**
- No authentication required
- Can only view public parking availability (future feature)

## Token Lifetimes

| Token Type | Lifetime | Stored in DB | Can be Revoked |
|------------|----------|--------------|----------------|
| Access Token | 60 minutes | No | No (stateless) |
| Refresh Token | 7 days | Yes | Yes |

## Authentication Flow

```
┌─────────┐
│ Client  │
└────┬────┘
     │
     │ 1. POST /api/auth/login
     │    { username, password }
     ▼
┌──────────────┐
│   API        │
│  Validates   │
│  Password    │
└────┬─────────┘
     │
     │ 2. Returns tokens
     ▼
┌─────────────────────────┐
│ Access Token (60 min)   │
│ Refresh Token (7 days)  │
└────┬────────────────────┘
     │
     │ 3. Client stores tokens
     │
     │ 4. Every request includes:
     │    Authorization: Bearer {access_token}
     ▼
┌──────────────┐
│  Protected   │
│  Endpoints   │
└──────────────┘
```

## Common Errors

### 401 Unauthorized
**Cause:** Missing, invalid, or expired access token

**Solution:**
- Check Authorization header format: `Bearer {token}`
- Verify token hasn't expired (60 min)
- If expired, call /api/auth/refresh

### 400 Bad Request
**Cause:** Invalid request body

**Solution:**
- Check JSON format
- Verify required fields are present
- Check field names match exactly

### 404 Not Found
**Cause:** User not found or deleted

**Solution:**
- Verify user exists in database
- Check IsDeleted = false
- Check IsActive = true

## Security Notes

### Development
- Default password for testing
- Secret key in appsettings.json
- Logs show full error details

### Production Recommendations
1. **Change SuperAdmin password** immediately
2. **Move SecretKey** to environment variables
3. **Enable HTTPS** only
4. **Add rate limiting** to login endpoint
5. **Implement account lockout** after failed attempts
6. **Add audit logging** for authentication events
7. **Use strong passwords** (16+ chars, mixed case, numbers, symbols)
8. **Enable MFA** for SuperAdmin accounts

## Configuration

Located in `appsettings.json`:

```json
{
  "JwtSettings": {
    "SecretKey": "Your-Secret-Key-Here-Min-256-Bits",
    "Issuer": "SmartParkingAPI",
    "Audience": "SmartParkingClient",
    "AccessTokenExpirationMinutes": 60,
    "RefreshTokenExpirationDays": 7
  }
}
```

**Production:**
Use environment variables:

```bash
export JwtSettings__SecretKey="your-production-secret-key"
export JwtSettings__AccessTokenExpirationMinutes=30
```

## Troubleshooting

### Cannot login with superadmin
1. Check database seeded: `SELECT * FROM users WHERE username = 'superadmin'`
2. Verify password is exactly: `Admin@123`
3. Check IsActive = 1 and IsDeleted = 0

### Token expired immediately
1. Check system time is correct
2. Verify ClockSkew setting in Program.cs
3. Check token expiration in response

### Refresh token invalid
1. Verify refresh token exists: `SELECT * FROM refresh_tokens WHERE token = 'YOUR_TOKEN'`
2. Check IsRevoked = 0
3. Check ExpiryDate > GETUTCDATE()

### Cannot authorize in Swagger
1. Ensure you include "Bearer " prefix
2. Check token has no extra spaces or line breaks
3. Try copying token again from login response

---

**Need Help?**
- Check Phase 2 Completion document for detailed info
- Review Swagger UI for endpoint documentation
- Check application logs for error details

**Last Updated:** June 13, 2026

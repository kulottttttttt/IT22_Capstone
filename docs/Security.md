# Smart Parking Abreeza — Security Architecture
## Standards for Authentication, Authorization, and Data Protection

---

# 1. Security Philosophy

The system prioritizes **Data Integrity** (accurate parking status) and **Public Availability** (Guest access).

- **Authentication:** JWT with Refresh Tokens.
- **Authorization:** Role-Based Access Control (RBAC).
- **Integrity:** Protection against unauthorized slot state manipulation.

---

# 2. Authentication Flow

- **Login:** Returns a short-lived Access Token (15 mins) and a long-lived Refresh Token (7 days).
- **Storage:** React frontend stores JWT in memory; Refresh Token is stored in an `HttpOnly`, `Secure` cookie to prevent XSS.
- **Public Access:** The `/api/public/` endpoints bypass JWT requirements to allow Guests to view maps.

---

# 3. Role Permissions

| Resource | Guest | Staff | Admin | SuperAdmin |
|---|---|---|---|---|
| View Live Map | ✅ | ✅ | ✅ | ✅ |
| View Forecasts | ✅ | ✅ | ✅ | ✅ |
| Update Slot Status | ❌ | ✅ | ✅ | ✅ |
| Configure Zones | ❌ | ❌ | ✅ | ✅ |
| Manage Users | ❌ | ❌ | ❌ | ✅ |
| System Settings | ❌ | ❌ | ❌ | ✅ |

---

# 4. API Security Rules

1. **Rate Limiting:** Public endpoints are limited to 60 requests per minute per IP to prevent scraping.
2. **CORS:** Only allowed for the official Abreeza web domain.
3. **Input Validation:** All administrative inputs (X/Y coordinates, slot names) are validated via FluentValidation.
4. **SignalR Security:** Only authenticated users can broadcast `StatusUpdate` messages; Guest connections are "Listen Only."

---

# 5. Data Protection

- **Password Hashing:** BCrypt.Net-Next.
- **SQL Injection:** Entirely prevented by EF Core Parameterized Queries.
- **XSS Prevention:** React automatically escapes all data rendered in the UI.
- **Environment Secrets:** JWT keys and DB strings are stored in Azure Key Vault / Environment Variables (never in code).

---

# 6. Audit System

Every "Write" operation on the `ParkingSlot` table must generate an entry in the `AuditLogs` table.
- **Who:** The authenticated UserId.
- **What:** The SlotId and the status change.
- **When:** UTC Timestamp.
- **Source:** IP address and user agent.
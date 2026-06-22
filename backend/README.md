# Smart Parking Management System - Backend

Real-Time Web-Based Smart Parking Management System for Ayala Malls Abreeza

## Technology Stack

- **.NET 9.0** - Framework
- **ASP.NET Core 9** - Web API
- **Entity Framework Core 9** - ORM
- **SQL Server LocalDB** - Database
- **Clean Architecture** - Project structure
- **Swagger/OpenAPI** - API documentation

## Project Structure

```
SmartParking.sln
├── SmartParking.Domain          # Core business entities, enums, base classes
├── SmartParking.Application     # Application interfaces and services
├── SmartParking.Infrastructure  # Data access, EF Core, external services
└── SmartParking.Presentation    # API controllers, endpoints, Swagger
```

## Getting Started

### Prerequisites

- .NET 9 SDK or later
- SQL Server LocalDB (included with Visual Studio or SQL Server Express)
- EF Core CLI tools (install globally if not present):
  ```bash
  dotnet tool install --global dotnet-ef
  ```

### Setup & Run

1. **Clone the repository** (if from source control)

2. **Navigate to the backend directory:**
   ```bash
   cd "c:\Users\ACER\Downloads\K\Smart Parking\backend"
   ```

3. **Restore packages:**
   ```bash
   dotnet restore
   ```

4. **Build the solution:**
   ```bash
   dotnet build
   ```

5. **Apply database migrations:**
   ```bash
   dotnet ef database update --project src/SmartParking.Infrastructure/SmartParking.Infrastructure.csproj --startup-project src/SmartParking.Presentation/SmartParking.Presentation.csproj
   ```

6. **Run the API:**
   ```bash
   dotnet run --project src/SmartParking.Presentation/SmartParking.Presentation.csproj
   ```

7. **Access Swagger UI:**
   - Navigate to: http://localhost:5257/swagger

## Database

### Connection String

Located in `src/SmartParking.Presentation/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=SmartParkingDb;Trusted_Connection=true;"
  }
}
```

### Entity Framework Core Commands

**Create a new migration:**
```bash
dotnet ef migrations add <MigrationName> \
  --project src/SmartParking.Infrastructure/SmartParking.Infrastructure.csproj \
  --startup-project src/SmartParking.Presentation/SmartParking.Presentation.csproj \
  --output-dir Persistence/Migrations
```

**Apply migrations to database:**
```bash
dotnet ef database update \
  --project src/SmartParking.Infrastructure/SmartParking.Infrastructure.csproj \
  --startup-project src/SmartParking.Presentation/SmartParking.Presentation.csproj
```

**Remove last migration (if not applied):**
```bash
dotnet ef migrations remove \
  --project src/SmartParking.Infrastructure/SmartParking.Infrastructure.csproj \
  --startup-project src/SmartParking.Presentation/SmartParking.Presentation.csproj
```

**List all migrations:**
```bash
dotnet ef migrations list \
  --project src/SmartParking.Infrastructure/SmartParking.Infrastructure.csproj \
  --startup-project src/SmartParking.Presentation/SmartParking.Presentation.csproj
```

**Drop database (use with caution!):**
```bash
dotnet ef database drop \
  --project src/SmartParking.Infrastructure/SmartParking.Infrastructure.csproj \
  --startup-project src/SmartParking.Presentation/SmartParking.Presentation.csproj
```

## Domain Model

### Entity Hierarchy

```
ParkingArea (1)
  └── Zones (*)
      └── ParkingSlots (*)
          └── SlotStatusHistory (*)
```

### Core Entities

- **ParkingArea** - Top-level parking facility (e.g., Ayala Malls Abreeza)
- **Zone** - Subdivisions within a parking area (e.g., Ground Floor A)
- **ParkingSlot** - Individual parking slots with coordinates
- **SlotStatusHistory** - Historical tracking of slot status changes
- **ParkingIncident** - Incident reports (malfunctions, violations, etc.)
- **User** - System users (SuperAdmin, Admin, Staff roles)
- **RefreshToken** - JWT refresh token management
- **PredictionSnapshot** - Future occupancy predictions
- **Notification** - User notifications
- **AuditLog** - System audit trail
- **SystemSetting** - Configurable system settings

### Enums

- **UserRole** - SuperAdmin, Admin, Staff
- **VehicleType** - Sedan, SUV, Motorcycle, Truck
- **SlotStatus** - Available, Occupied, Maintenance
- **IncidentType** - MalFunction, ViolationParking, Accident, Overcrowding, Vandalism, Other
- **IncidentStatus** - Reported, InProgress, Resolved, Dismissed
- **IncidentSeverity** - Low, Medium, High, Critical
- **NotificationType** - Info, Warning, Alert, IncidentReport
- **NotificationSeverity** - Low, Medium, High, Critical
- **AuditActionType** - Create, Update, Delete, View, Login, Logout, Export
- **ConfidenceLevel** - VeryLow, Low, Medium, High, VeryHigh

## Sample Data

On first run, the database is automatically seeded with:

- **1 Parking Area:** Ayala Malls Abreeza Parking
- **2 Zones:** Ground Floor A (Blue), Ground Floor B (Green)
- **40 Parking Slots:** 20 per zone (GFA-001 to GFA-020, GFB-001 to GFB-020)

## Architecture Rules

### Clean Architecture Layers

1. **Domain** - No dependencies, pure business logic
2. **Application** - Depends on Domain, contains interfaces
3. **Infrastructure** - Implements Application interfaces
4. **Presentation** - Orchestrates requests, depends on Application & Infrastructure

### Design Principles

- **Guest Access:** Anonymous users (NOT a database role)
- **Authenticated Roles:** SuperAdmin, Admin, Staff only
- **Soft Deletes:** All entities use `IsDeleted` flag instead of hard deletes
- **Audit Trail:** All entities track CreatedAt, UpdatedAt, CreatedBy
- **GUID Primary Keys:** All entities use GUIDs for primary keys
- **No Cascade Deletes:** FK constraints use `ON DELETE NO ACTION` (except User-owned entities)

## Development Commands

### Build & Clean

```bash
# Build solution
dotnet build

# Clean build artifacts
dotnet clean

# Rebuild (clean + build)
dotnet clean && dotnet build
```

### Run & Watch

```bash
# Run API
dotnet run --project src/SmartParking.Presentation/SmartParking.Presentation.csproj

# Run with hot reload (watches for file changes)
dotnet watch --project src/SmartParking.Presentation/SmartParking.Presentation.csproj
```

### Package Management

```bash
# Add package to a project
dotnet add src/<ProjectName>/<ProjectName>.csproj package <PackageName>

# Add specific version
dotnet add src/<ProjectName>/<ProjectName>.csproj package <PackageName> --version <Version>

# Remove package
dotnet remove src/<ProjectName>/<ProjectName>.csproj package <PackageName>

# List packages in a project
dotnet list src/<ProjectName>/<ProjectName>.csproj package

# Restore all packages
dotnet restore
```

## API Endpoints

Currently, the API has no controllers implemented. This is Phase 1 (Backend Foundation).

Future phases will add:
- Authentication endpoints (login, register, refresh token)
- ParkingArea CRUD
- Zone CRUD
- ParkingSlot CRUD with real-time status updates
- Incident management
- Analytics & reporting

## Configuration

### Connection String

Edit `src/SmartParking.Presentation/appsettings.json` to change database connection:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "YOUR_CONNECTION_STRING_HERE"
  }
}
```

### CORS

Default CORS origins for frontend (configured in `Program.cs`):
- http://localhost:5173 (Vite default)
- http://localhost:3000 (Create React App default)

To add more origins, edit `Program.cs`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000", "YOUR_ORIGIN")
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});
```

## Troubleshooting

### Issue: "Connection to database failed"

**Solution:** Ensure SQL Server LocalDB is installed and running:
```bash
sqllocaldb start mssqllocaldb
```

### Issue: "Migration already applied"

**Solution:** If you need to revert, drop the database and recreate:
```bash
dotnet ef database drop --force --project src/SmartParking.Infrastructure/SmartParking.Infrastructure.csproj --startup-project src/SmartParking.Presentation/SmartParking.Presentation.csproj
dotnet ef database update --project src/SmartParking.Infrastructure/SmartParking.Infrastructure.csproj --startup-project src/SmartParking.Presentation/SmartParking.Presentation.csproj
```

### Issue: "Port 5257 already in use"

**Solution:** Change the port in `src/SmartParking.Presentation/Properties/launchSettings.json`:
```json
"applicationUrl": "http://localhost:YOUR_PORT"
```

### Issue: "dotnet-ef command not found"

**Solution:** Install EF Core tools globally:
```bash
dotnet tool install --global dotnet-ef
```

## Testing

Phase 1 does not include tests. Future phases will add:
- Unit tests (xUnit)
- Integration tests
- Property-based tests

## License

[Add your license here]

## Contributors

[Add contributors here]

---

**Phase 1 Status:** ✅ Complete  
**Last Updated:** June 13, 2026  
**Next Phase:** Authentication & Authorization

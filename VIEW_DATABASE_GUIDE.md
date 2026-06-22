# How to View SmartParkingDb Database

## Database Information
- **Database Name:** SmartParkingDb
- **Server:** (localdb)\mssqllocaldb
- **Type:** SQL Server LocalDB
- **Connection String:** `Server=(localdb)\\mssqllocaldb;Database=SmartParkingDb;Trusted_Connection=True;TrustServerCertificate=True;`

---

## Method 1: SQL Server Management Studio (SSMS) ⭐ RECOMMENDED

### Installation
1. Download SSMS: https://aka.ms/ssmsfullsetup
2. Install (free, ~600MB download)

### Connect to Database
1. Open SSMS
2. **Server name:** `(localdb)\mssqllocaldb`
3. **Authentication:** Windows Authentication
4. Click **Connect**

### View Data
1. Expand **Databases** → **SmartParkingDb**
2. Expand **Tables** → **dbo**
3. Right-click any table (e.g., `ParkingSlots`) → **Select Top 1000 Rows**

### Useful Queries
```sql
-- View all parking slots with zone info
SELECT 
    ps.Id, ps.SlotNumber, ps.Status, ps.VehicleType,
    z.Name AS ZoneName, pa.Name AS ParkingAreaName
FROM ParkingSlots ps
INNER JOIN Zones z ON ps.ZoneId = z.Id
INNER JOIN ParkingAreas pa ON z.ParkingAreaId = pa.Id
ORDER BY ps.SlotNumber;

-- Count slots by status
SELECT Status, COUNT(*) AS Count
FROM ParkingSlots
GROUP BY Status;

-- View all users
SELECT Id, Username, Email, Role, CreatedAt
FROM Users;
```

---

## Method 2: Visual Studio SQL Server Object Explorer

### Access
1. Open Visual Studio 2022
2. Go to **View** → **SQL Server Object Explorer** (or press `Ctrl+\, Ctrl+S`)

### Connect
1. Expand **SQL Server**
2. Look for **(localdb)\mssqllocaldb**
3. If not visible, click **Add SQL Server** → Enter `(localdb)\mssqllocaldb`

### View Data
1. Expand **(localdb)\mssqllocaldb** → **Databases** → **SmartParkingDb** → **Tables**
2. Right-click any table → **View Data**
3. Right-click any table → **New Query** (to write SQL)

---

## Method 3: Command Line (sqlcmd)

### Open PowerShell and Run:
```powershell
# Connect to database
sqlcmd -S "(localdb)\mssqllocaldb" -d SmartParkingDb -E

# Once connected, run queries:
SELECT * FROM Users;
GO

SELECT COUNT(*) AS TotalSlots FROM ParkingSlots;
GO

SELECT Status, COUNT(*) AS Count FROM ParkingSlots GROUP BY Status;
GO

# Exit
EXIT
```

### Single Command Queries:
```powershell
# View all tables
sqlcmd -S "(localdb)\mssqllocaldb" -d SmartParkingDb -E -Q "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'"

# View all parking slots
sqlcmd -S "(localdb)\mssqllocaldb" -d SmartParkingDb -E -Q "SELECT TOP 10 * FROM ParkingSlots"

# Count records in each table
sqlcmd -S "(localdb)\mssqllocaldb" -d SmartParkingDb -E -Q "SELECT 'Users' AS TableName, COUNT(*) AS Records FROM Users UNION ALL SELECT 'ParkingAreas', COUNT(*) FROM ParkingAreas UNION ALL SELECT 'Zones', COUNT(*) FROM Zones UNION ALL SELECT 'ParkingSlots', COUNT(*) FROM ParkingSlots"
```

---

## Method 4: Azure Data Studio (Modern Alternative)

### Installation
1. Download: https://aka.ms/azuredatastudio
2. Install (free, cross-platform)

### Connect
1. Open Azure Data Studio
2. Click **New Connection**
3. **Server:** `(localdb)\mssqllocaldb`
4. **Authentication Type:** Windows Authentication
5. **Database:** SmartParkingDb
6. Click **Connect**

### Features
- Modern UI
- Dark theme
- IntelliSense for SQL
- Built-in charts and visualizations

---

## Method 5: Entity Framework Core CLI

### View Data via EF Core Tools
```powershell
cd "c:\Users\ACER\Downloads\K\Smart Parking\backend\src\SmartParking.Presentation"

# View all migrations
dotnet ef migrations list

# View database connection
dotnet ef dbcontext info

# Generate SQL script for current migration
dotnet ef migrations script
```

---

## Database File Location

LocalDB stores database files in:
```
C:\Users\ACER\AppData\Local\Microsoft\Microsoft SQL Server Local DB\Instances\mssqllocaldb\
```

Or find with PowerShell:
```powershell
sqlcmd -S "(localdb)\mssqllocaldb" -d SmartParkingDb -E -Q "SELECT physical_name FROM sys.database_files"
```

---

## Quick Data Verification

Run this PowerShell script to check your data:

```powershell
# Save as check-database.ps1
$queries = @(
    "SELECT COUNT(*) AS UserCount FROM Users",
    "SELECT COUNT(*) AS ParkingAreaCount FROM ParkingAreas",
    "SELECT COUNT(*) AS ZoneCount FROM Zones",
    "SELECT COUNT(*) AS SlotCount FROM ParkingSlots",
    "SELECT Status, COUNT(*) AS Count FROM ParkingSlots GROUP BY Status"
)

foreach ($query in $queries) {
    Write-Host "`nExecuting: $query" -ForegroundColor Cyan
    sqlcmd -S "(localdb)\mssqllocaldb" -d SmartParkingDb -E -Q $query -h -1
}
```

---

## Troubleshooting

### "Cannot connect to (localdb)\mssqllocaldb"
1. Check if LocalDB is installed:
   ```powershell
   sqllocaldb info
   ```
2. Start LocalDB instance:
   ```powershell
   sqllocaldb start mssqllocaldb
   ```
3. Check instance status:
   ```powershell
   sqllocaldb info mssqllocaldb
   ```

### Database doesn't exist
Run migrations:
```powershell
cd "c:\Users\ACER\Downloads\K\Smart Parking\backend\src\SmartParking.Presentation"
dotnet ef database update
```

### Permission issues
- LocalDB uses Windows Authentication
- Your Windows user account automatically has full access
- No password required

---

## Current Database Schema

### Tables:
1. **Users** - System users (SuperAdmin, Admin, Staff)
2. **ParkingAreas** - Parking facilities (e.g., Ayala Malls Abreeza)
3. **Zones** - Sections within parking areas (e.g., Zone A, B, C, D)
4. **ParkingSlots** - Individual parking spaces
5. **SlotStatusHistory** - Historical status changes
6. **Incidents** - Reported issues
7. **Notifications** - System notifications
8. **Predictions** - AI predictions for occupancy
9. **AuditLogs** - System activity tracking
10. **__EFMigrationsHistory** - EF Core migration tracking

### Seeded Data:
- 1 SuperAdmin user (username: `superadmin`, password: `Admin@123`)
- 1 Parking Area (Ayala Malls Abreeza Ground Floor)
- 4 Zones (A, B, C, D)
- 145 Parking Slots

---

## Recommended Workflow

**For Beginners:**
1. Install **SSMS** (most user-friendly)
2. Connect with `(localdb)\mssqllocaldb`
3. Browse tables visually

**For Quick Checks:**
1. Use **sqlcmd** in PowerShell
2. Run quick queries without opening GUI tools

**For Development:**
1. Use **Visual Studio SQL Server Object Explorer**
2. Keep it open while coding
3. Quick access to data during debugging

---

## Need Help?

If you encounter issues:
1. Check if backend is running (it creates the database on first run)
2. Verify LocalDB is installed: `sqllocaldb info`
3. Check connection string in `appsettings.json`
4. Run migrations: `dotnet ef database update`

# Quick Database Viewer for SmartParkingDb
# Run this script to view database contents

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SmartParkingDb Database Viewer" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$server = "(localdb)\mssqllocaldb"
$database = "SmartParkingDb"

# Check if LocalDB is running
Write-Host "Checking LocalDB status..." -ForegroundColor Yellow
try {
    $status = sqllocaldb info mssqllocaldb 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Starting LocalDB..." -ForegroundColor Yellow
        sqllocaldb start mssqllocaldb
        Start-Sleep -Seconds 2
    }
    Write-Host "✓ LocalDB is running" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "✗ Error: LocalDB not found. Please install SQL Server LocalDB." -ForegroundColor Red
    exit 1
}

# Function to run query and display results
function Run-Query {
    param (
        [string]$Title,
        [string]$Query
    )
    
    Write-Host "----------------------------------------" -ForegroundColor Gray
    Write-Host "$Title" -ForegroundColor Cyan
    Write-Host "----------------------------------------" -ForegroundColor Gray
    
    try {
        $result = sqlcmd -S $server -d $database -E -Q $query -W -s "," -h -1 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host $result
        } else {
            Write-Host "✗ Query failed or database not found" -ForegroundColor Red
            Write-Host "Run backend first to create database" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "✗ Error executing query" -ForegroundColor Red
    }
    Write-Host ""
}

# Database Overview
Run-Query "DATABASE OVERVIEW" @"
SELECT 
    'Users' AS [Table], COUNT(*) AS [Records] FROM Users
UNION ALL SELECT 'ParkingAreas', COUNT(*) FROM ParkingAreas
UNION ALL SELECT 'Zones', COUNT(*) FROM Zones
UNION ALL SELECT 'ParkingSlots', COUNT(*) FROM ParkingSlots
UNION ALL SELECT 'SlotStatusHistory', COUNT(*) FROM SlotStatusHistory
UNION ALL SELECT 'Incidents', COUNT(*) FROM Incidents
UNION ALL SELECT 'Notifications', COUNT(*) FROM Notifications
UNION ALL SELECT 'Predictions', COUNT(*) FROM Predictions
UNION ALL SELECT 'AuditLogs', COUNT(*) FROM AuditLogs
ORDER BY [Table];
"@

# Users
Run-Query "USERS" @"
SELECT Id, Username, Email, Role, IsActive, CreatedAt 
FROM Users;
"@

# Parking Areas
Run-Query "PARKING AREAS" @"
SELECT Id, Name, [Description], [Address], IsActive, CreatedAt 
FROM ParkingAreas;
"@

# Zones
Run-Query "ZONES" @"
SELECT 
    z.Id, 
    z.Name AS ZoneName, 
    z.FloorLevel, 
    z.Color,
    pa.Name AS ParkingAreaName,
    z.IsActive
FROM Zones z
INNER JOIN ParkingAreas pa ON z.ParkingAreaId = pa.Id
ORDER BY z.SortOrder;
"@

# Parking Slots Summary
Run-Query "PARKING SLOTS SUMMARY" @"
SELECT 
    [Status],
    COUNT(*) AS [Count],
    CAST(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM ParkingSlots) AS DECIMAL(5,2)) AS [Percentage]
FROM ParkingSlots
GROUP BY [Status]
ORDER BY [Count] DESC;
"@

# Sample Parking Slots
Run-Query "SAMPLE PARKING SLOTS (First 20)" @"
SELECT TOP 20
    ps.Id,
    ps.SlotNumber,
    ps.Status,
    ps.VehicleType,
    z.Name AS ZoneName,
    ps.LastUpdated
FROM ParkingSlots ps
INNER JOIN Zones z ON ps.ZoneId = z.Id
ORDER BY ps.SlotNumber;
"@

# Recent Incidents
Run-Query "RECENT INCIDENTS (Last 10)" @"
SELECT TOP 10
    Id,
    Title,
    Priority,
    Status,
    CreatedAt
FROM Incidents
ORDER BY CreatedAt DESC;
"@

# Recent Predictions
Run-Query "RECENT PREDICTIONS (Last 5)" @"
SELECT TOP 5
    Id,
    ParkingAreaId,
    PredictedOccupancy,
    Confidence,
    PredictionWindow,
    CreatedAt
FROM Predictions
ORDER BY CreatedAt DESC;
"@

# Database File Location
Run-Query "DATABASE FILE LOCATION" @"
SELECT 
    name AS [Logical Name],
    physical_name AS [Physical Location],
    CAST(size * 8.0 / 1024 AS DECIMAL(10,2)) AS [Size (MB)]
FROM sys.database_files;
"@

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  End of Database Report" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "TIP: To view data in GUI, use SQL Server Management Studio (SSMS)" -ForegroundColor Yellow
Write-Host "   Connection: (localdb)\mssqllocaldb" -ForegroundColor Yellow
Write-Host ""

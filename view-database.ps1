# Quick Database Viewer for SmartParkingDb
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SmartParkingDb Database Viewer" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$server = "(localdb)\mssqllocaldb"
$database = "SmartParkingDb"

# Check if LocalDB is running
Write-Host "Checking LocalDB status..." -ForegroundColor Yellow
sqllocaldb start mssqllocaldb 2>&1 | Out-Null
Start-Sleep -Seconds 1
Write-Host "LocalDB is ready" -ForegroundColor Green
Write-Host ""

# Database Overview
Write-Host "DATABASE OVERVIEW" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Gray
sqlcmd -S $server -d $database -E -Q "SELECT 'users' AS [Table], COUNT(*) AS [Records] FROM users UNION ALL SELECT 'parking_areas', COUNT(*) FROM parking_areas UNION ALL SELECT 'zones', COUNT(*) FROM zones UNION ALL SELECT 'parking_slots', COUNT(*) FROM parking_slots UNION ALL SELECT 'slot_status_history', COUNT(*) FROM slot_status_history UNION ALL SELECT 'parking_incidents', COUNT(*) FROM parking_incidents UNION ALL SELECT 'notifications', COUNT(*) FROM notifications UNION ALL SELECT 'prediction_snapshots', COUNT(*) FROM prediction_snapshots UNION ALL SELECT 'audit_logs', COUNT(*) FROM audit_logs ORDER BY [Table]" -W -h -1
Write-Host ""

# Users
Write-Host "USERS" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Gray
sqlcmd -S $server -d $database -E -Q "SELECT id, username, email, role, created_at FROM users" -W -h -1
Write-Host ""

# Parking Areas
Write-Host "PARKING AREAS" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Gray
sqlcmd -S $server -d $database -E -Q "SELECT id, name, description, address FROM parking_areas" -W -h -1
Write-Host ""

# Zones
Write-Host "ZONES" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Gray
sqlcmd -S $server -d $database -E -Q "SELECT z.id, z.name AS zone_name, z.map_color_hex AS color, z.sort_order, pa.name AS parking_area FROM zones z INNER JOIN parking_areas pa ON z.parking_area_id = pa.id ORDER BY z.sort_order" -W -h -1
Write-Host ""

# Parking Slots Summary
Write-Host "PARKING SLOTS SUMMARY BY STATUS" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Gray
sqlcmd -S $server -d $database -E -Q "SELECT current_status, COUNT(*) AS count FROM parking_slots GROUP BY current_status ORDER BY count DESC" -W -h -1
Write-Host ""
Write-Host "Status Legend: 0=Available, 1=Occupied, 2=Maintenance" -ForegroundColor Gray
Write-Host ""

# Parking Slots by Zone
Write-Host "PARKING SLOTS BY ZONE" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Gray
sqlcmd -S $server -d $database -E -Q "SELECT z.name AS zone, COUNT(*) AS total_slots, SUM(CASE WHEN ps.current_status = 0 THEN 1 ELSE 0 END) AS available, SUM(CASE WHEN ps.current_status = 1 THEN 1 ELSE 0 END) AS occupied, SUM(CASE WHEN ps.current_status = 2 THEN 1 ELSE 0 END) AS maintenance FROM parking_slots ps INNER JOIN zones z ON ps.zone_id = z.id GROUP BY z.name ORDER BY z.name" -W -h -1
Write-Host ""

# Sample Parking Slots
Write-Host "SAMPLE PARKING SLOTS (First 20)" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Gray
sqlcmd -S $server -d $database -E -Q "SELECT TOP 20 ps.id, ps.slot_number, ps.current_status, ps.vehicle_type, z.name AS zone_name, ps.is_sensor_enabled FROM parking_slots ps INNER JOIN zones z ON ps.zone_id = z.id ORDER BY ps.slot_number" -W -h -1
Write-Host ""

# Database File Location
Write-Host "DATABASE FILE LOCATION" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Gray
sqlcmd -S $server -d $database -E -Q "SELECT name AS logical_name, physical_name, CAST(size * 8.0 / 1024 AS DECIMAL(10,2)) AS size_mb FROM sys.database_files" -W -h -1
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  End of Database Report" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "QUICK ACCESS METHODS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. SQL Server Management Studio (SSMS) - GUI Tool [RECOMMENDED]" -ForegroundColor White
Write-Host "   Download: https://aka.ms/ssmsfullsetup" -ForegroundColor Gray
Write-Host "   Connection: (localdb)\mssqllocaldb" -ForegroundColor Gray
Write-Host "   Then browse: Databases > SmartParkingDb > Tables" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Visual Studio SQL Server Object Explorer" -ForegroundColor White
Write-Host "   View > SQL Server Object Explorer" -ForegroundColor Gray
Write-Host "   Expand: (localdb)\mssqllocaldb > Databases > SmartParkingDb" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Azure Data Studio - Modern Cross-Platform Tool" -ForegroundColor White
Write-Host "   Download: https://aka.ms/azuredatastudio" -ForegroundColor Gray
Write-Host ""
Write-Host "DATABASE FILES LOCATION:" -ForegroundColor Yellow
Write-Host "   C:\Users\ACER\SmartParkingDb.mdf" -ForegroundColor Gray
Write-Host "   C:\Users\ACER\SmartParkingDb_log.ldf" -ForegroundColor Gray
Write-Host ""

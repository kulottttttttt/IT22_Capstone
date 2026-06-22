# How to View Your SmartParkingDb Database

## ✅ Quick Answer

Your database is located at:
- **Server:** `(localdb)\mssqllocaldb`
- **Database Name:** `SmartParkingDb`
- **Physical Files:**
  - `C:\Users\ACER\SmartParkingDb.mdf` (Data file)
  - `C:\Users\ACER\SmartParkingDb_log.ldf` (Log file)

---

## 📊 Current Database Contents

```
Table                    Records
-------------------------  -------
users                          1
parking_areas                  1
zones                          4
parking_slots                125
slot_status_history            0
parking_incidents              0
notifications                  0
prediction_snapshots           0
audit_logs                     0
```

### User Account:
- **Username:** superadmin
- **Email:** superadmin@ayalamalls.com
- **Role:** SuperAdmin (0)

### Parking Data:
- **Parking Area:** Ayala Malls Abreeza Ground Floor
- **Zones:** 4 zones (Zone A, B, C, D)
- **Slots:** 125 total parking slots (all currently available)
  - Zone A: 30 slots
  - Zone B: 40 slots
  - Zone C: 30 slots
  - Zone D: 25 slots

---

## 🚀 Quick View Script (Easiest Method)

Simply run this PowerShell script in your project root:

```powershell
.\view-database.ps1
```

This will display:
- Database overview with record counts
- All users
- Parking areas
- Zones
- Slot statistics
- Sample parking slots
- Database file locations

---

## 🛠️ Method 1: SQL Server Management Studio (SSMS) ⭐ RECOMMENDED

### Why SSMS?
- Full-featured GUI tool
- Browse tables visually
- Write and execute queries easily
- View relationships and diagrams
- Free and industry-standard

### Steps:

**1. Install SSMS:**
- Download: https://aka.ms/ssmsfullsetup
- Install (takes ~5 minutes, ~600MB)

**2. Connect to Database:**
- Open SSMS
- In "Connect to Server" dialog:
  - **Server name:** `(localdb)\mssqllocaldb`
  - **Authentication:** Windows Authentication
  - Click **Connect**

**3. Browse Database:**
- Expand **Databases** in Object Explorer
- Expand **SmartParkingDb**
- Expand **Tables**
- Right-click any table → **Select Top 1000 Rows**

**4. Run Queries:**
- Click **New Query**
- Write SQL and press F5 to execute

### Useful Queries:

```sql
-- View all parking slots with zone info
SELECT 
    ps.slot_number,
    ps.current_status,
    ps.vehicle_type,
    z.name AS zone_name,
    z.map_color_hex AS zone_color,
    ps.is_sensor_enabled
FROM parking_slots ps
INNER JOIN zones z ON ps.zone_id = z.id
ORDER BY ps.slot_number;

-- Count slots by status
SELECT 
    CASE current_status
        WHEN 0 THEN 'Available'
        WHEN 1 THEN 'Occupied'
        WHEN 2 THEN 'Maintenance'
    END AS status_name,
    COUNT(*) AS count
FROM parking_slots
GROUP BY current_status;

-- View all zones with colors
SELECT 
    z.name,
    z.map_color_hex,
    z.description,
    pa.name AS parking_area,
    COUNT(ps.id) AS total_slots
FROM zones z
INNER JOIN parking_areas pa ON z.parking_area_id = pa.id
LEFT JOIN parking_slots ps ON ps.zone_id = z.id
GROUP BY z.name, z.map_color_hex, z.description, pa.name
ORDER BY z.sort_order;

-- View user accounts
SELECT 
    username,
    email,
    CASE role
        WHEN 0 THEN 'SuperAdmin'
        WHEN 1 THEN 'Admin'
        WHEN 2 THEN 'Staff'
    END AS role_name,
    created_at
FROM users;
```

---

## 🛠️ Method 2: Visual Studio SQL Server Object Explorer

### Why Visual Studio?
- Already installed if you have Visual Studio
- Integrated with your development environment
- Quick access while coding

### Steps:

**1. Open SQL Server Object Explorer:**
- In Visual Studio: **View** → **SQL Server Object Explorer**
- Or press: `Ctrl+\, Ctrl+S`

**2. Connect:**
- Expand **SQL Server**
- Look for **(localdb)\mssqllocaldb**
- If not visible:
  - Click **Add SQL Server** icon
  - Enter `(localdb)\mssqllocaldb`
  - Click **Connect**

**3. Browse Database:**
- Expand **(localdb)\mssqllocaldb**
- Expand **Databases**
- Expand **SmartParkingDb**
- Expand **Tables**

**4. View Data:**
- Right-click any table → **View Data**
- Right-click any table → **New Query**

---

## 🛠️ Method 3: Azure Data Studio (Modern Alternative)

### Why Azure Data Studio?
- Modern, cross-platform
- Clean UI with dark theme
- IntelliSense for SQL
- Built-in charts and visualizations

### Steps:

**1. Install:**
- Download: https://aka.ms/azuredatastudio
- Install (free, ~100MB)

**2. Connect:**
- Open Azure Data Studio
- Click **New Connection**
- **Server:** `(localdb)\mssqllocaldb`
- **Authentication:** Windows Authentication
- **Database:** SmartParkingDb
- Click **Connect**

**3. Browse:**
- Expand connection
- Expand **Tables**
- Right-click table → **Select Top 1000**

---

## 🛠️ Method 4: Command Line (sqlcmd)

### Quick Queries:

```powershell
# Connect to database
sqlcmd -S "(localdb)\mssqllocaldb" -d SmartParkingDb -E

# View all users
sqlcmd -S "(localdb)\mssqllocaldb" -d SmartParkingDb -E -Q "SELECT * FROM users"

# Count parking slots
sqlcmd -S "(localdb)\mssqllocaldb" -d SmartParkingDb -E -Q "SELECT COUNT(*) AS TotalSlots FROM parking_slots"

# View zones
sqlcmd -S "(localdb)\mssqllocaldb" -d SmartParkingDb -E -Q "SELECT name, map_color_hex FROM zones"

# View available slots
sqlcmd -S "(localdb)\mssqllocaldb" -d SmartParkingDb -E -Q "SELECT COUNT(*) AS AvailableSlots FROM parking_slots WHERE current_status = 0"
```

---

## 📁 Database Schema Reference

### Tables (snake_case naming):

1. **users**
   - id (GUID)
   - username
   - email
   - password_hash
   - role (0=SuperAdmin, 1=Admin, 2=Staff)
   - created_at

2. **parking_areas**
   - id (GUID)
   - name
   - description
   - address
   - created_at

3. **zones**
   - id (GUID)
   - parking_area_id (FK)
   - name
   - description
   - map_color_hex
   - sort_order
   - created_at

4. **parking_slots**
   - id (GUID)
   - zone_id (FK)
   - slot_number
   - current_status (0=Available, 1=Occupied, 2=Maintenance)
   - vehicle_type (0=Car, 1=Motorcycle, 2=Electric, 3=Disabled, 4=VIP)
   - is_sensor_enabled
   - x_coordinate
   - y_coordinate
   - created_at

5. **slot_status_history**
   - id (GUID)
   - slot_id (FK)
   - old_status
   - new_status
   - changed_at
   - changed_by (FK to users)

6. **parking_incidents**
   - id (GUID)
   - title
   - description
   - incident_type
   - priority_level
   - current_status
   - reported_at

7. **notifications**
   - id (GUID)
   - user_id (FK)
   - title
   - message
   - notification_type
   - is_read
   - created_at

8. **prediction_snapshots**
   - id (GUID)
   - parking_area_id (FK)
   - predicted_occupancy_rate
   - confidence_score
   - forecast_time_window
   - created_at

9. **audit_logs**
   - id (GUID)
   - user_id (FK)
   - action_type
   - entity_type
   - entity_id
   - old_values
   - new_values
   - created_at

---

## 🔍 Troubleshooting

### "Cannot connect to (localdb)\mssqllocaldb"

**Solution 1: Check if LocalDB is installed**
```powershell
sqllocaldb info
```

**Solution 2: Start LocalDB instance**
```powershell
sqllocaldb start mssqllocaldb
```

**Solution 3: Check instance status**
```powershell
sqllocaldb info mssqllocaldb
```

### "Database doesn't exist"

**Solution: Run migrations**
```powershell
cd "backend\src\SmartParking.Presentation"
dotnet ef database update
```

### "No tables in database"

Your backend needs to run at least once to create tables and seed data.

**Solution: Start backend**
```powershell
cd "backend\src\SmartParking.Presentation"
dotnet run
```

---

## 💡 Tips

1. **Always use SSMS for serious database work** - it's the industry standard
2. **Use the view-database.ps1 script** for quick checks during development
3. **Database is created automatically** when you first run the backend
4. **LocalDB uses Windows Authentication** - no password needed
5. **Your Windows user account** has full database access automatically

---

## 📚 Additional Resources

- **SSMS Download:** https://aka.ms/ssmsfullsetup
- **Azure Data Studio:** https://aka.ms/azuredatastudio
- **LocalDB Documentation:** https://learn.microsoft.com/en-us/sql/database-engine/configure-windows/sql-server-express-localdb
- **EF Core Migrations:** https://learn.microsoft.com/en-us/ef/core/managing-schemas/migrations/

---

## 🎯 Recommended Workflow

**For Beginners:**
1. Run `.\view-database.ps1` to see overview
2. Install SSMS for visual browsing
3. Use SSMS to explore tables and run queries

**For Quick Checks:**
1. Run `.\view-database.ps1` in PowerShell
2. No GUI needed

**For Development:**
1. Keep Visual Studio SQL Server Object Explorer open
2. Quick access while coding
3. View data changes in real-time

---

**Created:** June 13, 2026  
**Database:** SmartParkingDb  
**Version:** 1.0

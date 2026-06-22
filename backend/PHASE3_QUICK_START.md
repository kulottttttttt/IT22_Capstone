# Phase 3: Parking Management CRUD - Quick Start Guide

## 🚀 Start the API

```bash
cd backend
dotnet run --project src/SmartParking.Presentation
```

Access Swagger: **https://localhost:7001/swagger**

---

## 🔐 Authentication

### Login as SuperAdmin
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "superadmin",
  "password": "Admin@123"
}
```

**Copy the token** from the response and click **"Authorize"** in Swagger:
```
Bearer <your-token-here>
```

---

## 📋 API Endpoints Summary

### ParkingAreas
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/parking-areas` | None | List all areas |
| GET | `/api/parking-areas/{id}` | None | Get area by ID |
| POST | `/api/parking-areas` | Admin+ | Create area |
| PUT | `/api/parking-areas/{id}` | Admin+ | Update area |
| DELETE | `/api/parking-areas/{id}` | Admin+ | Delete area |

### Zones
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/zones` | None | List all zones |
| GET | `/api/zones/{id}` | None | Get zone by ID |
| GET | `/api/parking-areas/{areaId}/zones` | None | Get zones by area |
| POST | `/api/zones` | Admin+ | Create zone |
| PUT | `/api/zones/{id}` | Admin+ | Update zone |
| DELETE | `/api/zones/{id}` | Admin+ | Delete zone |

### ParkingSlots
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/parking-slots` | None | List all slots |
| GET | `/api/parking-slots/{id}` | None | Get slot by ID |
| GET | `/api/zones/{zoneId}/parking-slots` | None | Get slots by zone |
| POST | `/api/parking-slots` | Admin+ | Create slot |
| PUT | `/api/parking-slots/{id}` | Admin+ | Update slot |
| DELETE | `/api/parking-slots/{id}` | Admin+ | Delete slot |

**Auth Legend:**
- None = Anonymous guest access
- Admin+ = Requires Admin or SuperAdmin role

---

## 📝 Sample Requests

### Create Parking Area
```json
POST /api/parking-areas
{
  "name": "East Wing Parking",
  "address": "Abreeza Mall, East Wing, Davao City",
  "description": "Additional parking facility"
}
```

### Create Zone
```json
POST /api/zones
{
  "parkingAreaId": "<paste-area-id-here>",
  "name": "Level 2 - Section A",
  "description": "Second level parking",
  "mapColorHex": "#FF5733",
  "sortOrder": 3
}
```

### Create Parking Slot
```json
POST /api/parking-slots
{
  "zoneId": "<paste-zone-id-here>",
  "slotNumber": "L2A-001",
  "vehicleType": "Car",
  "xCoordinate": 100,
  "yCoordinate": 50,
  "isSensorEnabled": true
}
```

**Valid Vehicle Types:** `Car`, `Motorcycle`, `SUV`, `Truck`

---

## ✅ Validation Rules

### Zones
- MapColorHex must be in format: `#RRGGBB`
- ParkingAreaId must exist

### ParkingSlots
- SlotNumber must be unique within zone
- VehicleType must be: Car, Motorcycle, SUV, or Truck
- XCoordinate: 0-9999
- YCoordinate: 0-9999
- ZoneId must exist

---

## 🎯 Testing Flow

1. **Login** as SuperAdmin → Get token → Authorize in Swagger
2. **GET** `/api/parking-areas` → View seeded data
3. **POST** `/api/parking-areas` → Create new area → Save ID
4. **POST** `/api/zones` → Create zone for your area → Save ID
5. **POST** `/api/parking-slots` → Create slot for your zone
6. **GET** `/api/zones/{zoneId}/parking-slots` → View slots in zone
7. **PUT** `/api/parking-slots/{id}` → Update slot
8. **DELETE** `/api/parking-slots/{id}` → Soft delete slot

---

## 🗂️ Seeded Data

**ParkingArea:**
- "Abreeza Mall Parking" (1 area)

**Zones:**
- "Level 1 - Section A" (20 slots: A-001 to A-020)
- "Level 1 - Section B" (20 slots: B-001 to B-020)

**Total:** 1 area, 2 zones, 40 parking slots

All slots start with:
- Status: Available
- VehicleType: Car
- IsSensorEnabled: false

---

## 🔧 Build & Verify

```bash
# Build solution
dotnet build

# Expected: Build succeeded with 0 errors

# Run API
dotnet run --project src/SmartParking.Presentation

# Expected: Now listening on https://localhost:7001
```

---

## 📚 Full Documentation

See `PHASE3_COMPLETION.md` for:
- Complete implementation details
- Full testing guide with all scenarios
- Validation testing examples
- Architecture overview
- Next phase recommendations

---

## 🎉 Phase 3 Complete!

✅ 3 CRUD modules (ParkingAreas, Zones, ParkingSlots)  
✅ 17 API endpoints total  
✅ CQRS with MediatR  
✅ FluentValidation  
✅ Role-based authorization  
✅ Soft delete  
✅ Entity relationship validation  
✅ Swagger documentation  
✅ 0 build errors

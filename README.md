# Smart Parking Management System for Ayala Malls Abreeza

A comprehensive enterprise-grade parking management system built with modern technologies, featuring real-time monitoring, predictive analytics, and intelligent automation for Ayala Malls Abreeza.

## 🚀 Features

### Core Functionality
- **Real-Time Monitoring**: Live parking slot status tracking with SignalR WebSocket integration
- **Predictive Analytics**: AI-powered occupancy forecasting with 6-factor hybrid algorithm
- **Interactive Parking Map**: Visual slot grid with color-coded zones and click-to-view details
- **Incident Management**: Complete workflow for reporting and tracking parking incidents
- **Reports & Export**: Generate PDF and Excel reports with print functionality
- **Role-Based Access Control**: Four-tier access (Guest, Staff, Admin, SuperAdmin)

### Technical Highlights
- Clean Architecture with CQRS pattern
- RESTful API with JWT authentication
- Real-time updates via SignalR
- Responsive React UI with TailwindCSS v4
- SQL Server LocalDB with Entity Framework Core 9
- Comprehensive validation with FluentValidation

---

## 📋 Technology Stack

### Backend
- **Framework**: ASP.NET Core 9
- **Architecture**: Clean Architecture + CQRS (MediatR)
- **Database**: SQL Server LocalDB
- **ORM**: Entity Framework Core 9
- **Real-Time**: SignalR
- **Authentication**: JWT Bearer Tokens
- **Validation**: FluentValidation
- **Password Hashing**: BCrypt

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 8
- **Language**: TypeScript 6
- **Styling**: TailwindCSS v4
- **Routing**: React Router v7
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Charts**: Recharts
- **PDF Export**: jsPDF
- **Excel Export**: xlsx

---

## 🏗️ Project Structure

```
Smart Parking/
├── backend/
│   └── src/
│       ├── SmartParking.Domain/          # Entities, Enums, Interfaces
│       ├── SmartParking.Application/     # Business Logic, DTOs, CQRS
│       ├── SmartParking.Infrastructure/  # Data Access, Services
│       └── SmartParking.Presentation/    # API Controllers, SignalR Hub
│
├── frontend/
│   └── src/
│       ├── components/                   # Reusable UI Components
│       ├── pages/                        # Route Pages
│       ├── services/                     # API Services
│       ├── hooks/                        # Custom React Hooks
│       ├── store/                        # Zustand State Management
│       └── types/                        # TypeScript Type Definitions
│
├── docs/                                 # Documentation
└── .kiro/specs/                          # Project Specifications
```

---

## ⚙️ Prerequisites

- **Node.js**: v20.x or higher
- **npm**: v10.x or higher
- **.NET SDK**: 9.0 or higher
- **SQL Server LocalDB**: (included with Visual Studio or SQL Server Express)
- **Git**: Latest version

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/kulottttttttt/IT22_Capstone.git
cd IT22_Capstone
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Restore NuGet packages
dotnet restore

# Apply database migrations
dotnet ef database update --project src/SmartParking.Infrastructure --startup-project src/SmartParking.Presentation

# Run the backend server
cd src/SmartParking.Presentation
dotnet run
```

Backend will be available at:
- **API**: http://localhost:5257
- **Swagger**: http://localhost:5257/swagger
- **SignalR Hub**: http://localhost:5257/hubs/parking

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: **http://localhost:5173/**

---

## 👤 Default Credentials

**SuperAdmin Account:**
- **Username**: `superadmin`
- **Password**: `Admin@123`

**Database Connection:**
- **Server**: `(localdb)\mssqllocaldb`
- **Database**: `SmartParkingDb`
- **Authentication**: Windows Authentication

---

## 📊 Database Schema

### Core Entities
- **ParkingAreas**: Top-level parking facilities
- **Zones**: Subdivisions within parking areas (e.g., Floor 1A, Floor 2B)
- **ParkingSlots**: Individual parking spaces with status tracking
- **SlotStatusHistory**: Historical status changes with timestamps
- **Users**: System users with role-based permissions
- **ParkingIncidents**: Incident tracking and management
- **PredictionSnapshots**: Cached prediction results
- **AuditLogs**: System audit trail

### Status Values
- **Slot Status**: Available, Occupied, Maintenance
- **User Roles**: SuperAdmin, Admin, Staff
- **Incident Status**: Open, InProgress, Resolved, Closed

---

## 🔐 API Authentication

All protected endpoints require JWT Bearer token authentication:

```bash
# Login
POST /api/auth/login
{
  "username": "superadmin",
  "password": "Admin@123"
}

# Use token in subsequent requests
Authorization: Bearer <your-jwt-token>
```

---

## 📡 Real-Time Features (SignalR)

### Hub Endpoint
```
ws://localhost:5257/hubs/parking
```

### Events
- **SlotStatusChanged**: Broadcasts when slot status updates
- **ZoneOccupancyUpdated**: Broadcasts zone occupancy changes
- **ParkingAreaUpdated**: Broadcasts area-wide updates

### Client Usage (Frontend)
```typescript
import { signalRService } from './services/signalRService';

// Connect
await signalRService.connect(token);

// Subscribe to events
signalRService.onSlotStatusChanged((data) => {
  console.log('Slot updated:', data);
});
```

---

## 🧪 Testing

### Backend API Testing

```bash
# Using Swagger UI
http://localhost:5257/swagger

# Using PowerShell (example)
Invoke-RestMethod -Uri "http://localhost:5257/api/parking-areas" -Method GET -Headers @{"Authorization"="Bearer YOUR_TOKEN"}
```

### Frontend Testing

1. Login with SuperAdmin credentials
2. Navigate through all modules:
   - Dashboard (statistics overview)
   - Live Monitoring (real-time slot updates)
   - Parking Map (interactive visual map)
   - Analytics (charts and predictions)
   - Parking Areas (CRUD operations)
   - Zones (CRUD operations)
   - Incidents (incident management)
   - Reports (PDF/Excel exports)

---

## 📈 Prediction Algorithm

**Algorithm Type**: Hybrid Rule-Based Time Series Prediction

**Six-Factor Weighted Model:**
1. **Current Occupancy** (30% weight)
2. **Hourly Pattern** (25% weight) - Peak hours: 8-10 AM, 5-7 PM
3. **Day-of-Week Pattern** (15% weight)
4. **Historical Average** (15% weight)
5. **Peak Hour Reference** (15% weight)
6. **Recent Trend** (±30% adjustment)

**Prediction Windows**: 30 minutes, 1 hour, 2 hours

**Confidence Levels**: High, Medium, Low (based on data quality and variance)

---

## 🗂️ API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token

### Parking Management
- `GET /api/parking-areas` - List all parking areas
- `POST /api/parking-areas` - Create parking area
- `PUT /api/parking-areas/{id}` - Update parking area
- `DELETE /api/parking-areas/{id}` - Delete parking area
- `GET /api/zones` - List all zones
- `POST /api/zones` - Create zone
- `PUT /api/zones/{id}` - Update zone
- `DELETE /api/zones/{id}` - Delete zone
- `GET /api/parking-slots` - List all slots
- `POST /api/parking-slots` - Create slot
- `PUT /api/parking-slots/{id}` - Update slot
- `PATCH /api/parking-slots/{id}/status` - Update slot status
- `DELETE /api/parking-slots/{id}` - Delete slot

### Predictions & Analytics
- `GET /api/predictions/dashboard` - Dashboard predictions
- `GET /api/predictions/zone/{zoneId}` - Zone-specific predictions
- `GET /api/predictions/area/{areaId}` - Area-specific predictions

---

## 📖 Documentation

Comprehensive documentation available in the `docs/` directory:
- **ProjectOverview.md**: System overview and requirements
- **CodeStructure.md**: Architecture and code organization
- **DatabaseStructure.md**: Database schema and relationships
- **Security.md**: Authentication and authorization details
- **UIdesign.md**: UI/UX design specifications

---

## 🛠️ Development Tools

### Recommended Extensions (VS Code)
- **C# Dev Kit**: For backend development
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **Tailwind CSS IntelliSense**: TailwindCSS autocomplete
- **REST Client**: API testing

### Recommended Tools
- **SQL Server Management Studio (SSMS)**: Database management
- **Postman**: API testing
- **Azure Data Studio**: Modern database client

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Clear build artifacts
dotnet clean
dotnet build

# Recreate database
dotnet ef database drop --force
dotnet ef database update
```

### Frontend won't start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Database connection issues
- Ensure SQL Server LocalDB is installed
- Check connection string in `appsettings.json`
- Verify Windows Authentication is enabled

### SignalR connection fails
- Check CORS settings in `Program.cs`
- Ensure JWT token is valid
- Verify SignalR hub endpoint URL

---

## 📝 License

This project is developed as a capstone project for IT22 at Ayala Malls Abreeza.

---

## 👥 Team

**IT22 Capstone Team**
- Smart Parking Management System
- Ayala Malls Abreeza

---

## 📞 Support

For issues, questions, or contributions:
- **GitHub Issues**: [Create an issue](https://github.com/kulottttttttt/IT22_Capstone/issues)
- **Repository**: https://github.com/kulottttttttt/IT22_Capstone

---

## 🎯 Future Enhancements

- [ ] Mobile app integration (React Native)
- [ ] License plate recognition (OCR)
- [ ] Payment gateway integration
- [ ] Advanced ML-based prediction models
- [ ] Multi-language support
- [ ] Email/SMS notification system
- [ ] Automated parking guidance system
- [ ] Integration with mall security systems

---

**Built with ❤️ for Ayala Malls Abreeza**

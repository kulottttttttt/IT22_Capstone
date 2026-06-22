# Smart Parking System - Architecture Overview

## Clean Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Presentation Layer                          │
│                  (SmartParking.Presentation)                    │
│                                                                 │
│  • ASP.NET Core API                                            │
│  • Controllers (future)                                        │
│  • Swagger/OpenAPI                                             │
│  • Program.cs (DI setup)                                       │
│  • Middleware configuration                                    │
└────────────────────────┬────────────────────────────────────────┘
                         │ depends on
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Application Layer                            │
│                 (SmartParking.Application)                      │
│                                                                 │
│  • IApplicationDbContext (interface)                           │
│  • Application services (future)                               │
│  • DTOs (future)                                               │
│  • Validators (future)                                         │
│  • Business logic coordination                                 │
└────────────────────────┬────────────────────────────────────────┘
                         │ depends on
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Domain Layer                               │
│                   (SmartParking.Domain)                         │
│                                                                 │
│  • Entities (11 core entities)                                 │
│  • Enums (11 enums)                                            │
│  • BaseEntity (audit + soft delete)                            │
│  • Domain logic (pure business rules)                          │
│  • No dependencies on other layers                             │
└─────────────────────────────────────────────────────────────────┘
                         ▲
                         │ implements
┌────────────────────────┴────────────────────────────────────────┐
│                  Infrastructure Layer                           │
│                (SmartParking.Infrastructure)                    │
│                                                                 │
│  • ApplicationDbContext (EF Core)                              │
│  • Entity Configurations (11 configs)                          │
│  • Migrations                                                  │
│  • Database seeding                                            │
│  • External service implementations (future)                   │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Database                                   │
│                  (SQL Server LocalDB)                           │
│                                                                 │
│  • SmartParkingDb                                              │
│  • 11 tables                                                   │
│  • 42 indexes                                                  │
│  • Foreign key constraints                                     │
└─────────────────────────────────────────────────────────────────┘
```

## Dependency Flow

```
┌──────────────┐
│ Presentation │──────┐
└──────────────┘      │
                      ▼
┌──────────────┐  ┌──────────────┐
│Infrastructure│─▶│ Application  │
└──────────────┘  └──────────────┘
       │                 │
       │                 │
       └────────┬────────┘
                ▼
         ┌──────────┐
         │  Domain  │ (No dependencies)
         └──────────┘
```

## Entity Relationship Diagram

```
┌──────────────────┐
│  ParkingArea     │
│  ──────────────  │
│  Id              │
│  Name            │
│  Address         │
│  TotalCapacity   │
└────────┬─────────┘
         │ 1
         │
         │ *
┌────────▼─────────┐
│  Zone            │
│  ──────────────  │
│  Id              │
│  ParkingAreaId   │────────────────────────┐
│  Name            │                        │
│  MapColorHex     │                        │
│  SortOrder       │                        │
└────────┬─────────┘                        │
         │ 1                                │
         │                                  │
         │ *                                │
┌────────▼─────────┐                        │
│  ParkingSlot     │                        │
│  ──────────────  │                        │
│  Id              │                        │
│  ZoneId          │                        │
│  SlotNumber      │                        │
│  VehicleType     │                        │
│  CurrentStatus   │                        │
│  XCoordinate     │                        │
│  YCoordinate     │                        │
└────────┬─────────┘                        │
         │ 1                                │
         │                                  │
         │ *                                │
┌────────▼──────────────┐                   │
│  SlotStatusHistory    │                   │
│  ───────────────────  │                   │
│  Id                   │                   │
│  SlotId               │                   │
│  Status               │                   │
│  StartTime            │                   │
│  EndTime              │                   │
│  DurationMinutes      │                   │
└───────────────────────┘                   │
                                            │
┌───────────────────────┐                   │
│  User                 │                   │
│  ───────────────────  │                   │
│  Id                   │                   │
│  Username             │                   │
│  Email                │                   │
│  PasswordHash         │                   │
│  Role                 │                   │
│  IsActive             │                   │
└─────────┬─────────────┘                   │
          │ 1                               │
          │                                 │
          │ *                               │
┌─────────▼─────────────┐                   │
│  RefreshToken         │                   │
│  ───────────────────  │                   │
│  Id                   │                   │
│  UserId               │                   │
│  Token                │                   │
│  ExpiryDate           │                   │
│  IsRevoked            │                   │
└───────────────────────┘                   │
          │ 1                               │
          │                                 │
          │ *                               │
┌─────────▼─────────────┐                   │
│  Notification         │                   │
│  ───────────────────  │                   │
│  Id                   │                   │
│  UserId               │                   │
│  NotificationType     │                   │
│  Severity             │                   │
│  Title                │                   │
│  Message              │                   │
│  IsRead               │                   │
└───────────────────────┘                   │
          │ 1                               │
          │                                 │
          │ *                               │
┌─────────▼─────────────┐                   │
│  AuditLog             │                   │
│  ───────────────────  │                   │
│  Id                   │                   │
│  UserId               │                   │
│  ActionType           │                   │
│  EntityName           │                   │
│  EntityId             │                   │
│  OldValues            │                   │
│  NewValues            │                   │
│  Timestamp            │                   │
└───────────────────────┘                   │
                                            │
┌───────────────────────┐                   │
│  ParkingIncident      │                   │
│  ───────────────────  │                   │
│  Id                   │                   │
│  ParkingAreaId        │───────────────────┘
│  ZoneId               │
│  SlotId               │
│  IncidentType         │
│  Severity             │
│  Status               │
│  Description          │
│  ReportedBy (UserId)  │
│  ReportedAt           │
│  ResolvedBy (UserId)  │
│  ResolvedAt           │
└───────────────────────┘

┌───────────────────────┐
│  PredictionSnapshot   │
│  ───────────────────  │
│  Id                   │
│  ParkingAreaId        │
│  ZoneId               │
│  VehicleType          │
│  ForecastTime         │
│  PredictedOccupancy   │
│  ConfidenceLevel      │
└───────────────────────┘

┌───────────────────────┐
│  SystemSetting        │
│  ───────────────────  │
│  Id                   │
│  SettingKey           │
│  SettingValue         │
│  Description          │
└───────────────────────┘
```

## Request Flow (Future Implementation)

```
┌─────────┐
│ Client  │
└────┬────┘
     │ HTTP Request
     ▼
┌─────────────────────────────────────┐
│  Presentation Layer                 │
├─────────────────────────────────────┤
│  1. Controller receives request     │
│  2. Validates request DTO           │
│  3. Maps DTO to Command/Query       │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│  Application Layer                  │
├─────────────────────────────────────┤
│  4. Handler processes logic         │
│  5. Calls domain services           │
│  6. Uses IApplicationDbContext      │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│  Infrastructure Layer               │
├─────────────────────────────────────┤
│  7. ApplicationDbContext queries    │
│  8. EF Core translates to SQL       │
│  9. Executes against database       │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│  Database                           │
├─────────────────────────────────────┤
│  10. SQL Server processes query     │
│  11. Returns results                │
└────────────────┬────────────────────┘
                 │
                 │ (Results flow back up)
                 ▼
┌─────────────────────────────────────┐
│  Presentation Layer                 │
├─────────────────────────────────────┤
│  12. Maps domain to response DTO    │
│  13. Returns HTTP response          │
└────────────────┬────────────────────┘
                 │
                 ▼
            ┌─────────┐
            │ Client  │
            └─────────┘
```

## Database Schema Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      SmartParkingDb                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Core Parking Infrastructure:                              │
│  • parking_areas (1)                                       │
│  • zones (2 seeded)                                        │
│  • parking_slots (40 seeded)                               │
│  • slot_status_history                                     │
│                                                             │
│  User Management:                                          │
│  • users                                                   │
│  • refresh_tokens                                          │
│                                                             │
│  Incident Management:                                      │
│  • parking_incidents                                       │
│                                                             │
│  Analytics & Predictions:                                  │
│  • prediction_snapshots                                    │
│                                                             │
│  System Features:                                          │
│  • notifications                                           │
│  • audit_logs                                              │
│  • system_settings                                         │
│                                                             │
│  Total Tables: 11                                          │
│  Total Indexes: 42                                         │
│  Total FK Constraints: 14                                  │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

```
┌───────────────────────────────────────────────────────────┐
│  Frontend (Future)                                        │
│  • React 18                                               │
│  • TypeScript                                             │
│  • Tailwind CSS                                           │
│  • SignalR Client                                         │
└────────────────────┬──────────────────────────────────────┘
                     │ HTTP/WebSocket
                     ▼
┌───────────────────────────────────────────────────────────┐
│  Backend API (Current)                                    │
│  • ASP.NET Core 9                                         │
│  • C# 13                                                  │
│  • Entity Framework Core 9                                │
│  • Swagger/OpenAPI                                        │
│  • SignalR (Future)                                       │
└────────────────────┬──────────────────────────────────────┘
                     │ ADO.NET
                     ▼
┌───────────────────────────────────────────────────────────┐
│  Database                                                 │
│  • SQL Server (LocalDB for dev)                           │
│  • SQL Server Express/Standard (production)               │
└───────────────────────────────────────────────────────────┘
```

## Architectural Patterns

### 1. Clean Architecture
- Clear separation of concerns
- Domain at the center (no dependencies)
- Dependencies point inward
- Business logic isolated from infrastructure

### 2. Repository Pattern (via EF Core)
- `IApplicationDbContext` abstracts data access
- `ApplicationDbContext` implements the interface
- Easy to mock for testing

### 3. Dependency Injection
- All dependencies registered in `Program.cs`
- Services injected via constructor
- Testable and loosely coupled

### 4. Soft Delete Pattern
- `IsDeleted` flag in `BaseEntity`
- Data never physically deleted
- Query filters can exclude deleted records

### 5. Audit Pattern
- `CreatedAt`, `UpdatedAt`, `CreatedBy` in `BaseEntity`
- Tracks who and when changes occurred
- Separate `AuditLog` for detailed change history

## Data Flow Patterns

### 1. Write Operation
```
Controller → Command Handler → Domain Entity → DbContext → Database
```

### 2. Read Operation
```
Controller → Query Handler → DbContext → DTO Projection → Response
```

### 3. Real-Time Update (Future)
```
Background Service → Domain Logic → DbContext → Database
                                      ↓
                               SignalR Hub → Connected Clients
```

## Security Layers (Future Implementation)

```
┌──────────────────────────────────────────────────────────┐
│  1. HTTPS/TLS                                            │
│     • Encryption in transit                              │
└────────────────────┬─────────────────────────────────────┘
                     ▼
┌──────────────────────────────────────────────────────────┐
│  2. Authentication Middleware                            │
│     • JWT Bearer Token validation                        │
└────────────────────┬─────────────────────────────────────┘
                     ▼
┌──────────────────────────────────────────────────────────┐
│  3. Authorization Middleware                             │
│     • Role-based access control (SuperAdmin/Admin/Staff) │
└────────────────────┬─────────────────────────────────────┘
                     ▼
┌──────────────────────────────────────────────────────────┐
│  4. Controller Authorization                             │
│     • [Authorize] attributes                             │
│     • Policy-based authorization                         │
└────────────────────┬─────────────────────────────────────┘
                     ▼
┌──────────────────────────────────────────────────────────┐
│  5. Business Logic Authorization                         │
│     • Domain-level permission checks                     │
└────────────────────┬─────────────────────────────────────┘
                     ▼
┌──────────────────────────────────────────────────────────┐
│  6. Database Security                                    │
│     • SQL Server authentication                          │
│     • Parameterized queries (EF Core)                    │
└──────────────────────────────────────────────────────────┘
```

## Scalability Considerations

### Horizontal Scaling
- Stateless API design
- JWT tokens (no server-side session state)
- Database connection pooling
- Load balancer ready

### Vertical Scaling
- Efficient EF Core queries
- Indexes on foreign keys and search fields
- Pagination for large result sets
- Query optimization

### Caching Strategy (Future)
```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  API (In-Memory)    │  ← Cache frequently accessed data
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Redis (Distributed)│  ← Cache for multiple API instances
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│    Database         │
└─────────────────────┘
```

## Deployment Architecture (Future)

```
┌────────────────────────────────────────────────────────┐
│                    Azure/AWS Cloud                     │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌──────────────────────────────────────────────┐    │
│  │  Load Balancer                               │    │
│  └────────┬─────────────────────────────────────┘    │
│           │                                           │
│     ┌─────┴──────┬──────────┬──────────┐             │
│     ▼            ▼          ▼          ▼             │
│  ┌────┐      ┌────┐     ┌────┐     ┌────┐           │
│  │API │      │API │     │API │     │API │           │
│  │ 1  │      │ 2  │     │ 3  │     │ N  │           │
│  └─┬──┘      └─┬──┘     └─┬──┘     └─┬──┘           │
│    │           │          │          │               │
│    └───────────┴──────────┴──────────┘               │
│                │                                      │
│                ▼                                      │
│    ┌──────────────────────┐                          │
│    │  SQL Server          │                          │
│    │  (High Availability) │                          │
│    └──────────────────────┘                          │
│                                                       │
└───────────────────────────────────────────────────────┘
```

## Monitoring & Observability (Future)

```
Application Metrics
       ↓
┌─────────────────┐
│  Logging        │  (Serilog, Application Insights)
│  Tracing        │  (OpenTelemetry)
│  Metrics        │  (Prometheus/Grafana)
│  Health Checks  │  (ASP.NET Core Health Checks)
└─────────────────┘
```

## Phase Roadmap

### ✅ Phase 1: Backend Foundation (COMPLETED)
- Clean Architecture structure
- Domain entities and enums
- EF Core setup with migrations
- Database schema with seed data
- Swagger documentation

### Phase 2: Authentication & Authorization
- JWT authentication
- User registration/login
- Role-based authorization
- Password hashing (BCrypt)

### Phase 3: Core API Endpoints
- ParkingArea CRUD
- Zone CRUD
- ParkingSlot CRUD
- Real-time slot status updates

### Phase 4: Real-Time Features
- SignalR hub implementation
- Live dashboard updates
- WebSocket connections

### Phase 5: Advanced Features
- Prediction engine
- Incident management
- Notification system
- Analytics & reporting

### Phase 6: Frontend Development
- React application
- Real-time dashboard
- Admin management UI

### Phase 7: IoT Integration
- Sensor data ingestion
- Hardware device management
- Real-time sensor updates

---

**Current Status:** Phase 1 Complete ✅  
**Next Phase:** Authentication & Authorization  
**Last Updated:** June 13, 2026

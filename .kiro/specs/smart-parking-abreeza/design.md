# Technical Design Specification

## Introduction

This document provides the complete technical design for the Smart Parking Management System for Ayala Malls Abreeza. The system is a real-time web-based platform implementing Clean Architecture principles with ASP.NET Core 9 backend, React 18 frontend, SQL Server database, SignalR real-time communication, and JWT authentication. The design supports the 49 requirements covering parking infrastructure management, predictive analytics, incident tracking, and notification delivery.

## System Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React 18 + Vite SPA (Guest & Authenticated Users)   │  │
│  │  - TailwindCSS, Zustand, Recharts                    │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS / WebSocket
┌────────────────────────▼────────────────────────────────────┐
│                  Web API Layer (ASP.NET Core 9)             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Controllers, SignalR Hubs, Middleware, Filters      │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│              Application Layer (Use Cases)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Commands, Queries (CQRS), DTOs, Validators          │  │
│  │  MediatR Pipeline, Business Logic                     │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│              Infrastructure Layer                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  EF Core DbContext, Repositories                      │  │
│  │  External Services, Caching, Email                    │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                  Domain Layer                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Entities, Enums, Domain Interfaces, Value Objects   │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│               Data Layer (SQL Server)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Relational Tables, Stored Procedures, Indexes       │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### Architecture Principles

1. **Clean Architecture**: Dependencies flow inward (WebAPI → Application → Domain)
2. **CQRS Pattern**: Separate read and write operations using MediatR
3. **Domain-Driven Design**: Rich domain models with behavior
4. **Repository Pattern**: Abstraction over data access (optional with EF Core)
5. **Dependency Injection**: Constructor injection for all services
6. **Asynchronous Programming**: async/await throughout
7. **RESTful API Design**: Resource-based endpoints with proper HTTP verbs


## 1. Clean Architecture Backend Design

### Layer Responsibilities

#### 1.1 Domain Layer (`SmartParking.Domain`)
**Purpose**: Core business logic, entities, and domain interfaces

**Contents**:
- Entities (ParkingArea, Zone, ParkingSlot, User, etc.)
- Enums (UserRole, SlotStatus, IncidentType, etc.)
- Value Objects (Address, Coordinate, DateTimeRange)
- Domain Events (SlotStatusChanged, IncidentCreated)
- Domain Interfaces (IRepository contracts, domain services)
- Domain Exceptions (ValidationException, BusinessRuleException)

**Dependencies**: None (zero external dependencies)

**Rules**:
- No dependencies on other layers
- No framework dependencies
- Pure business logic only
- Entities contain behavior, not just data

#### 1.2 Application Layer (`SmartParking.Application`)
**Purpose**: Application use cases and orchestration

**Contents**:
- Commands (CreateSlotCommand, UpdateSlotStatusCommand)
- Queries (GetSlotsQuery, GetPredictionsQuery)
- DTOs (SlotDto, ZoneDto, PredictionDto)
- Validators (FluentValidation validators for all inputs)
- Mappings (AutoMapper profiles)
- Interfaces (IApplicationDbContext, external service contracts)
- Pipeline Behaviors (Logging, Validation, Transaction, Performance)
- Domain Event Handlers (MediatR notification handlers)

**Dependencies**: Domain Layer only

**Patterns**:
- CQRS with MediatR (IRequest<T> for commands/queries)
- Command/Query handlers separate read and write concerns
- Validation pipeline before all command handlers


#### 1.3 Infrastructure Layer (`SmartParking.Infrastructure`)
**Purpose**: External concerns and technical implementations

**Contents**:
- Persistence (ApplicationDbContext, EF Core configurations)
- Repositories (Optional: generic repository implementations)
- External Services (EmailService, PredictionEngineService)
- Caching (Redis cache implementation, in-memory cache)
- Identity (JWT token generation, BCrypt password hashing)
- File Storage (PDF/Excel report generation)
- Background Jobs (Hangfire for notification cleanup, prediction caching)

**Dependencies**: Domain, Application Layers

**Implementations**:
- IApplicationDbContext → ApplicationDbContext
- IEmailService → SmtpEmailService
- IPredictionEngine → RuleBasedPredictionEngine

#### 1.4 WebAPI Layer (`SmartParking.WebAPI`)
**Purpose**: HTTP endpoints, SignalR hubs, and presentation concerns

**Contents**:
- Controllers (ParkingAreasController, SlotsController, etc.)
- SignalR Hubs (ParkingHub for real-time broadcasting)
- Middleware (ExceptionHandling, RateLimiting, Logging)
- Filters (Authorization, Validation, Audit logging)
- Program.cs (DI configuration, middleware pipeline)
- Configuration (appsettings.json, environment configs)

**Dependencies**: Application, Infrastructure Layers

**Responsibilities**:
- HTTP request/response handling
- JWT authentication/authorization
- SignalR connection management
- API versioning (/api/v1/)
- CORS configuration


### Dependency Rules

```
WebAPI ────────┐
               │
Infrastructure ├─────► Application ───────► Domain
               │
External APIs──┘

Rules:
1. Domain has zero dependencies
2. Application depends only on Domain
3. Infrastructure depends on Domain and Application
4. WebAPI depends on Application and Infrastructure
5. No circular dependencies allowed
6. Use interfaces for cross-layer communication
```

### Cross-Cutting Concerns

**Logging**: Serilog with structured logging, Application Insights integration

**Validation**: FluentValidation in Application layer, executed via MediatR pipeline

**Exception Handling**: Global exception middleware returning Problem Details (RFC 7807)

**Caching**: IMemoryCache for short-term, IDistributedCache (Redis) for shared state

**Transactions**: EF Core transactions wrapped around command handlers

**Performance Monitoring**: MediatR pipeline behavior tracking execution time



## 2. ASP.NET Core 9 Web API Project Structure

```
SmartParking.sln
│
├── src/
│   │
│   ├── SmartParking.Domain/
│   │   ├── Entities/
│   │   │   ├── BaseEntity.cs
│   │   │   ├── ParkingArea.cs
│   │   │   ├── Zone.cs
│   │   │   ├── ParkingSlot.cs
│   │   │   ├── SlotStatusHistory.cs
│   │   │   ├── PredictionSnapshot.cs
│   │   │   ├── User.cs
│   │   │   ├── RefreshToken.cs
│   │   │   ├── ParkingIncident.cs
│   │   │   ├── Notification.cs
│   │   │   ├── AuditLog.cs
│   │   │   └── SystemSetting.cs
│   │   │
│   │   ├── Enums/
│   │   │   ├── UserRole.cs
│   │   │   ├── VehicleType.cs
│   │   │   ├── SlotStatus.cs
│   │   │   ├── IncidentType.cs
│   │   │   ├── IncidentStatus.cs
│   │   │   ├── IncidentSeverity.cs
│   │   │   ├── NotificationType.cs
│   │   │   ├── NotificationSeverity.cs
│   │   │   └── AuditActionType.cs
│   │   │
│   │   ├── Events/
│   │   │   ├── SlotStatusChangedEvent.cs
│   │   │   ├── IncidentCreatedEvent.cs
│   │   │   └── IncidentResolvedEvent.cs
│   │   │
│   │   ├── Exceptions/
│   │   │   ├── DomainException.cs
│   │   │   └── BusinessRuleViolationException.cs
│   │   │
│   │   └── Interfaces/
│   │       ├── IEntity.cs
│   │       └── IAuditableEntity.cs
│   │
│   ├── SmartParking.Application/
│   │   ├── Common/
│   │   │   ├── Interfaces/
│   │   │   │   ├── IApplicationDbContext.cs
│   │   │   │   ├── ICurrentUserService.cs
│   │   │   │   ├── IDateTime.cs
│   │   │   │   ├── IEmailService.cs
│   │   │   │   └── IPredictionEngine.cs
│   │   │   │
│   │   │   ├── Mappings/
│   │   │   │   └── MappingProfile.cs
│   │   │   │
│   │   │   └── Models/
│   │   │       └── Result.cs
│   │   │
│   │   ├── Features/
│   │   │   ├── Auth/
│   │   │   │   ├── Commands/
│   │   │   │   │   ├── LoginCommand.cs
│   │   │   │   │   ├── RefreshTokenCommand.cs
│   │   │   │   │   └── LogoutCommand.cs
│   │   │   │   └── DTOs/
│   │   │   │       └── AuthResponseDto.cs
│   │   │   │
│   │   │   ├── ParkingAreas/
│   │   │   │   ├── Commands/
│   │   │   │   ├── Queries/
│   │   │   │   └── DTOs/
│   │   │   │
│   │   │   ├── Zones/
│   │   │   ├── Slots/
│   │   │   ├── Predictions/
│   │   │   ├── Incidents/
│   │   │   ├── Notifications/
│   │   │   ├── Analytics/
│   │   │   └── Users/
│   │   │
│   │   ├── Behaviors/
│   │   │   ├── ValidationBehavior.cs
│   │   │   ├── LoggingBehavior.cs
│   │   │   ├── PerformanceBehavior.cs
│   │   │   └── TransactionBehavior.cs
│   │   │
│   │   └── DependencyInjection.cs
│   │
│   ├── SmartParking.Infrastructure/
│   │   ├── Persistence/
│   │   │   ├── ApplicationDbContext.cs
│   │   │   ├── Configurations/
│   │   │   │   ├── ParkingAreaConfiguration.cs
│   │   │   │   ├── ZoneConfiguration.cs
│   │   │   │   └── (... other entity configurations)
│   │   │   │
│   │   │   ├── Migrations/
│   │   │   ├── Interceptors/
│   │   │   │   └── AuditableEntityInterceptor.cs
│   │   │   │
│   │   │   └── Seed/
│   │   │       └── ApplicationDbContextSeed.cs
│   │   │
│   │   ├── Services/
│   │   │   ├── DateTimeService.cs
│   │   │   ├── EmailService.cs
│   │   │   ├── PredictionEngineService.cs
│   │   │   └── CacheService.cs
│   │   │
│   │   ├── Identity/
│   │   │   ├── JwtTokenService.cs
│   │   │   └── PasswordHashingService.cs
│   │   │
│   │   ├── BackgroundJobs/
│   │   │   ├── NotificationCleanupJob.cs
│   │   │   └── PredictionCacheRefreshJob.cs
│   │   │
│   │   └── DependencyInjection.cs
│   │
│   └── SmartParking.WebAPI/
│       ├── Controllers/
│       │   ├── V1/
│       │   │   ├── AuthController.cs
│       │   │   ├── ParkingAreasController.cs
│       │   │   ├── ZonesController.cs
│       │   │   ├── SlotsController.cs
│       │   │   ├── IncidentsController.cs
│       │   │   ├── NotificationsController.cs
│       │   │   ├── AnalyticsController.cs
│       │   │   ├── UsersController.cs
│       │   │   ├── SettingsController.cs
│       │   │   └── AuditLogsController.cs
│       │   │
│       │   └── PublicController.cs
│       │
│       ├── Hubs/
│       │   └── ParkingHub.cs
│       │
│       ├── Middleware/
│       │   ├── ExceptionHandlingMiddleware.cs
│       │   └── RateLimitingMiddleware.cs
│       │
│       ├── Filters/
│       │   ├── ApiExceptionFilterAttribute.cs
│       │   └── AuditActionFilter.cs
│       │
│       ├── Configuration/
│       │   ├── appsettings.json
│       │   ├── appsettings.Development.json
│       │   ├── appsettings.Staging.json
│       │   └── appsettings.Production.json
│       │
│       ├── Extensions/
│       │   └── ServiceCollectionExtensions.cs
│       │
│       └── Program.cs
│
└── tests/
    ├── SmartParking.Domain.Tests/
    ├── SmartParking.Application.Tests/
    └── SmartParking.Integration.Tests/
```


## 3. React 18 + Vite Frontend Structure

```
frontend/
│
├── public/
│   ├── favicon.ico
│   └── images/
│       └── abreeza-logo.svg
│
├── src/
│   ├── main.tsx                    # Application entry point
│   ├── App.tsx                     # Root component with routing
│   │
│   ├── components/                 # Reusable UI components
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── MainLayout.tsx
│   │   │
│   │   └── parking/
│   │       ├── SlotBadge.tsx
│   │       ├── ZoneCard.tsx
│   │       └── AvailabilityCounter.tsx
│   │
│   ├── features/                   # Feature-based modules
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── ChangePasswordForm.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts
│   │   │   └── pages/
│   │   │       └── LoginPage.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   ├── DashboardCounters.tsx
│   │   │   │   ├── ActivityFeed.tsx
│   │   │   │   └── IncidentSummary.tsx
│   │   │   └── pages/
│   │   │       ├── GuestDashboard.tsx
│   │   │       └── StaffDashboard.tsx
│   │   │
│   │   ├── map/
│   │   │   ├── components/
│   │   │   │   ├── ParkingMap.tsx
│   │   │   │   ├── SvgSlot.tsx
│   │   │   │   ├── ZoneOverlay.tsx
│   │   │   │   ├── TimeScrubber.tsx
│   │   │   │   └── MapControls.tsx
│   │   │   └── pages/
│   │   │       └── LiveMapPage.tsx
│   │   │
│   │   ├── incidents/
│   │   │   ├── components/
│   │   │   │   ├── IncidentForm.tsx
│   │   │   │   ├── IncidentList.tsx
│   │   │   │   └── IncidentDetails.tsx
│   │   │   └── pages/
│   │   │       └── IncidentsPage.tsx
│   │   │
│   │   ├── notifications/
│   │   │   ├── components/
│   │   │   │   ├── NotificationBell.tsx
│   │   │   │   └── NotificationList.tsx
│   │   │   └── pages/
│   │   │       └── NotificationsPage.tsx
│   │   │
│   │   ├── analytics/
│   │   │   ├── components/
│   │   │   │   ├── OccupancyChart.tsx
│   │   │   │   ├── HeatmapChart.tsx
│   │   │   │   └── ReportExporter.tsx
│   │   │   └── pages/
│   │   │       └── AnalyticsPage.tsx
│   │   │
│   │   └── admin/
│   │       ├── components/
│   │       │   ├── UserManagement.tsx
│   │       │   ├── ZoneConfigurator.tsx
│   │       │   └── MapConfigurator.tsx
│   │       └── pages/
│   │           ├── AdminDashboard.tsx
│   │           └── SettingsPage.tsx
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── useSignalR.ts
│   │   ├── useWebSocket.ts
│   │   ├── usePredictions.ts
│   │   ├── useNotifications.ts
│   │   └── useLocalStorage.ts
│   │
│   ├── services/                   # API client services
│   │   ├── api/
│   │   │   ├── apiClient.ts       # Axios instance with interceptors
│   │   │   ├── authApi.ts
│   │   │   ├── parkingApi.ts
│   │   │   ├── incidentsApi.ts
│   │   │   ├── notificationsApi.ts
│   │   │   └── analyticsApi.ts
│   │   │
│   │   └── signalr/
│   │       └── parkingHubConnection.ts
│   │
│   ├── store/                      # Zustand state management
│   │   ├── authStore.ts
│   │   ├── parkingStore.ts
│   │   ├── notificationStore.ts
│   │   └── uiStore.ts
│   │
│   ├── types/                      # TypeScript interfaces
│   │   ├── api.types.ts
│   │   ├── parking.types.ts
│   │   ├── incident.types.ts
│   │   ├── notification.types.ts
│   │   └── user.types.ts
│   │
│   ├── utils/                      # Helper functions
│   │   ├── dateUtils.ts
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   │
│   ├── styles/
│   │   └── globals.css            # Tailwind directives + custom styles
│   │
│   └── router/
│       └── index.tsx              # React Router configuration
│
├── .env.development
├── .env.production
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

### Frontend Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (fast HMR, optimized builds)
- **Styling**: TailwindCSS with custom design system
- **State Management**: Zustand (lightweight, TypeScript-first)
- **HTTP Client**: Axios with request/response interceptors
- **Real-Time**: SignalR @microsoft/signalr client
- **Charts**: Recharts (responsive, customizable)
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router v6
- **Date Handling**: date-fns (lightweight alternative to moment.js)


## 4. SQL Server Database Architecture

### Database Naming Conventions

**SQL (snake_case)**:
- Tables: `parking_areas`, `zones`, `parking_slots`
- Columns: `parking_area_id`, `created_at`, `is_deleted`

**C# (PascalCase)**:
- Entities: `ParkingArea`, `Zone`, `ParkingSlot`
- Properties: `ParkingAreaId`, `CreatedAt`, `IsDeleted`

### Base Entity Pattern

All main entities inherit from `BaseEntity`:

```csharp
public abstract class BaseEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();  // Sequential Guid for performance
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public string? CreatedBy { get; set; }
    public bool IsDeleted { get; set; } = false;  // Soft delete flag
}
```

### Database Schema

#### Identity & Authentication Tables

**users**
```sql
id                  UNIQUEIDENTIFIER PRIMARY KEY
username            NVARCHAR(50) NOT NULL UNIQUE
email               NVARCHAR(255) NOT NULL UNIQUE
password_hash       NVARCHAR(500) NOT NULL
role                TINYINT NOT NULL  -- Enum: SuperAdmin=0, Admin=1, Staff=2
is_active           BIT NOT NULL DEFAULT 1
created_at          DATETIME2 NOT NULL DEFAULT GETUTCDATE()
updated_at          DATETIME2 NULL
is_deleted          BIT NOT NULL DEFAULT 0

INDEX idx_users_email (email)
INDEX idx_users_role (role)
```

**refresh_tokens**
```sql
id                  UNIQUEIDENTIFIER PRIMARY KEY
user_id             UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES users(id)
token               NVARCHAR(500) NOT NULL UNIQUE
expiry_date         DATETIME2 NOT NULL
is_revoked          BIT NOT NULL DEFAULT 0
created_at          DATETIME2 NOT NULL DEFAULT GETUTCDATE()

INDEX idx_refresh_tokens_user_id (user_id)
INDEX idx_refresh_tokens_token (token)
INDEX idx_refresh_tokens_expiry (expiry_date) WHERE is_revoked = 0
```


#### Parking Infrastructure Tables

**parking_areas**
```sql
id                  UNIQUEIDENTIFIER PRIMARY KEY
name                NVARCHAR(100) NOT NULL
address             NVARCHAR(500) NOT NULL
description         NVARCHAR(1000) NULL
total_capacity      INT NOT NULL DEFAULT 0
created_at          DATETIME2 NOT NULL DEFAULT GETUTCDATE()
updated_at          DATETIME2 NULL
created_by          NVARCHAR(50) NULL
is_deleted          BIT NOT NULL DEFAULT 0

INDEX idx_parking_areas_is_deleted (is_deleted)
```

**zones**
```sql
id                  UNIQUEIDENTIFIER PRIMARY KEY
parking_area_id     UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES parking_areas(id)
name                NVARCHAR(50) NOT NULL
description         NVARCHAR(500) NULL
map_color_hex       NVARCHAR(7) NOT NULL  -- #RRGGBB format
sort_order          INT NOT NULL DEFAULT 0
created_at          DATETIME2 NOT NULL DEFAULT GETUTCDATE()
updated_at          DATETIME2 NULL
created_by          NVARCHAR(50) NULL
is_deleted          BIT NOT NULL DEFAULT 0

INDEX idx_zones_parking_area_id (parking_area_id)
INDEX idx_zones_sort_order (sort_order)
INDEX idx_zones_is_deleted (is_deleted)
```

**parking_slots**
```sql
id                  UNIQUEIDENTIFIER PRIMARY KEY
zone_id             UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES zones(id)
slot_number         NVARCHAR(10) NOT NULL UNIQUE  -- Format: A-001
vehicle_type        TINYINT NOT NULL  -- Enum: Car=0, Motorcycle=1
current_status      TINYINT NOT NULL  -- Enum: Available=0, Occupied=1, Maintenance=2
last_status_change  DATETIME2 NOT NULL DEFAULT GETUTCDATE()
x_coordinate        DECIMAL(10,2) NOT NULL CHECK (x_coordinate >= 0 AND x_coordinate <= 1000)
y_coordinate        DECIMAL(10,2) NOT NULL CHECK (y_coordinate >= 0 AND y_coordinate <= 1000)
is_sensor_enabled   BIT NOT NULL DEFAULT 0
created_at          DATETIME2 NOT NULL DEFAULT GETUTCDATE()
updated_at          DATETIME2 NULL
created_by          NVARCHAR(50) NULL
is_deleted          BIT NOT NULL DEFAULT 0

INDEX idx_slots_zone_id (zone_id)
INDEX idx_slots_current_status (current_status)
INDEX idx_slots_vehicle_type (vehicle_type)
INDEX idx_slots_slot_number (slot_number)
INDEX idx_slots_is_deleted (is_deleted)
```


#### Occupancy & Analytics Tables

**slot_status_history**
```sql
id                  UNIQUEIDENTIFIER PRIMARY KEY
slot_id             UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES parking_slots(id)
status              TINYINT NOT NULL  -- Enum: Available=0, Occupied=1, Maintenance=2
start_time          DATETIME2 NOT NULL
end_time            DATETIME2 NULL
duration_minutes    INT NULL  -- Calculated when end_time is set

INDEX idx_slot_status_history_slot_id (slot_id)
INDEX idx_slot_status_history_start_time (start_time)
INDEX idx_slot_status_history_status (status)
INDEX idx_slot_status_history_end_time (end_time) WHERE end_time IS NULL
```

**prediction_snapshots**
```sql
id                  UNIQUEIDENTIFIER PRIMARY KEY
parking_area_id     UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES parking_areas(id)
zone_id             UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES zones(id)
vehicle_type        TINYINT NOT NULL  -- Enum: Car=0, Motorcycle=1
forecast_time       DATETIME2 NOT NULL  -- The future time this prediction is for
predicted_occupancy_count  INT NOT NULL
predicted_occupancy_percentage  DECIMAL(5,2) NOT NULL
confidence_level    TINYINT NOT NULL  -- Enum: Low=0, Medium=1, High=2
calculation_basis   NVARCHAR(500) NULL  -- JSON metadata
created_at          DATETIME2 NOT NULL DEFAULT GETUTCDATE()

INDEX idx_prediction_snapshots_zone_id (zone_id)
INDEX idx_prediction_snapshots_parking_area_id (parking_area_id)
INDEX idx_prediction_snapshots_forecast_time (forecast_time)
INDEX idx_prediction_snapshots_created_at (created_at)
```

#### Incident Management Tables

**parking_incidents**
```sql
id                  UNIQUEIDENTIFIER PRIMARY KEY
parking_area_id     UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES parking_areas(id)
zone_id             UNIQUEIDENTIFIER NULL FOREIGN KEY REFERENCES zones(id)
slot_id             UNIQUEIDENTIFIER NULL FOREIGN KEY REFERENCES parking_slots(id)
incident_type       TINYINT NOT NULL  -- Enum: Blocked_Slot=0, Maintenance_Issue=1, 
                                      --       Unauthorized_Parking=2, Sensor_Failure=3, Safety_Concern=4
severity            TINYINT NOT NULL  -- Enum: Low=0, Medium=1, High=2, Critical=3
status              TINYINT NOT NULL  -- Enum: Open=0, In_Progress=1, Resolved=2, Closed=3
description         NVARCHAR(500) NOT NULL
reported_by         UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES users(id)
reported_at         DATETIME2 NOT NULL DEFAULT GETUTCDATE()
resolved_by         UNIQUEIDENTIFIER NULL FOREIGN KEY REFERENCES users(id)
resolved_at         DATETIME2 NULL
resolution_notes    NVARCHAR(500) NULL
created_at          DATETIME2 NOT NULL DEFAULT GETUTCDATE()
updated_at          DATETIME2 NULL

INDEX idx_incidents_parking_area_id (parking_area_id)
INDEX idx_incidents_zone_id (zone_id)
INDEX idx_incidents_slot_id (slot_id)
INDEX idx_incidents_status (status)
INDEX idx_incidents_severity (severity)
INDEX idx_incidents_reported_at (reported_at)
INDEX idx_incidents_reported_by (reported_by)
```


#### Notification Tables

**notifications**
```sql
id                  UNIQUEIDENTIFIER PRIMARY KEY
user_id             UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES users(id)
notification_type   TINYINT NOT NULL  -- Enum: Incident_Alert=0, Maintenance_Alert=1, 
                                      --       System_Notification=2, Prediction_Alert=3, Sensor_Alert=4
severity            TINYINT NOT NULL  -- Enum: Info=0, Warning=1, Error=2
title               NVARCHAR(100) NOT NULL
message             NVARCHAR(500) NOT NULL
is_read             BIT NOT NULL DEFAULT 0
read_at             DATETIME2 NULL
related_entity_type NVARCHAR(50) NULL  -- e.g., "Incident", "Slot"
related_entity_id   NVARCHAR(50) NULL  -- GUID as string
is_archived         BIT NOT NULL DEFAULT 0
created_at          DATETIME2 NOT NULL DEFAULT GETUTCDATE()

INDEX idx_notifications_user_id (user_id)
INDEX idx_notifications_is_read (is_read)
INDEX idx_notifications_created_at (created_at)
INDEX idx_notifications_is_archived (is_archived)
```

#### System & Audit Tables

**audit_logs**
```sql
id                  UNIQUEIDENTIFIER PRIMARY KEY
user_id             UNIQUEIDENTIFIER NULL FOREIGN KEY REFERENCES users(id)
action_type         TINYINT NOT NULL  -- Enum: Create=0, Update=1, Delete=2, StatusChange=3, 
                                      --       Login=4, Logout=5, ConfigurationChange=6
entity_name         NVARCHAR(100) NOT NULL
entity_id           NVARCHAR(50) NOT NULL
old_values          NVARCHAR(MAX) NULL  -- JSON
new_values          NVARCHAR(MAX) NULL  -- JSON
ip_address          NVARCHAR(45) NULL
user_agent          NVARCHAR(500) NULL
timestamp           DATETIME2 NOT NULL DEFAULT GETUTCDATE()

INDEX idx_audit_logs_user_id (user_id)
INDEX idx_audit_logs_action_type (action_type)
INDEX idx_audit_logs_entity_name (entity_name)
INDEX idx_audit_logs_timestamp (timestamp)
INDEX idx_audit_logs_entity (entity_name, entity_id)
```

**system_settings**
```sql
id                  UNIQUEIDENTIFIER PRIMARY KEY
setting_key         NVARCHAR(100) NOT NULL UNIQUE
setting_value       NVARCHAR(MAX) NOT NULL
description         NVARCHAR(500) NULL
created_at          DATETIME2 NOT NULL DEFAULT GETUTCDATE()
updated_at          DATETIME2 NULL

INDEX idx_system_settings_key (setting_key)
```


## 5. Entity Relationships and ERD Summary

### Entity Relationship Diagram

```
┌─────────────────┐
│  ParkingArea    │
│  (1)            │
└────────┬────────┘
         │ 1:N
         │
┌────────▼────────┐         ┌──────────────┐
│  Zone           │         │  User        │
│  (N)            │         │  (N)         │
└────────┬────────┘         └──────┬───────┘
         │ 1:N                     │ 1:N
         │                         │
┌────────▼────────┐         ┌──────▼───────────┐
│  ParkingSlot    │         │  RefreshToken    │
│  (N)            │         │  (N)             │
└────────┬────────┘         └──────────────────┘
         │ 1:N
         │
┌────────▼──────────────┐
│  SlotStatusHistory    │
│  (N)                  │
└───────────────────────┘

┌────────────────────┐
│  ParkingArea (1)   │
└─────────┬──────────┘
          │ 1:N
┌─────────▼──────────┐
│  ParkingIncident   │◄──┐
│  (N)               │   │
└─────────┬──────────┘   │
          │              │ reported_by / resolved_by
          │ 1:N          │ N:1
┌─────────▼──────────┐   │
│  Notification      │◄──┤
│  (N)               │   │
└────────────────────┘   │
                         │
                    ┌────▼─────┐
                    │  User    │
                    │  (N)     │
                    └──────────┘

┌────────────────┐
│  User          │
│  (1)           │
└────────┬───────┘
         │ 1:N
┌────────▼───────┐
│  AuditLog      │
│  (N)           │
└────────────────┘
```

### Key Relationships

**ParkingArea → Zones** (1:N)
- One parking area contains multiple zones
- CASCADE soft delete when area deleted

**Zone → ParkingSlots** (1:N)
- One zone contains multiple parking slots
- CASCADE soft delete when zone deleted

**ParkingSlot → SlotStatusHistory** (1:N)
- One slot has many status transition records
- History preserved for analytics (no delete)

**ParkingArea/Zone → PredictionSnapshots** (1:N)
- Predictions scoped to parking area and zone
- Old predictions archived after 180 days

**User → RefreshTokens** (1:N)
- One user can have multiple active refresh tokens
- Tokens revoked on logout

**User → ParkingIncidents** (1:N) [reported_by]
- One user reports many incidents
- Mandatory relationship

**User → ParkingIncidents** (1:N) [resolved_by]
- One user resolves many incidents
- Optional relationship (null until resolved)

**User → Notifications** (1:N)
- One user receives many notifications
- CASCADE delete when user deleted

**User → AuditLogs** (1:N)
- One user performs many audited actions
- Optional relationship (system actions have null user_id)

**ParkingSlot → ParkingIncidents** (N:1) [Optional]
- Incident may be linked to specific slot
- NULL if incident is zone-level or general


## 6. Domain Entities and Enums

### Enums

```csharp
// User roles (database-stored, NOT Guest)
public enum UserRole
{
    SuperAdmin = 0,
    Admin = 1,
    Staff = 2
}

// Vehicle types supported
public enum VehicleType
{
    Car = 0,
    Motorcycle = 1
}

// Parking slot statuses (NO Reserved - removed per requirements)
public enum SlotStatus
{
    Available = 0,
    Occupied = 1,
    Maintenance = 2
}

// Incident categories
public enum IncidentType
{
    Blocked_Slot = 0,
    Maintenance_Issue = 1,
    Unauthorized_Parking = 2,
    Sensor_Failure = 3,
    Safety_Concern = 4
}

// Incident workflow states
public enum IncidentStatus
{
    Open = 0,
    In_Progress = 1,
    Resolved = 2,
    Closed = 3
}

// Incident priority levels
public enum IncidentSeverity
{
    Low = 0,
    Medium = 1,
    High = 2,
    Critical = 3
}

// Notification types
public enum NotificationType
{
    Incident_Alert = 0,
    Maintenance_Alert = 1,
    System_Notification = 2,
    Prediction_Alert = 3,
    Sensor_Alert = 4
}

// Notification severity
public enum NotificationSeverity
{
    Info = 0,
    Warning = 1,
    Error = 2
}

// Audit action types
public enum AuditActionType
{
    Create = 0,
    Update = 1,
    Delete = 2,
    StatusChange = 3,
    Login = 4,
    Logout = 5,
    ConfigurationChange = 6
}

// Prediction confidence levels
public enum ConfidenceLevel
{
    Low = 0,      // < 7 days of historical data
    Medium = 1,   // 7-30 days of historical data
    High = 2      // > 30 days of historical data
}
```


### Domain Entity Signatures

```csharp
// Base entity for all domain entities
public abstract class BaseEntity
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? CreatedBy { get; set; }
    public bool IsDeleted { get; set; }
}

// Identity entities
public class User : BaseEntity
{
    public string Username { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public UserRole Role { get; set; }
    public bool IsActive { get; set; }
    public ICollection<RefreshToken> RefreshTokens { get; set; }
    public ICollection<ParkingIncident> ReportedIncidents { get; set; }
    public ICollection<ParkingIncident> ResolvedIncidents { get; set; }
    public ICollection<Notification> Notifications { get; set; }
    public ICollection<AuditLog> AuditLogs { get; set; }
}

public class RefreshToken : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; }
    public string Token { get; set; }
    public DateTime ExpiryDate { get; set; }
    public bool IsRevoked { get; set; }
}

// Parking infrastructure entities
public class ParkingArea : BaseEntity
{
    public string Name { get; set; }
    public string Address { get; set; }
    public string? Description { get; set; }
    public int TotalCapacity { get; set; }
    public ICollection<Zone> Zones { get; set; }
    public ICollection<ParkingIncident> Incidents { get; set; }
    public ICollection<PredictionSnapshot> Predictions { get; set; }
}

public class Zone : BaseEntity
{
    public Guid ParkingAreaId { get; set; }
    public ParkingArea ParkingArea { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }
    public string MapColorHex { get; set; }
    public int SortOrder { get; set; }
    public ICollection<ParkingSlot> ParkingSlots { get; set; }
    public ICollection<PredictionSnapshot> Predictions { get; set; }
}

public class ParkingSlot : BaseEntity
{
    public Guid ZoneId { get; set; }
    public Zone Zone { get; set; }
    public string SlotNumber { get; set; }
    public VehicleType VehicleType { get; set; }
    public SlotStatus CurrentStatus { get; set; }
    public DateTime LastStatusChange { get; set; }
    public decimal XCoordinate { get; set; }
    public decimal YCoordinate { get; set; }
    public bool IsSensorEnabled { get; set; }
    public ICollection<SlotStatusHistory> StatusHistory { get; set; }
    public ICollection<ParkingIncident> Incidents { get; set; }
}

// Analytics entities
public class SlotStatusHistory
{
    public Guid Id { get; set; }
    public Guid SlotId { get; set; }
    public ParkingSlot Slot { get; set; }
    public SlotStatus Status { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public int? DurationMinutes { get; set; }
}

public class PredictionSnapshot : BaseEntity
{
    public Guid ParkingAreaId { get; set; }
    public ParkingArea ParkingArea { get; set; }
    public Guid ZoneId { get; set; }
    public Zone Zone { get; set; }
    public VehicleType VehicleType { get; set; }
    public DateTime ForecastTime { get; set; }
    public int PredictedOccupancyCount { get; set; }
    public decimal PredictedOccupancyPercentage { get; set; }
    public ConfidenceLevel ConfidenceLevel { get; set; }
    public string? CalculationBasis { get; set; }
}

// Incident management entities
public class ParkingIncident : BaseEntity
{
    public Guid ParkingAreaId { get; set; }
    public ParkingArea ParkingArea { get; set; }
    public Guid? ZoneId { get; set; }
    public Zone? Zone { get; set; }
    public Guid? SlotId { get; set; }
    public ParkingSlot? Slot { get; set; }
    public IncidentType IncidentType { get; set; }
    public IncidentSeverity Severity { get; set; }
    public IncidentStatus Status { get; set; }
    public string Description { get; set; }
    public Guid ReportedBy { get; set; }
    public User Reporter { get; set; }
    public DateTime ReportedAt { get; set; }
    public Guid? ResolvedBy { get; set; }
    public User? Resolver { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public string? ResolutionNotes { get; set; }
}

// Notification entity
public class Notification : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; }
    public NotificationType NotificationType { get; set; }
    public NotificationSeverity Severity { get; set; }
    public string Title { get; set; }
    public string Message { get; set; }
    public bool IsRead { get; set; }
    public DateTime? ReadAt { get; set; }
    public string? RelatedEntityType { get; set; }
    public string? RelatedEntityId { get; set; }
    public bool IsArchived { get; set; }
}

// System entities
public class AuditLog
{
    public Guid Id { get; set; }
    public Guid? UserId { get; set; }
    public User? User { get; set; }
    public AuditActionType ActionType { get; set; }
    public string EntityName { get; set; }
    public string EntityId { get; set; }
    public string? OldValues { get; set; }
    public string? NewValues { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public DateTime Timestamp { get; set; }
}

public class SystemSetting : BaseEntity
{
    public string SettingKey { get; set; }
    public string SettingValue { get; set; }
    public string? Description { get; set; }
}
```


## 7. API Endpoint Groups

### 7.1 Public Endpoints (No Authentication)

**Base Path**: `/api/v1/public`

```
GET    /api/v1/public/areas
       → List all parking areas
       Response: ParkingAreaDto[]

GET    /api/v1/public/areas/{areaId}/zones
       → Get zones for a parking area
       Response: ZoneDto[]

GET    /api/v1/public/areas/{areaId}/slots
       → Get real-time slot status for all zones
       Query: ?vehicleType=Car|Motorcycle
       Response: SlotStatusDto[]

GET    /api/v1/public/areas/{areaId}/zones/{zoneId}/slots
       → Get slots for specific zone
       Response: SlotStatusDto[]

GET    /api/v1/public/areas/{areaId}/predictions
       → Get occupancy predictions (30min, 1hr, 2hr)
       Query: ?zoneId=guid&vehicleType=Car
       Response: PredictionResponseDto

GET    /api/v1/public/areas/{areaId}/occupancy
       → Get current occupancy counters
       Response: OccupancyCountersDto
```

**Rate Limiting**: 60 requests per minute per IP address

### 7.2 Authentication Endpoints

**Base Path**: `/api/v1/auth`

```
POST   /api/v1/auth/login
       Body: { username, password }
       Response: { accessToken, refreshToken, user, expiresIn }

POST   /api/v1/auth/refresh
       Body: { refreshToken }
       Response: { accessToken, refreshToken, expiresIn }

POST   /api/v1/auth/logout
       Headers: Authorization: Bearer {token}
       Response: 204 No Content

POST   /api/v1/auth/change-password
       Headers: Authorization: Bearer {token}
       Body: { currentPassword, newPassword }
       Response: 200 OK
```

### 7.3 Parking Infrastructure Endpoints (Admin+)

**Base Path**: `/api/v1`

**Parking Areas**:
```
GET    /api/v1/areas
       → List all areas (Auth: Admin+)
       Response: ParkingAreaDto[]

POST   /api/v1/areas
       → Create parking area (Auth: Admin+)
       Body: CreateParkingAreaCommand
       Response: 201 Created, ParkingAreaDto

GET    /api/v1/areas/{id}
       → Get area by ID (Auth: Admin+)
       Response: ParkingAreaDto

PUT    /api/v1/areas/{id}
       → Update area (Auth: Admin+)
       Body: UpdateParkingAreaCommand
       Response: 200 OK, ParkingAreaDto

DELETE /api/v1/areas/{id}
       → Soft delete area (Auth: Admin+)
       Response: 204 No Content
```

**Zones**:
```
GET    /api/v1/areas/{areaId}/zones
       → List zones for area (Auth: Admin+)
       Response: ZoneDto[]

POST   /api/v1/areas/{areaId}/zones
       → Create zone (Auth: Admin+)
       Body: CreateZoneCommand
       Response: 201 Created, ZoneDto

PUT    /api/v1/areas/{areaId}/zones/{zoneId}
       → Update zone (Auth: Admin+)
       Body: UpdateZoneCommand
       Response: 200 OK, ZoneDto

DELETE /api/v1/areas/{areaId}/zones/{zoneId}
       → Soft delete zone (Auth: Admin+)
       Response: 204 No Content
```

**Parking Slots**:
```
GET    /api/v1/areas/{areaId}/zones/{zoneId}/slots
       → List slots in zone (Auth: Admin+)
       Response: ParkingSlotDto[]

POST   /api/v1/areas/{areaId}/zones/{zoneId}/slots
       → Create slot (Auth: Admin+)
       Body: CreateParkingSlotCommand
       Response: 201 Created, ParkingSlotDto

PUT    /api/v1/slots/{slotId}
       → Update slot configuration (Auth: Admin+)
       Body: UpdateParkingSlotCommand
       Response: 200 OK, ParkingSlotDto

DELETE /api/v1/slots/{slotId}
       → Soft delete slot (Auth: Admin+)
       Response: 204 No Content

PATCH  /api/v1/slots/{slotId}/coordinates
       → Update slot map position (Auth: Admin+)
       Body: { xCoordinate, yCoordinate }
       Response: 200 OK
```


### 7.4 Slot Operations Endpoints (Staff+)

**Base Path**: `/api/v1/slots`

```
PATCH  /api/v1/slots/{slotId}/status
       → Update slot status (Auth: Staff+)
       Body: { status: Available|Occupied|Maintenance }
       Response: 200 OK, SlotStatusDto

GET    /api/v1/slots/{slotId}/history
       → Get slot status history (Auth: Staff+)
       Query: ?startDate=2024-01-01&endDate=2024-01-31&pageNumber=1&pageSize=50
       Response: PagedResult<SlotStatusHistoryDto>
```

### 7.5 Incident Management Endpoints (Staff+)

**Base Path**: `/api/v1/incidents`

```
POST   /api/v1/incidents
       → Create incident report (Auth: Staff+)
       Body: CreateIncidentCommand
       Response: 201 Created, IncidentDto

GET    /api/v1/incidents
       → List/filter incidents (Auth: Staff+)
       Query: ?parkingAreaId=guid&zoneId=guid&status=Open&severity=High
              &incidentType=Blocked_Slot&pageNumber=1&pageSize=50
       Response: PagedResult<IncidentDto>

GET    /api/v1/incidents/{incidentId}
       → Get incident details (Auth: Staff+)
       Response: IncidentDetailDto

PATCH  /api/v1/incidents/{incidentId}/status
       → Update incident status (Auth: Staff+)
       Body: { status: In_Progress|Resolved|Closed, resolutionNotes? }
       Response: 200 OK, IncidentDto

GET    /api/v1/incidents/dashboard
       → Get incident dashboard metrics (Auth: Admin+)
       Query: ?parkingAreaId=guid
       Response: IncidentDashboardDto
```

### 7.6 Notification Endpoints (Authenticated)

**Base Path**: `/api/v1/notifications`

```
GET    /api/v1/notifications
       → Get user notifications (Auth: Any authenticated user)
       Query: ?isRead=false&pageNumber=1&pageSize=20
       Response: PagedResult<NotificationDto>

GET    /api/v1/notifications/unread-count
       → Get unread notification count (Auth: Any authenticated user)
       Response: { count: number }

PATCH  /api/v1/notifications/{notificationId}/read
       → Mark notification as read (Auth: Any authenticated user)
       Response: 200 OK

PATCH  /api/v1/notifications/read-all
       → Mark all notifications as read (Auth: Any authenticated user)
       Response: 200 OK
```

### 7.7 Analytics Endpoints (Admin+)

**Base Path**: `/api/v1/analytics`

```
GET    /api/v1/analytics/occupancy-trends
       → Get occupancy trend data (Auth: Admin+)
       Query: ?parkingAreaId=guid&startDate=2024-01-01&endDate=2024-01-31
       Response: OccupancyTrendDto

GET    /api/v1/analytics/zone-performance
       → Get zone performance metrics (Auth: Admin+)
       Query: ?parkingAreaId=guid&dateRange=Last7Days
       Response: ZonePerformanceDto[]

GET    /api/v1/analytics/peak-hours
       → Get peak occupancy hours (Auth: Admin+)
       Query: ?parkingAreaId=guid&zoneId=guid
       Response: PeakHoursDto

POST   /api/v1/analytics/reports/export
       → Generate and export report (Auth: Admin+)
       Body: { format: PDF|Excel, dateRange, parkingAreaId, zones }
       Response: 200 OK, File download
```

### 7.8 User Management Endpoints (SuperAdmin)

**Base Path**: `/api/v1/users`

```
GET    /api/v1/users
       → List users (Auth: SuperAdmin)
       Query: ?role=Staff&isActive=true&pageNumber=1&pageSize=50
       Response: PagedResult<UserDto>

POST   /api/v1/users
       → Create user (Auth: SuperAdmin)
       Body: CreateUserCommand
       Response: 201 Created, UserDto

GET    /api/v1/users/{userId}
       → Get user details (Auth: SuperAdmin)
       Response: UserDetailDto

PATCH  /api/v1/users/{userId}/activate
       → Activate user (Auth: SuperAdmin)
       Response: 200 OK

PATCH  /api/v1/users/{userId}/deactivate
       → Deactivate user (Auth: SuperAdmin)
       Response: 200 OK

PATCH  /api/v1/users/{userId}/role
       → Change user role (Auth: SuperAdmin)
       Body: { role: Staff|Admin|SuperAdmin }
       Response: 200 OK
```

### 7.9 System Settings Endpoints (SuperAdmin)

**Base Path**: `/api/v1/settings`

```
GET    /api/v1/settings
       → List all settings (Auth: SuperAdmin)
       Response: SystemSettingDto[]

GET    /api/v1/settings/{key}
       → Get setting by key (Auth: SuperAdmin)
       Response: SystemSettingDto

PUT    /api/v1/settings/{key}
       → Update setting (Auth: SuperAdmin)
       Body: { value, description? }
       Response: 200 OK
```

### 7.10 Audit Endpoints (SuperAdmin)

**Base Path**: `/api/v1/audit-logs`

```
GET    /api/v1/audit-logs
       → Query audit logs (Auth: SuperAdmin)
       Query: ?userId=guid&actionType=Update&entityName=ParkingSlot
              &startDate=2024-01-01&endDate=2024-01-31&pageNumber=1&pageSize=50
       Response: PagedResult<AuditLogDto>
```

### 7.11 Health Check Endpoints (No Auth)

**Base Path**: `/health`

```
GET    /health
       → Basic health check
       Response: { status: Healthy|Degraded|Unhealthy }

GET    /health/ready
       → Readiness probe (Kubernetes)
       Response: 200 OK or 503 Service Unavailable

GET    /health/live
       → Liveness probe (Kubernetes)
       Response: 200 OK or 503 Service Unavailable
```


## 8. SignalR Real-Time Design

### 8.1 Hub Configuration

**Hub Class**: `ParkingHub`

**Endpoint**: `/hubs/parking`

**Transport**: WebSockets (fallback to Server-Sent Events, then Long Polling)

**Connection Authentication**:
- Anonymous connections allowed (Guest visitors)
- Authenticated connections identified via JWT in query string or header
- Connection groups organized by parking_area_id

### 8.2 Client-to-Server Methods

**Methods authenticated users can invoke:**

```csharp
// Join parking area group to receive updates
Task JoinParkingAreaGroup(Guid parkingAreaId)

// Leave parking area group
Task LeaveParkingAreaGroup(Guid parkingAreaId)

// Update slot status (Staff+ only)
Task UpdateSlotStatus(Guid slotId, SlotStatus newStatus)
```

**Access Control**:
- Anonymous connections can ONLY subscribe (join/leave groups)
- `UpdateSlotStatus` requires Staff, Admin, or SuperAdmin role
- Role validation via JWT claims in connection context

### 8.3 Server-to-Client Methods

**Methods server broadcasts to clients:**

```csharp
// Slot status changed
Task OnSlotStatusChanged(SlotStatusChangedDto dto)
/*
{
  slotId: Guid,
  slotNumber: string,
  zoneId: Guid,
  zoneName: string,
  parkingAreaId: Guid,
  oldStatus: SlotStatus,
  newStatus: SlotStatus,
  timestamp: DateTime
}
*/

// Zone occupancy counters updated
Task OnZoneOccupancyChanged(ZoneOccupancyDto dto)
/*
{
  zoneId: Guid,
  zoneName: string,
  parkingAreaId: Guid,
  availableCarSlots: number,
  totalCarSlots: number,
  availableMotorcycleSlots: number,
  totalMotorcycleSlots: number,
  timestamp: DateTime
}
*/

// Incident created
Task OnIncidentCreated(IncidentNotificationDto dto)
/*
{
  incidentId: Guid,
  incidentType: IncidentType,
  severity: IncidentSeverity,
  parkingAreaId: Guid,
  zoneId?: Guid,
  slotNumber?: string,
  description: string,
  reportedBy: string,
  reportedAt: DateTime
}
*/

// Incident status changed
Task OnIncidentStatusChanged(IncidentStatusChangedDto dto)
/*
{
  incidentId: Guid,
  oldStatus: IncidentStatus,
  newStatus: IncidentStatus,
  resolvedBy?: string,
  timestamp: DateTime
}
*/

// Notification received (user-specific)
Task OnNotificationReceived(NotificationDto dto)
/*
{
  notificationId: Guid,
  notificationType: NotificationType,
  severity: NotificationSeverity,
  title: string,
  message: string,
  relatedEntityType?: string,
  relatedEntityId?: string,
  createdAt: DateTime
}
*/
```

### 8.4 Connection Groups

**Grouping Strategy**:
```csharp
// All connections for a parking area
Group: $"parking-area-{parkingAreaId}"

// User-specific connections for notifications
Group: $"user-{userId}"
```

**Broadcasting Patterns**:
- Slot status changes → Broadcast to parking-area group
- Zone occupancy updates → Broadcast to parking-area group
- Incidents → Broadcast to parking-area group
- Notifications → Send to user-specific group

### 8.5 Connection Management

**Connection Lifecycle**:
```csharp
OnConnectedAsync()
{
    // Extract user claims from JWT (if authenticated)
    // Log connection (user_id, connection_id, ip_address)
    // Auto-join default parking area group if specified
}

OnDisconnectedAsync()
{
    // Remove from all groups
    // Log disconnection
    // Clean up connection state
}
```

**Connection Limits**:
- Anonymous connections: Maximum 10 per IP address
- Authenticated connections: No limit
- Automatic reconnection after network interruption (client-side)

### 8.6 Scalability Configuration

**Azure SignalR Service Integration**:
```json
{
  "Azure": {
    "SignalR": {
      "Enabled": true,
      "ConnectionString": "Endpoint=https://...;AccessKey=...;Version=1.0;"
    }
  }
}
```

**Redis Backplane** (alternative to Azure SignalR):
```csharp
services.AddSignalR()
    .AddStackExchangeRedis(connectionString, options => {
        options.Configuration.ChannelPrefix = "SmartParking";
    });
```

**Connection State**:
- Connection metadata stored in distributed cache (Redis)
- Group membership tracked per connection
- Reconnection supports seamless group re-joining


## 9. JWT Authentication and Authorization Design

### 9.1 Token Configuration

**Access Token (JWT)**:
- Algorithm: HS256 (HMAC with SHA-256)
- Expiration: 15 minutes
- Storage: Memory (React state/Zustand store)
- Use: Authorization header for API requests

**Refresh Token**:
- Type: Opaque token (random cryptographic string)
- Expiration: 7 days (30 days with "Remember Me")
- Storage: HttpOnly, Secure cookie (frontend), Database (backend)
- Use: Obtaining new access tokens

**Token Generation**:
```csharp
// Access Token Claims
{
  "sub": "user-guid",                    // Subject (User ID)
  "email": "user@example.com",
  "name": "John Doe",
  "role": "Admin",                       // UserRole enum value
  "parking_area_id": "area-guid",        // Future multi-area support
  "iat": 1234567890,                     // Issued at
  "exp": 1234568790,                     // Expires at (15 min)
  "iss": "SmartParkingAPI",              // Issuer
  "aud": "SmartParkingClient"            // Audience
}
```

### 9.2 Authentication Flow

**Login Process**:
```
1. User → POST /api/v1/auth/login { username, password }
2. API validates credentials
3. API hashes password with BCrypt (work factor 12)
4. API compares with stored hash
5. API generates access token (JWT)
6. API generates refresh token (random string)
7. API stores refresh token in database
8. API returns:
   - accessToken (in response body)
   - refreshToken (in HttpOnly secure cookie)
   - user info
   - expiresIn (900 seconds)
```

**Token Refresh Process**:
```
1. User → POST /api/v1/auth/refresh (refresh token in cookie)
2. API validates refresh token from database
3. API checks expiration and revocation status
4. API generates new access token
5. API generates new refresh token (rotation)
6. API invalidates old refresh token
7. API stores new refresh token in database
8. API returns new tokens
```

**Logout Process**:
```
1. User → POST /api/v1/auth/logout
2. API extracts user ID from JWT
3. API revokes all refresh tokens for user
4. API clears refresh token cookie
5. API returns 204 No Content
```

### 9.3 Authorization Policies

**Policy Definitions**:
```csharp
// Require any authenticated user
[Authorize]

// Require Staff role or higher (Staff, Admin, SuperAdmin)
[Authorize(Policy = "RequireStaffRole")]

// Require Admin role or higher (Admin, SuperAdmin)
[Authorize(Policy = "RequireAdminRole")]

// Require SuperAdmin role only
[Authorize(Policy = "RequireSuperAdminRole")]
```

**Policy Registration**:
```csharp
services.AddAuthorization(options =>
{
    options.AddPolicy("RequireStaffRole", policy =>
        policy.RequireRole("Staff", "Admin", "SuperAdmin"));
    
    options.AddPolicy("RequireAdminRole", policy =>
        policy.RequireRole("Admin", "SuperAdmin"));
    
    options.AddPolicy("RequireSuperAdminRole", policy =>
        policy.RequireRole("SuperAdmin"));
});
```

### 9.4 Session Management

**Inactivity Timeout**:
- Access token expires after 15 minutes
- Frontend tracks last activity timestamp
- Frontend attempts token refresh on 401 response
- If refresh fails, redirect to login

**"Remember Me" Feature**:
- Standard: Refresh token expires in 7 days
- Remember Me: Refresh token expires in 30 days
- Setting stored with refresh token in database

**Session Warning**:
- Frontend displays warning 2 minutes before token expiry
- User can click "Stay Logged In" to refresh token
- Or allow session to expire and redirect to login

### 9.5 Security Measures

**Password Requirements**:
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 digit
- At least 1 special character

**Password Hashing**:
- Algorithm: BCrypt
- Work Factor: 12 (2^12 = 4096 iterations)
- Salt: Automatically generated per password

**Token Security**:
- JWT Secret Key: Minimum 256 bits (32 bytes)
- Stored in Azure Key Vault or environment variables
- Never committed to source control
- Rotated periodically (quarterly)

**HTTPS Enforcement**:
- All API communication over HTTPS
- HSTS header: `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- Redirect HTTP to HTTPS in production

**Cookie Security**:
```csharp
options.Cookie.HttpOnly = true;    // Prevent XSS access
options.Cookie.Secure = true;      // HTTPS only
options.Cookie.SameSite = SameSiteMode.Strict;  // CSRF protection
```


## 10. Prediction Engine Design

### 10.1 Rule-Based Algorithm (v1.0)

**Prediction Formula**:
```
PredictedOccupancy = (HistoricalBaseline × 0.6) + (CurrentTrend × 0.4) + EventModifier

Where:
- HistoricalBaseline = Average occupancy for [DayOfWeek, HourOfDay] from SlotStatusHistory
- CurrentTrend = Rate of change in last 15 minutes (arrivals - departures)
- EventModifier = Adjustment based on special conditions
```

**Historical Baseline Calculation**:
```csharp
// Query SlotStatusHistory for matching day/hour patterns
var historicalData = await _context.SlotStatusHistory
    .Where(h => h.Slot.ZoneId == zoneId 
             && h.Slot.VehicleType == vehicleType
             && h.StartTime.DayOfWeek == targetDayOfWeek
             && h.StartTime.Hour == targetHour
             && h.EndTime.HasValue)
    .GroupBy(h => h.SlotId)
    .Select(g => new {
        SlotId = g.Key,
        AvgOccupancyMinutes = g.Average(h => h.DurationMinutes ?? 0)
    })
    .ToListAsync();

// Calculate average occupancy percentage
double historicalBaseline = (double)historicalData.Count(x => x.AvgOccupancyMinutes > 30) 
                           / totalSlotsInZone * 100;
```

**Current Trend Calculation**:
```csharp
// Get status changes in last 15 minutes
var recentChanges = await _context.SlotStatusHistory
    .Where(h => h.Slot.ZoneId == zoneId
             && h.Slot.VehicleType == vehicleType
             && h.StartTime >= DateTime.UtcNow.AddMinutes(-15))
    .ToListAsync();

int arrivals = recentChanges.Count(h => h.Status == SlotStatus.Occupied);
int departures = recentChanges.Count(h => h.Status == SlotStatus.Available);

// Calculate rate per minute
double trendRatePerMinute = (arrivals - departures) / 15.0;

// Project trend forward to target time
int minutesToTarget = (int)(targetTime - DateTime.UtcNow).TotalMinutes;
double trendImpact = trendRatePerMinute * minutesToTarget;

// Convert to percentage
double currentTrend = (trendImpact / totalSlotsInZone) * 100;
```

**Event Modifiers**:
```csharp
double eventModifier = 0;

// Weekend modifier: +10%
if (targetTime.DayOfWeek == DayOfWeek.Saturday || targetTime.DayOfWeek == DayOfWeek.Sunday)
{
    eventModifier += 10;
}

// Peak hours modifier: +15%
if ((targetTime.Hour >= 11 && targetTime.Hour <= 14) ||  // Lunch: 11am-2pm
    (targetTime.Hour >= 17 && targetTime.Hour <= 20))    // Dinner: 5pm-8pm
{
    eventModifier += 15;
}

// Mall opening hours check
var mallOpeningTime = await GetSystemSetting("MallOpeningTime");  // e.g., "09:00"
var mallClosingTime = await GetSystemSetting("MallClosingTime");  // e.g., "21:00"

if (targetTime.Hour < mallOpeningTime || targetTime.Hour >= mallClosingTime)
{
    eventModifier = -100;  // Force 0% occupancy when mall closed
}
```

**Final Calculation**:
```csharp
double rawPrediction = (historicalBaseline * 0.6) + (currentTrend * 0.4) + eventModifier;

// Clamp to valid range [0, 100]
double predictedPercentage = Math.Max(0, Math.Min(100, rawPrediction));

int predictedOccupancyCount = (int)Math.Round((predictedPercentage / 100) * totalSlotsInZone);
```

### 10.2 Confidence Level Calculation

```csharp
public ConfidenceLevel CalculateConfidence(int daysOfHistoricalData)
{
    if (daysOfHistoricalData < 7)
        return ConfidenceLevel.Low;
    else if (daysOfHistoricalData >= 7 && daysOfHistoricalData <= 30)
        return ConfidenceLevel.Medium;
    else
        return ConfidenceLevel.High;
}
```

### 10.3 Prediction Windows

**Target Times**:
- +30 minutes: `DateTime.UtcNow.AddMinutes(30)`
- +60 minutes: `DateTime.UtcNow.AddMinutes(60)`
- +120 minutes: `DateTime.UtcNow.AddMinutes(120)`

**Per-Zone Predictions**:
- Each zone calculated independently
- Separate predictions for Car slots vs Motorcycle slots
- Stored in `PredictionSnapshot` table with `parking_area_id` and `zone_id`

### 10.4 Caching Strategy

**Cache Key Pattern**:
```
prediction:{parking_area_id}:{zone_id}:{vehicle_type}:{forecast_window}
```

**Cache Invalidation**:
- Predictions regenerated every 5 minutes via background job
- Cached in Redis (distributed) with 5-minute expiration
- Also cached in-memory (local) with 5-minute expiration
- Cache cleared when significant status changes occur (>10% occupancy change in 1 minute)

**Background Job**:
```csharp
[AutomaticRetry(Attempts = 3)]
public async Task RefreshPredictionCache()
{
    var parkingAreas = await _context.ParkingAreas
        .Where(pa => !pa.IsDeleted)
        .Include(pa => pa.Zones)
        .ToListAsync();

    foreach (var area in parkingAreas)
    {
        foreach (var zone in area.Zones.Where(z => !z.IsDeleted))
        {
            await GenerateAndCachePredictions(area.Id, zone.Id);
        }
    }
}
```

### 10.5 ML-Ready Data Structure

**Export Format for Training**:
```csv
slot_id,zone_id,vehicle_type,day_of_week,hour_of_day,occupancy_minutes,start_time,end_time
guid-1,guid-z1,0,1,14,45,2024-01-15 14:00:00,2024-01-15 14:45:00
guid-2,guid-z1,0,1,14,120,2024-01-15 14:10:00,2024-01-15 16:10:00
```

**Features for ML Model**:
- `day_of_week` (0-6)
- `hour_of_day` (0-23)
- `zone_id` (categorical)
- `vehicle_type` (0=Car, 1=Motorcycle)
- `current_occupancy_percentage` (0-100)
- `recent_trend` (arrivals - departures in last 15 min)
- `is_weekend` (boolean)
- `is_peak_hour` (boolean)

**Target Variable**:
- `occupancy_percentage_at_target_time` (0-100)

**Future ML Integration**:
```csharp
public interface IPredictionEngine
{
    Task<PredictionResult> PredictAsync(PredictionRequest request);
}

// Rule-based implementation (v1.0)
public class RuleBasedPredictionEngine : IPredictionEngine { }

// ML-based implementation (v2.0 - future)
public class MachineLearningPredictionEngine : IPredictionEngine { }
```

**A/B Testing Support**:
- Route 50% of requests to rule-based engine
- Route 50% to ML engine (once trained)
- Compare accuracy and select best performer
- Gradual rollout: 10% → 25% → 50% → 100%


## 11. Audit Logging Design

### 11.1 Audit Log Capture Mechanism

**EF Core SaveChanges Interceptor**:
```csharp
public class AuditableEntityInterceptor : SaveChangesInterceptor
{
    private readonly ICurrentUserService _currentUser;
    private readonly IDateTime _dateTime;
    private readonly IHttpContextAccessor _httpContext;

    public override InterceptionResult<int> SavingChanges(
        DbContextEventData eventData, 
        InterceptionResult<int> result)
    {
        UpdateAuditableEntities(eventData.Context);
        return base.SavingChanges(eventData, result);
    }

    public override async ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData, 
        InterceptionResult<int> result, 
        CancellationToken cancellationToken = default)
    {
        UpdateAuditableEntities(eventData.Context);
        return await base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    private void UpdateAuditableEntities(DbContext? context)
    {
        if (context == null) return;

        var entries = context.ChangeTracker.Entries<BaseEntity>();

        foreach (var entry in entries)
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedBy = _currentUser.UserId;
                entry.Entity.CreatedAt = _dateTime.UtcNow;
                
                CreateAuditLog(context, entry, AuditActionType.Create);
            }

            if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = _dateTime.UtcNow;
                
                CreateAuditLog(context, entry, AuditActionType.Update);
            }

            if (entry.State == EntityState.Deleted)
            {
                // Convert physical delete to soft delete
                entry.State = EntityState.Modified;
                entry.Entity.IsDeleted = true;
                entry.Entity.UpdatedAt = _dateTime.UtcNow;
                
                CreateAuditLog(context, entry, AuditActionType.Delete);
            }
        }
    }

    private void CreateAuditLog(DbContext context, EntityEntry entry, AuditActionType actionType)
    {
        var entityName = entry.Entity.GetType().Name;
        var entityId = entry.Property("Id").CurrentValue?.ToString();

        var oldValues = entry.State == EntityState.Added ? null : 
            JsonSerializer.Serialize(entry.OriginalValues.ToObject());
        
        var newValues = entry.State == EntityState.Deleted ? null : 
            JsonSerializer.Serialize(entry.CurrentValues.ToObject());

        var auditLog = new AuditLog
        {
            UserId = _currentUser.UserId,
            ActionType = actionType,
            EntityName = entityName,
            EntityId = entityId,
            OldValues = oldValues,
            NewValues = newValues,
            IpAddress = _httpContext.HttpContext?.Connection.RemoteIpAddress?.ToString(),
            UserAgent = _httpContext.HttpContext?.Request.Headers["User-Agent"].ToString(),
            Timestamp = _dateTime.UtcNow
        };

        context.Set<AuditLog>().Add(auditLog);
    }
}
```

### 11.2 MediatR Pipeline Behavior

**Command Audit Logging**:
```csharp
public class AuditLoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly ICurrentUserService _currentUser;
    private readonly IApplicationDbContext _context;
    private readonly ILogger<AuditLoggingBehavior<TRequest, TResponse>> _logger;

    public async Task<TResponse> Handle(
        TRequest request, 
        RequestHandlerDelegate<TResponse> next, 
        CancellationToken cancellationToken)
    {
        var requestName = typeof(TRequest).Name;

        // Log command execution
        _logger.LogInformation("Executing command {CommandName} by user {UserId}", 
            requestName, _currentUser.UserId);

        var response = await next();

        // Log for specific commands that don't trigger entity changes
        if (requestName.EndsWith("Command") && ShouldAuditCommand(requestName))
        {
            await CreateCommandAuditLog(requestName, request);
        }

        return response;
    }

    private bool ShouldAuditCommand(string commandName)
    {
        // Audit non-entity commands (e.g., StatusChange, Login, Logout)
        var auditableCommands = new[] { 
            nameof(LoginCommand), 
            nameof(LogoutCommand), 
            nameof(ChangePasswordCommand) 
        };

        return auditableCommands.Contains(commandName);
    }

    private async Task CreateCommandAuditLog(string commandName, TRequest request)
    {
        var auditLog = new AuditLog
        {
            UserId = _currentUser.UserId,
            ActionType = MapCommandToActionType(commandName),
            EntityName = commandName,
            EntityId = ExtractEntityId(request),
            NewValues = JsonSerializer.Serialize(request),
            Timestamp = DateTime.UtcNow
        };

        _context.AuditLogs.Add(auditLog);
        await _context.SaveChangesAsync(default);
    }
}
```

### 11.3 Audit Log Query Interface

**Query by User**:
```csharp
GET /api/v1/audit-logs?userId={guid}&pageNumber=1&pageSize=50
```

**Query by Action Type**:
```csharp
GET /api/v1/audit-logs?actionType=Update&pageNumber=1&pageSize=50
```

**Query by Entity**:
```csharp
GET /api/v1/audit-logs?entityName=ParkingSlot&entityId={guid}
```

**Query by Date Range**:
```csharp
GET /api/v1/audit-logs?startDate=2024-01-01&endDate=2024-01-31
```

### 11.4 Audit Log Retention

**Retention Policy**:
- Minimum: 2 years (730 days)
- No physical deletion (preserve for compliance)
- Old logs archived to cold storage after 2 years
- Archival process runs monthly

**Table Partitioning** (for performance):
```sql
-- Partition by month
CREATE PARTITION FUNCTION AuditLogPartitionFunction (DATETIME2)
AS RANGE RIGHT FOR VALUES (
    '2024-02-01', '2024-03-01', '2024-04-01', ...
);

CREATE PARTITION SCHEME AuditLogPartitionScheme
AS PARTITION AuditLogPartitionFunction
ALL TO ([PRIMARY]);

-- Apply to audit_logs table
CREATE TABLE audit_logs (
    ...
) ON AuditLogPartitionScheme(timestamp);
```

### 11.5 Audit Log Security

**Access Control**:
- Only SuperAdmin can query audit logs
- No modification or deletion of audit logs allowed
- Read-only database user for audit queries

**Data Protection**:
- Sensitive fields (passwords) excluded from OldValues/NewValues
- PII fields masked in audit logs (optional)
- Audit logs encrypted at rest (database-level encryption)


## 12. Notification Design

### 12.1 Notification Architecture

**Event-Driven Pattern**:
```
Event Occurs → Domain Event Published → Event Handler → Notification Created → SignalR Broadcast
```

**MediatR Domain Events**:
```csharp
// Domain event published when incident created
public class IncidentCreatedEvent : INotification
{
    public Guid IncidentId { get; set; }
    public IncidentType IncidentType { get; set; }
    public IncidentSeverity Severity { get; set; }
    public Guid ParkingAreaId { get; set; }
    public Guid ReportedBy { get; set; }
}

// Event handler creates notifications
public class IncidentCreatedEventHandler : INotificationHandler<IncidentCreatedEvent>
{
    private readonly INotificationService _notificationService;

    public async Task Handle(IncidentCreatedEvent notification, CancellationToken cancellationToken)
    {
        // Notify SuperAdmins for Critical incidents
        if (notification.Severity == IncidentSeverity.Critical)
        {
            await _notificationService.NotifySuperAdminsAsync(
                NotificationType.Incident_Alert,
                NotificationSeverity.Error,
                "Critical Incident Reported",
                $"A critical incident of type {notification.IncidentType} has been reported.",
                "Incident",
                notification.IncidentId.ToString()
            );
        }
    }
}
```

### 12.2 Notification Service Implementation

```csharp
public interface INotificationService
{
    Task CreateNotificationAsync(
        Guid userId, 
        NotificationType type, 
        NotificationSeverity severity, 
        string title, 
        string message, 
        string? relatedEntityType = null, 
        string? relatedEntityId = null);

    Task NotifySuperAdminsAsync(
        NotificationType type, 
        NotificationSeverity severity, 
        string title, 
        string message, 
        string? relatedEntityType = null, 
        string? relatedEntityId = null);

    Task NotifyAdminsAsync(/* similar parameters */);
    
    Task BroadcastSystemNotificationAsync(/* similar parameters */);
}

public class NotificationService : INotificationService
{
    private readonly IApplicationDbContext _context;
    private readonly IHubContext<ParkingHub> _hubContext;

    public async Task CreateNotificationAsync(
        Guid userId, 
        NotificationType type, 
        NotificationSeverity severity, 
        string title, 
        string message, 
        string? relatedEntityType, 
        string? relatedEntityId)
    {
        var notification = new Notification
        {
            UserId = userId,
            NotificationType = type,
            Severity = severity,
            Title = title,
            Message = message,
            RelatedEntityType = relatedEntityType,
            RelatedEntityId = relatedEntityId,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync(default);

        // Broadcast via SignalR to user-specific group
        await _hubContext.Clients
            .Group($"user-{userId}")
            .SendAsync("OnNotificationReceived", MapToDto(notification));
    }

    public async Task NotifySuperAdminsAsync(
        NotificationType type, 
        NotificationSeverity severity, 
        string title, 
        string message, 
        string? relatedEntityType, 
        string? relatedEntityId)
    {
        var superAdmins = await _context.Users
            .Where(u => u.Role == UserRole.SuperAdmin && u.IsActive)
            .ToListAsync();

        foreach (var admin in superAdmins)
        {
            await CreateNotificationAsync(
                admin.Id, type, severity, title, message, 
                relatedEntityType, relatedEntityId);
        }
    }
}
```

### 12.3 Notification Routing Rules

**Incident_Alert**:
- Critical severity → All SuperAdmins
- High severity → All Admins + SuperAdmins
- Medium/Low severity → Incident reporter only

**Maintenance_Alert**:
- Slot marked as Maintenance → All Admins + SuperAdmins

**System_Notification**:
- Configuration changes → All authenticated users (broadcast)
- System downtime alerts → All authenticated users

**Prediction_Alert** (Future):
- Unusual occupancy patterns detected → Admins + SuperAdmins

**Sensor_Alert** (Future):
- Sensor low battery → Staff + Admins
- Sensor offline → Admins + SuperAdmins

### 12.4 Real-Time Delivery

**SignalR Integration**:
```csharp
// When user connects
public override async Task OnConnectedAsync()
{
    var userId = Context.User?.FindFirst("sub")?.Value;
    
    if (!string.IsNullOrEmpty(userId))
    {
        // Add to user-specific group
        await Groups.AddToGroupAsync(Context.ConnectionId, $"user-{userId}");
        
        // Send unread notification count on connect
        var unreadCount = await GetUnreadNotificationCount(userId);
        await Clients.Caller.SendAsync("OnUnreadCountUpdated", unreadCount);
    }

    await base.OnConnectedAsync();
}

// Broadcast notification to user
await _hubContext.Clients
    .Group($"user-{userId}")
    .SendAsync("OnNotificationReceived", notificationDto);
```

**Offline User Handling**:
- Notifications stored in database even if user offline
- Retrieved when user next logs in
- Unread count displayed in UI header

### 12.5 Notification Archival

**Automatic Archival**:
```csharp
[AutomaticRetry(Attempts = 3)]
public async Task ArchiveOldNotifications()
{
    var thirtyDaysAgo = DateTime.UtcNow.AddDays(-30);

    await _context.Notifications
        .Where(n => n.CreatedAt < thirtyDaysAgo && !n.IsArchived)
        .ExecuteUpdateAsync(setters => setters
            .SetProperty(n => n.IsArchived, true));
}
```

**Archival Job Schedule**:
- Runs daily at 2:00 AM UTC
- Archives notifications older than 30 days
- Archived notifications excluded from default queries

**Retention Policy**:
- All notifications: 90 days in active table
- Archived notifications: Moved to cold storage after 90 days
- Critical notifications: Never deleted (indefinite retention)

### 12.6 Notification UI Components

**Bell Icon (Header)**:
- Displays unread count badge
- Dropdown shows recent 5 notifications
- "View All" link to notifications page

**Notification List Page**:
- Paginated list (20 per page)
- Filter by: type, severity, read/unread status
- Mark as read (individual or bulk)
- Click notification navigates to related entity

**Notification Toast**:
- Real-time toast notification when new notification arrives
- Auto-dismiss after 5 seconds
- Color-coded by severity (Info=blue, Warning=amber, Error=red)


## 13. Parking Incident Design

### 13.1 Incident State Machine

**State Transitions**:
```
       ┌─────────────────────────────────────┐
       │                                     │
       │                                     ▼
┌──────▼──────┐      ┌─────────────┐      ┌────────────┐      ┌────────┐
│    Open     │─────►│ In_Progress │─────►│  Resolved  │─────►│ Closed │
└─────────────┘      └─────────────┘      └─────┬──────┘      └────────┘
                            │                     │
                            └─────────────────────┘
                            (Staff can reopen)
```

**Transition Rules**:
```csharp
public class IncidentStateMachine
{
    public bool CanTransition(IncidentStatus from, IncidentStatus to, UserRole userRole)
    {
        return (from, to) switch
        {
            (IncidentStatus.Open, IncidentStatus.In_Progress) => 
                userRole >= UserRole.Staff,
            
            (IncidentStatus.In_Progress, IncidentStatus.Resolved) => 
                userRole >= UserRole.Staff,
            
            (IncidentStatus.In_Progress, IncidentStatus.Open) => 
                userRole >= UserRole.Staff,  // Reopen
            
            (IncidentStatus.Resolved, IncidentStatus.Closed) => 
                userRole >= UserRole.Admin,
            
            (IncidentStatus.Resolved, IncidentStatus.In_Progress) => 
                userRole >= UserRole.Admin,  // Reopen
            
            (IncidentStatus.Closed, _) => 
                false,  // Terminal state, no transitions allowed
            
            _ => false
        };
    }
}
```

### 13.2 Incident Creation Flow

**Command Handler**:
```csharp
public class CreateIncidentCommandHandler : IRequestHandler<CreateIncidentCommand, Guid>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly IPublisher _publisher;

    public async Task<Guid> Handle(CreateIncidentCommand request, CancellationToken cancellationToken)
    {
        // Validate slot exists if provided
        if (request.SlotId.HasValue)
        {
            var slotExists = await _context.ParkingSlots
                .AnyAsync(s => s.Id == request.SlotId.Value && !s.IsDeleted, cancellationToken);
            
            if (!slotExists)
                throw new NotFoundException(nameof(ParkingSlot), request.SlotId.Value);
        }

        var incident = new ParkingIncident
        {
            ParkingAreaId = request.ParkingAreaId,
            ZoneId = request.ZoneId,
            SlotId = request.SlotId,
            IncidentType = request.IncidentType,
            Severity = request.Severity,
            Description = request.Description,
            Status = IncidentStatus.Open,
            ReportedBy = _currentUser.UserId!.Value,
            ReportedAt = DateTime.UtcNow
        };

        _context.ParkingIncidents.Add(incident);
        await _context.SaveChangesAsync(cancellationToken);

        // Auto-update slot status if Maintenance_Issue
        if (request.IncidentType == IncidentType.Maintenance_Issue && request.SlotId.HasValue)
        {
            await UpdateSlotToMaintenance(request.SlotId.Value, cancellationToken);
        }

        // Publish domain event for notifications
        await _publisher.Publish(new IncidentCreatedEvent
        {
            IncidentId = incident.Id,
            IncidentType = incident.IncidentType,
            Severity = incident.Severity,
            ParkingAreaId = incident.ParkingAreaId,
            ReportedBy = incident.ReportedBy
        }, cancellationToken);

        return incident.Id;
    }

    private async Task UpdateSlotToMaintenance(Guid slotId, CancellationToken cancellationToken)
    {
        var slot = await _context.ParkingSlots.FindAsync(new object[] { slotId }, cancellationToken);
        
        if (slot != null)
        {
            slot.CurrentStatus = SlotStatus.Maintenance;
            slot.LastStatusChange = DateTime.UtcNow;
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
```

### 13.3 Incident Resolution Flow

**Resolution Requirements**:
- Status must be `In_Progress` or `Resolved`
- Resolution notes required (10-500 characters)
- Resolved by user ID and timestamp recorded

**Command Handler**:
```csharp
public class ResolveIncidentCommandHandler : IRequestHandler<ResolveIncidentCommand>
{
    public async Task Handle(ResolveIncidentCommand request, CancellationToken cancellationToken)
    {
        var incident = await _context.ParkingIncidents
            .Include(i => i.Slot)
            .FirstOrDefaultAsync(i => i.Id == request.IncidentId, cancellationToken);

        if (incident == null)
            throw new NotFoundException(nameof(ParkingIncident), request.IncidentId);

        // Validate state transition
        if (!_stateMachine.CanTransition(incident.Status, IncidentStatus.Resolved, _currentUser.Role))
            throw new InvalidOperationException("Cannot resolve incident in current state");

        // Validate resolution notes provided
        if (string.IsNullOrWhiteSpace(request.ResolutionNotes) || 
            request.ResolutionNotes.Length < 10)
            throw new ValidationException("Resolution notes must be at least 10 characters");

        incident.Status = IncidentStatus.Resolved;
        incident.ResolvedBy = _currentUser.UserId!.Value;
        incident.ResolvedAt = DateTime.UtcNow;
        incident.ResolutionNotes = request.ResolutionNotes;

        await _context.SaveChangesAsync(cancellationToken);

        // Publish event
        await _publisher.Publish(new IncidentResolvedEvent
        {
            IncidentId = incident.Id,
            ResolvedBy = incident.ResolvedBy.Value,
            ResolutionNotes = incident.ResolutionNotes
        }, cancellationToken);

        // Prompt to update slot status if linked
        if (incident.SlotId.HasValue && incident.Slot?.CurrentStatus == SlotStatus.Maintenance)
        {
            // Log suggestion to update slot status back to Available
            _logger.LogInformation(
                "Incident {IncidentId} resolved. Consider updating slot {SlotId} status to Available",
                incident.Id, incident.SlotId.Value);
        }
    }
}
```

### 13.4 Incident Dashboard Metrics

**Query Handler**:
```csharp
public class GetIncidentDashboardQuery : IRequest<IncidentDashboardDto>
{
    public Guid? ParkingAreaId { get; set; }
}

public class GetIncidentDashboardQueryHandler : IRequestHandler<GetIncidentDashboardQuery, IncidentDashboardDto>
{
    public async Task<IncidentDashboardDto> Handle(
        GetIncidentDashboardQuery request, 
        CancellationToken cancellationToken)
    {
        var query = _context.ParkingIncidents.AsQueryable();

        if (request.ParkingAreaId.HasValue)
            query = query.Where(i => i.ParkingAreaId == request.ParkingAreaId.Value);

        var openIncidents = await query
            .Where(i => i.Status != IncidentStatus.Closed)
            .ToListAsync(cancellationToken);

        var closedIncidents = await query
            .Where(i => i.Status == IncidentStatus.Closed 
                     && i.ResolvedAt.HasValue 
                     && i.ResolvedAt.Value >= DateTime.UtcNow.AddDays(-30))
            .ToListAsync(cancellationToken);

        return new IncidentDashboardDto
        {
            OpenIncidentsBySeverity = openIncidents
                .GroupBy(i => i.Severity)
                .ToDictionary(g => g.Key, g => g.Count()),

            IncidentsByType = openIncidents
                .GroupBy(i => i.IncidentType)
                .ToDictionary(g => g.Key, g => g.Count()),

            AverageResolutionTimeMinutes = closedIncidents
                .Where(i => i.ResolvedAt.HasValue)
                .Select(i => (i.ResolvedAt.Value - i.ReportedAt).TotalMinutes)
                .DefaultIfEmpty(0)
                .Average(),

            CriticalIncidentsOpenMoreThan2Hours = openIncidents
                .Where(i => i.Severity == IncidentSeverity.Critical 
                         && (DateTime.UtcNow - i.ReportedAt).TotalHours > 2)
                .Select(i => new IncidentSummaryDto
                {
                    Id = i.Id,
                    IncidentType = i.IncidentType,
                    Description = i.Description,
                    ReportedAt = i.ReportedAt,
                    HoursOpen = (DateTime.UtcNow - i.ReportedAt).TotalHours
                })
                .ToList(),

            IncidentTrendLast7Days = await GetIncidentTrend(query, 7, cancellationToken)
        };
    }
}
```

### 13.5 Incident Search and Filtering

**Query with Multiple Filters**:
```csharp
GET /api/v1/incidents
    ?parkingAreaId=guid
    &zoneId=guid
    &slotId=guid
    &incidentType=Blocked_Slot
    &severity=High,Critical
    &status=Open,In_Progress
    &reportedDateFrom=2024-01-01
    &reportedDateTo=2024-01-31
    &searchText=blocked
    &sortBy=ReportedAt
    &sortOrder=desc
    &pageNumber=1
    &pageSize=50
```

**Efficient Query Implementation**:
```csharp
var query = _context.ParkingIncidents
    .Include(i => i.Reporter)
    .Include(i => i.Resolver)
    .Include(i => i.ParkingArea)
    .Include(i => i.Zone)
    .Include(i => i.Slot)
    .AsQueryable();

// Apply filters
if (request.ParkingAreaId.HasValue)
    query = query.Where(i => i.ParkingAreaId == request.ParkingAreaId.Value);

if (request.IncidentTypes?.Any() == true)
    query = query.Where(i => request.IncidentTypes.Contains(i.IncidentType));

if (!string.IsNullOrWhiteSpace(request.SearchText))
    query = query.Where(i => i.Description.Contains(request.SearchText) 
                          || i.ResolutionNotes.Contains(request.SearchText));

// Apply sorting
query = request.SortBy switch
{
    "Severity" => request.SortOrder == "asc" 
        ? query.OrderBy(i => i.Severity) 
        : query.OrderByDescending(i => i.Severity),
    "ReportedAt" => request.SortOrder == "asc" 
        ? query.OrderBy(i => i.ReportedAt) 
        : query.OrderByDescending(i => i.ReportedAt),
    _ => query.OrderByDescending(i => i.ReportedAt)
};

// Apply pagination
var totalCount = await query.CountAsync(cancellationToken);
var items = await query
    .Skip((request.PageNumber - 1) * request.PageSize)
    .Take(request.PageSize)
    .ToListAsync(cancellationToken);
```


## 14. Future IoT Integration Design

### 14.1 Sensor Device Entity

**Domain Entity**:
```csharp
public class SensorDevice : BaseEntity
{
    public Guid SlotId { get; set; }
    public ParkingSlot Slot { get; set; }
    public string MacAddress { get; set; }
    public SensorType DeviceType { get; set; }
    public float BatteryLevel { get; set; }  // 0-100%
    public DateTime LastHeartbeat { get; set; }
    public bool IsActive { get; set; }
    public string FirmwareVersion { get; set; }
    public string? CalibrationData { get; set; }  // JSON
}

public enum SensorType
{
    Ultrasonic = 0,
    Infrared = 1,
    Magnetic = 2,
    Camera = 3
}
```

**Database Table**:
```sql
sensor_devices
    id                  UNIQUEIDENTIFIER PRIMARY KEY
    slot_id             UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES parking_slots(id)
    mac_address         NVARCHAR(17) NOT NULL UNIQUE  -- XX:XX:XX:XX:XX:XX
    device_type         TINYINT NOT NULL
    battery_level       FLOAT NOT NULL CHECK (battery_level >= 0 AND battery_level <= 100)
    last_heartbeat      DATETIME2 NOT NULL
    is_active           BIT NOT NULL DEFAULT 1
    firmware_version    NVARCHAR(20) NOT NULL
    calibration_data    NVARCHAR(MAX) NULL
    created_at          DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    updated_at          DATETIME2 NULL
    is_deleted          BIT NOT NULL DEFAULT 0

INDEX idx_sensor_devices_slot_id (slot_id)
INDEX idx_sensor_devices_mac_address (mac_address)
INDEX idx_sensor_devices_last_heartbeat (last_heartbeat)
```

### 14.2 IoT Data Flow Architecture

```
┌─────────────────┐
│  Sensor Device  │ (Ultrasonic/Infrared)
└────────┬────────┘
         │ MQTT Message
         │ {"slotId": "guid", "occupied": true, "timestamp": "2024-01-15T10:00:00Z"}
         ▼
┌─────────────────────┐
│  Azure IoT Hub      │
└────────┬────────────┘
         │ Event Grid
         ▼
┌─────────────────────┐
│  Azure Function     │ (Process IoT Message)
└────────┬────────────┘
         │ HTTP POST
         │ /api/v1/iot/slots/{slotId}/status
         ▼
┌─────────────────────┐
│  WebAPI Internal    │
└────────┬────────────┘
         │ Update Database
         │ Broadcast SignalR
         ▼
┌─────────────────────┐
│  Clients (React)    │
└─────────────────────┘
```

### 14.3 IoT Message Format

**MQTT Payload from Sensor**:
```json
{
  "deviceId": "SENSOR-A001",
  "macAddress": "AA:BB:CC:DD:EE:FF",
  "slotId": "guid-of-slot",
  "occupied": true,
  "confidence": 0.95,
  "batteryLevel": 87.5,
  "timestamp": "2024-01-15T10:00:00Z",
  "firmware": "1.2.3"
}
```

**Azure Function Processing**:
```csharp
[FunctionName("ProcessSensorMessage")]
public static async Task Run(
    [EventGridTrigger] EventGridEvent eventGridEvent,
    ILogger log)
{
    var sensorData = JsonSerializer.Deserialize<SensorMessage>(eventGridEvent.Data.ToString());

    // Validate sensor is registered
    var isRegistered = await _sensorService.IsSensorRegisteredAsync(sensorData.MacAddress);
    if (!isRegistered)
    {
        log.LogWarning("Unregistered sensor {MacAddress} attempted to send data", sensorData.MacAddress);
        return;
    }

    // Update slot status via internal API
    var apiClient = new HttpClient();
    apiClient.DefaultRequestHeaders.Add("X-IoT-API-Key", Environment.GetEnvironmentVariable("IoT_API_Key"));

    var response = await apiClient.PostAsJsonAsync(
        $"https://api.smartparking.com/api/v1/iot/slots/{sensorData.SlotId}/status",
        new
        {
            status = sensorData.Occupied ? SlotStatus.Occupied : SlotStatus.Available,
            source = "IoT",
            confidence = sensorData.Confidence
        });

    // Update sensor metadata
    await _sensorService.UpdateSensorMetadataAsync(
        sensorData.MacAddress,
        sensorData.BatteryLevel,
        sensorData.Timestamp);

    // Check for alerts
    if (sensorData.BatteryLevel < 20)
    {
        await _notificationService.SendSensorAlertAsync(
            sensorData.SlotId,
            $"Low battery on sensor {sensorData.DeviceId}: {sensorData.BatteryLevel}%");
    }
}
```

### 14.4 IoT API Endpoints (Future)

```
POST   /api/v1/iot/slots/{slotId}/status
       Headers: X-IoT-API-Key: {key}
       Body: { status, source, confidence }
       Response: 200 OK

GET    /api/v1/iot/sensors
       Query: ?slotId=guid&isActive=true
       Response: SensorDeviceDto[]

POST   /api/v1/iot/sensors
       Body: { slotId, macAddress, deviceType, firmwareVersion }
       Response: 201 Created

PATCH  /api/v1/iot/sensors/{sensorId}/calibrate
       Body: { calibrationData }
       Response: 200 OK

GET    /api/v1/iot/sensors/{sensorId}/health
       Response: { batteryLevel, lastHeartbeat, isActive, signalStrength }
```

### 14.5 Sensor Health Monitoring

**Heartbeat Detection**:
```csharp
[AutomaticRetry(Attempts = 3)]
public async Task CheckSensorHealth()
{
    var fiveMinutesAgo = DateTime.UtcNow.AddMinutes(-5);

    var offlineSensors = await _context.SensorDevices
        .Where(s => s.IsActive && s.LastHeartbeat < fiveMinutesAgo)
        .Include(s => s.Slot)
        .ToListAsync();

    foreach (var sensor in offlineSensors)
    {
        // Create incident
        await _incidentService.CreateIncidentAsync(new CreateIncidentCommand
        {
            ParkingAreaId = sensor.Slot.Zone.ParkingAreaId,
            ZoneId = sensor.Slot.ZoneId,
            SlotId = sensor.SlotId,
            IncidentType = IncidentType.Sensor_Failure,
            Severity = IncidentSeverity.Medium,
            Description = $"Sensor {sensor.MacAddress} has not sent heartbeat for >5 minutes"
        });

        // Send notification
        await _notificationService.NotifyAdminsAsync(
            NotificationType.Sensor_Alert,
            NotificationSeverity.Warning,
            "Sensor Offline",
            $"Sensor for slot {sensor.Slot.SlotNumber} is offline",
            "Sensor",
            sensor.Id.ToString());
    }
}
```

**Low Battery Alerts**:
```csharp
[AutomaticRetry(Attempts = 3)]
public async Task CheckSensorBatteries()
{
    var lowBatterySensors = await _context.SensorDevices
        .Where(s => s.IsActive && s.BatteryLevel < 20)
        .Include(s => s.Slot)
        .ToListAsync();

    foreach (var sensor in lowBatterySensors)
    {
        await _notificationService.NotifyStaffAsync(
            NotificationType.Sensor_Alert,
            NotificationSeverity.Info,
            "Low Sensor Battery",
            $"Sensor for slot {sensor.Slot.SlotNumber} has {sensor.BatteryLevel}% battery remaining",
            "Sensor",
            sensor.Id.ToString());
    }
}
```

### 14.6 IoT Security

**API Key Authentication**:
```csharp
public class IoTApiKeyAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (!Request.Headers.TryGetValue("X-IoT-API-Key", out var apiKey))
            return AuthenticateResult.Fail("Missing API Key");

        var validKey = Configuration["IoT:ApiKey"];
        if (apiKey != validKey)
            return AuthenticateResult.Fail("Invalid API Key");

        var claims = new[] { new Claim(ClaimTypes.Name, "IoTDevice") };
        var identity = new ClaimsIdentity(claims, Scheme.Name);
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, Scheme.Name);

        return AuthenticateResult.Success(ticket);
    }
}
```

**IP Whitelisting**:
- IoT Gateway IP addresses whitelisted in firewall
- Azure IoT Hub provides device authentication
- TLS 1.2+ required for all connections

**Rate Limiting**:
- 1 message per second per sensor
- 100 messages per minute per IoT Gateway
- Burst allowance: 10 messages in 5 seconds


## 15. Deployment-Ready Configuration Design

### 15.1 Environment Configurations

**appsettings.json** (Base configuration):
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ApplicationInsights": {
    "ConnectionString": ""
  }
}
```

**appsettings.Development.json**:
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "Microsoft.EntityFrameworkCore.Database.Command": "Information"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=SmartParkingDev;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "JwtSettings": {
    "SecretKey": "dev-secret-key-min-32-chars-long",
    "Issuer": "SmartParkingAPI",
    "Audience": "SmartParkingClient",
    "AccessTokenExpirationMinutes": 15,
    "RefreshTokenExpirationDays": 7
  },
  "CorsSettings": {
    "AllowedOrigins": ["http://localhost:5173", "http://localhost:3000"]
  },
  "RateLimitSettings": {
    "EnableRateLimiting": false
  },
  "SignalRSettings": {
    "UseAzureSignalR": false
  },
  "CacheSettings": {
    "UseRedis": false
  },
  "EmailSettings": {
    "SmtpServer": "smtp.mailtrap.io",
    "SmtpPort": 587,
    "UseSsl": true,
    "FromEmail": "noreply@smartparking.local",
    "FromName": "Smart Parking Dev"
  }
}
```

**appsettings.Staging.json**:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "ENV:ConnectionStrings__DefaultConnection"
  },
  "JwtSettings": {
    "SecretKey": "ENV:JwtSettings__SecretKey"
  },
  "CorsSettings": {
    "AllowedOrigins": ["https://staging.smartparking.ayalamalls.com"]
  },
  "RateLimitSettings": {
    "EnableRateLimiting": true,
    "PublicEndpointLimit": 60,
    "WindowMinutes": 1
  },
  "SignalRSettings": {
    "UseAzureSignalR": true,
    "ConnectionString": "ENV:Azure__SignalR__ConnectionString"
  },
  "CacheSettings": {
    "UseRedis": true,
    "RedisConnectionString": "ENV:Redis__ConnectionString"
  }
}
```

**appsettings.Production.json**:
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "ENV:ConnectionStrings__DefaultConnection"
  },
  "JwtSettings": {
    "SecretKey": "ENV:JwtSettings__SecretKey"
  },
  "CorsSettings": {
    "AllowedOrigins": ["https://parking.ayalamalls.com"]
  },
  "RateLimitSettings": {
    "EnableRateLimiting": true,
    "PublicEndpointLimit": 60,
    "WindowMinutes": 1,
    "IpWhitelist": ["ENV:RateLimitSettings__IpWhitelist"]
  },
  "SignalRSettings": {
    "UseAzureSignalR": true,
    "ConnectionString": "ENV:Azure__SignalR__ConnectionString",
    "MaxConnectionsPerServer": 10000
  },
  "CacheSettings": {
    "UseRedis": true,
    "RedisConnectionString": "ENV:Redis__ConnectionString",
    "InstanceName": "SmartParking:"
  },
  "HangfireSettings": {
    "DashboardEnabled": false
  }
}
```

### 15.2 Azure Resources Architecture

**Resource Group**: `rg-smartparking-prod`

**Compute**:
- **Azure App Service** (API)
  - Plan: P1v3 (Premium v3)
  - OS: Windows
  - Runtime: .NET 8
  - Auto-scaling: 2-10 instances based on CPU/Memory
  - Always On: Enabled
  
- **Azure Static Web Apps** (Frontend)
  - Plan: Standard
  - Custom Domain: parking.ayalamalls.com
  - CDN: Azure Front Door

**Database**:
- **Azure SQL Database**
  - Tier: General Purpose
  - Compute: Gen5, 4 vCores
  - Storage: 100 GB
  - Backup: 30-day retention
  - Geo-replication: Southeast Asia (secondary)

**Caching & Real-Time**:
- **Azure Redis Cache**
  - Tier: Standard C1 (1 GB)
  - TLS: Enabled
  
- **Azure SignalR Service**
  - Tier: Standard (Unit 1)
  - Max connections: 1000 concurrent

**Storage**:
- **Azure Blob Storage**
  - Tier: Hot
  - Purpose: Report exports (PDF/Excel)
  - Lifecycle: Delete after 30 days

**Security**:
- **Azure Key Vault**
  - Purpose: Store secrets (JWT key, connection strings, API keys)
  - Access: Managed Identity for App Service
  
- **Azure Application Insights**
  - Purpose: Monitoring, logging, analytics
  - Retention: 90 days

**Networking**:
- **Azure Front Door**
  - Purpose: CDN, DDoS protection, WAF
  - Custom domain with SSL certificate

### 15.3 Database Migration Strategy

**Development Environment**:
```bash
# Apply migrations automatically on startup
dotnet ef database update --project src/SmartParking.Infrastructure
```

**Staging/Production**:
```bash
# Generate SQL script for review
dotnet ef migrations script --idempotent --output migration.sql

# Review script manually
# Apply via Azure SQL deployment or manual execution
```

**Seed Data Deployment**:
```csharp
public static class ApplicationDbContextSeed
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // Seed default SuperAdmin
        if (!await context.Users.AnyAsync(u => u.Role == UserRole.SuperAdmin))
        {
            var admin = new User
            {
                Username = "admin",
                Email = "admin@smartparking.local",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                Role = UserRole.SuperAdmin,
                IsActive = true
            };
            context.Users.Add(admin);
        }

        // Seed default parking area
        if (!await context.ParkingAreas.AnyAsync())
        {
            var area = new ParkingArea
            {
                Name = "Ayala Malls Abreeza Ground Floor",
                Address = "J.P. Laurel Ave, Bajada, Davao City, 8000 Davao del Sur, Philippines",
                Description = "Main ground floor parking facility"
            };
            context.ParkingAreas.Add(area);
        }

        await context.SaveChangesAsync();
    }
}
```

### 15.4 CI/CD Pipeline (GitHub Actions)

**.github/workflows/deploy-staging.yml**:
```yaml
name: Deploy to Staging

on:
  push:
    branches: [ develop ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup .NET
      uses: actions/setup-dotnet@v3
      with:
        dotnet-version: '8.0.x'
    
    - name: Restore dependencies
      run: dotnet restore
    
    - name: Build
      run: dotnet build --configuration Release --no-restore
    
    - name: Test
      run: dotnet test --no-build --verbosity normal
    
    - name: Publish
      run: dotnet publish src/SmartParking.WebAPI/SmartParking.WebAPI.csproj -c Release -o ./publish
    
    - name: Deploy to Azure Web App
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'app-smartparking-staging'
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE_STAGING }}
        package: ./publish
    
    - name: Run Database Migrations
      run: |
        dotnet ef database update --project src/SmartParking.Infrastructure \
          --connection "${{ secrets.STAGING_CONNECTION_STRING }}"
```

**.github/workflows/deploy-production.yml**:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
    - uses: actions/checkout@v3
    
    # Similar steps to staging
    # Additional: Manual approval gate
    # Health check validation after deployment
```

### 15.5 Health Checks Configuration

**Program.cs**:
```csharp
builder.Services.AddHealthChecks()
    .AddDbContextCheck<ApplicationDbContext>("database")
    .AddRedis(builder.Configuration.GetConnectionString("Redis")!, "redis")
    .AddAzureSignalRService(builder.Configuration["Azure:SignalR:ConnectionString"]!, "signalr")
    .AddCheck("self", () => HealthCheckResult.Healthy());

app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});

app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("ready"),
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});

app.MapHealthChecks("/health/live", new HealthCheckOptions
{
    Predicate = _ => false  // Only checks if app is running
});
```

### 15.6 Monitoring and Alerting

**Application Insights Configuration**:
```csharp
builder.Services.AddApplicationInsightsTelemetry(options =>
{
    options.ConnectionString = builder.Configuration["ApplicationInsights:ConnectionString"];
    options.EnableAdaptiveSampling = true;
    options.EnableQuickPulseMetricStream = true;
});

// Custom telemetry
builder.Services.AddSingleton<ITelemetryInitializer, CustomTelemetryInitializer>();
```

**Alert Rules**:
- API Response Time > 500ms for 5 minutes
- Error Rate > 1% for 5 minutes
- SignalR Connection Failures > 10 per minute
- Database CPU > 80% for 10 minutes
- Failed Login Attempts > 20 per minute (potential attack)

**Dashboard Metrics**:
- Request rate (requests/second)
- Average response time
- Error rate
- Active SignalR connections
- Database query performance
- Cache hit ratio
- Prediction calculation time

### 15.7 Backup and Disaster Recovery

**Database Backups**:
- Automated daily backups at 2:00 AM local time
- 30-day retention for daily backups
- 12-week retention for weekly backups
- Point-in-time restore (7 days)

**Geo-Replication**:
- Primary: Southeast Asia (Singapore)
- Secondary: East Asia (Hong Kong)
- Automatic failover enabled

**Application Redundancy**:
- Multi-instance deployment (minimum 2 instances)
- Load balanced via Azure App Service
- Zero-downtime deployments via slot swapping

**Disaster Recovery Plan**:
1. Monitor health endpoints continuously
2. On failure: Automatic failover to secondary region
3. DNS updated to point to failover instance
4. Manual validation of data integrity
5. RTO (Recovery Time Objective): 15 minutes
6. RPO (Recovery Point Objective): 5 minutes

---

## Summary

This technical design specification provides a complete blueprint for implementing the Smart Parking Management System. The design follows Clean Architecture principles, uses industry-standard technologies (ASP.NET Core 9, React 18, SQL Server, SignalR), and includes comprehensive considerations for security, scalability, performance, and maintainability.

**Key Design Highlights**:
- ✅ Clean Architecture with strict layer separation
- ✅ CQRS pattern with MediatR for scalable command/query handling
- ✅ JWT authentication with refresh token rotation
- ✅ SignalR for real-time updates (<100ms latency)
- ✅ Rule-based prediction engine (ML-ready architecture)
- ✅ Event-driven notification system
- ✅ State machine-based incident management
- ✅ Comprehensive audit logging
- ✅ Future-ready IoT sensor integration
- ✅ Azure-native deployment architecture
- ✅ Automated CI/CD pipeline
- ✅ Health monitoring and disaster recovery

**Ready for Implementation**: This design can now be translated into tasks and implementation can begin following the specified architecture, patterns, and configurations.

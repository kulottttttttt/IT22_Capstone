# Implementation Tasks

## Task 1: Complete Domain Layer Missing Entities
Add missing domain entities to complete the domain model as per design specification.
**Dependencies:** None
- [x] Add User, RefreshToken entities with BCrypt password support
- [x] Add PredictionSnapshot, Notification, AuditLog, SystemSetting entities  
- [ ] Add domain events: SlotStatusChangedEvent, IncidentCreatedEvent, IncidentResolvedEvent
- [ ] Add domain exceptions: DomainException, BusinessRuleViolationException
- [ ] Add domain interfaces: IEntity, IAuditableEntity
- [ ] Add missing enums: NotificationType, NotificationSeverity, AuditActionType, ConfidenceLevel

## Task 2: Complete Application Layer Foundation  
Set up complete application layer with CQRS, validation, and mapping infrastructure.
**Dependencies:** 1
- [ ] Create Common/Models/Result.cs for operation results
- [ ] Create Common/Interfaces: ICurrentUserService, IDateTime, IEmailService, IPredictionEngine
- [ ] Create MappingProfile.cs with AutoMapper configurations for all entities
- [ ] Create MediatR pipeline behaviors: ValidationBehavior, LoggingBehavior, PerformanceBehavior, TransactionBehavior
- [ ] Update DependencyInjection.cs to register MediatR, AutoMapper, FluentValidation, pipeline behaviors

## Task 3: Complete Infrastructure Layer Services
Implement infrastructure services and complete database configurations.
**Dependencies:** 2
- [ ] Add missing EF Core configurations: UserConfiguration, RefreshTokenConfiguration, PredictionSnapshotConfiguration, NotificationConfiguration, AuditLogConfiguration, SystemSettingConfiguration
- [ ] Create Persistence/Interceptors/AuditableEntityInterceptor.cs for automatic audit field updates
- [ ] Create Services: DateTimeService, EmailService (SMTP), CacheService (IMemoryCache + IDistributedCache)
- [ ] Create Identity services: JwtTokenService, PasswordHashingService (BCrypt)
- [ ] Update DependencyInjection.cs to register all infrastructure services

## Task 4: Add Authentication and Authorization
Implement JWT authentication, refresh token management, and role-based authorization.
**Dependencies:** 3
- [ ] Create Application/Features/Auth commands: LoginCommand, RefreshTokenCommand, LogoutCommand, ChangePasswordCommand
- [ ] Create Application/Features/Auth DTOs: AuthResponseDto, LoginDto, RefreshTokenDto
- [ ] Create FluentValidation validators for auth commands
- [ ] Create WebAPI/Controllers/V1/AuthController with login, refresh, logout, change-password endpoints
- [ ] Configure JWT authentication in Program.cs with 15-minute access token expiration
- [ ] Configure authorization policies: RequireStaffRole, RequireAdminRole, RequireSuperAdminRole
- [ ] Add HttpOnly secure cookie support for refresh tokens

## Task 5: Implement Parking Infrastructure Management APIs
Complete CRUD operations for parking areas, zones, and slots with admin authorization.
**Dependencies:** 4
- [ ] Create Application/Features/ParkingAreas: Commands (Create, Update, Delete), Queries (GetAll, GetById), DTOs, Validators
- [ ] Create Application/Features/Zones: Commands (Create, Update, Delete, UpdateSortOrder), Queries (GetByAreaId, GetById), DTOs, Validators
- [ ] Create Application/Features/Slots: Commands (Create, Update, Delete, UpdateCoordinates), Queries (GetByZoneId, GetById), DTOs, Validators
- [ ] Create WebAPI/Controllers/V1: ParkingAreasController, ZonesController, SlotsController
- [ ] Implement soft delete with IsDeleted flag handling
- [ ] Add RequireAdminRole authorization to all infrastructure management endpoints
- [ ] Implement audit logging for all CUD operations via AuditActionFilter

## Task 6: Implement Slot Status Updates and Real-Time Tracking
Enable Staff users to update slot statuses and track status history.
**Dependencies:** 5
- [ ] Create Application/Features/Slots/Commands/UpdateSlotStatusCommand with Staff+ authorization
- [ ] Create SlotStatusHistory automatic creation on status change
- [ ] Implement end_time and duration_minutes calculation for previous status history record
- [ ] Create SlotStatusChangedEvent domain event
- [ ] Create Application/Features/Slots/Queries: GetSlotHistoryQuery with pagination
- [ ] Add PATCH /api/v1/slots/{slotId}/status endpoint with RequireStaffRole
- [ ] Add GET /api/v1/slots/{slotId}/history endpoint with pagination support

## Task 7: Implement SignalR Real-Time Hub
Set up SignalR hub for real-time parking status broadcasting.
**Dependencies:** 6
- [ ] Create WebAPI/Hubs/ParkingHub with connection management
- [ ] Implement JoinParkingAreaGroup and LeaveParkingAreaGroup methods
- [ ] Implement UpdateSlotStatus method with Staff+ role check
- [ ] Create server-to-client methods: OnSlotStatusChanged, OnZoneOccupancyChanged, OnIncidentCreated, OnIncidentStatusChanged, OnNotificationReceived
- [ ] Configure SignalR in Program.cs with /hubs/parking endpoint
- [ ] Add connection group management by parking_area_id
- [ ] Add user-specific groups for notifications (user-{userId})
- [ ] Implement SlotStatusChangedEvent handler to broadcast via SignalR
- [ ] Add anonymous connection support with rate limiting (max 10 per IP)

## Task 8: Implement Prediction Engine  
Build rule-based prediction engine for occupancy forecasting.
**Dependencies:** 7
- [ ] Create Infrastructure/Services/PredictionEngineService implementing IPredictionEngine
- [ ] Implement HistoricalBaseline calculation from SlotStatusHistory (day-of-week + hour-of-day)
- [ ] Implement CurrentTrend calculation from last 15 minutes of status changes
- [ ] Implement EventModifier logic (weekend +10%, peak hours +15%, mall closed -100%)
- [ ] Implement ConfidenceLevel calculation based on days of historical data
- [ ] Create prediction generation for 30min, 60min, 120min windows
- [ ] Implement per-zone and per-vehicle-type predictions
- [ ] Create Application/Features/Predictions: Queries (GetPredictions), DTOs
- [ ] Create WebAPI/Controllers/PublicController with GET /api/v1/public/areas/{areaId}/predictions
- [ ] Implement prediction caching with 5-minute expiration (Redis + in-memory)

## Task 9: Implement Parking Incident Management
Enable Staff to create and manage parking incidents with notifications.
**Dependencies:** 7
- [ ] Create Application/Features/Incidents: Commands (Create, UpdateStatus), Queries (GetAll with filters, GetById, GetDashboard), DTOs, Validators
- [ ] Implement IncidentType, IncidentStatus, IncidentSeverity enum handling
- [ ] Create WebAPI/Controllers/V1/IncidentsController with RequireStaffRole
- [ ] Implement POST /api/v1/incidents with incident creation
- [ ] Implement GET /api/v1/incidents with filtering (parkingAreaId, zoneId, status, severity, incidentType) and pagination
- [ ] Implement PATCH /api/v1/incidents/{incidentId}/status for status updates and resolution
- [ ] Implement GET /api/v1/incidents/dashboard for incident metrics (Admin+)
- [ ] Create IncidentCreatedEvent and IncidentResolvedEvent domain events
- [ ] Integrate SignalR broadcasting for incident events

## Task 10: Implement Notification System
Build notification delivery and management system for authenticated users.
**Dependencies:** 9
- [ ] Create Application/Features/Notifications: Commands (MarkAsRead, MarkAllAsRead, Archive), Queries (GetUserNotifications, GetUnreadCount), DTOs
- [ ] Create notification generation handlers for incident events (IncidentCreatedEvent → Notification)
- [ ] Create WebAPI/Controllers/V1/NotificationsController with authentication required
- [ ] Implement GET /api/v1/notifications with pagination and isRead filtering
- [ ] Implement GET /api/v1/notifications/unread-count
- [ ] Implement PATCH /api/v1/notifications/{id}/read
- [ ] Implement PATCH /api/v1/notifications/read-all
- [ ] Integrate SignalR OnNotificationReceived broadcasting to user-specific groups
- [ ] Create Infrastructure/BackgroundJobs/NotificationCleanupJob to archive old notifications (>90 days)

## Task 11: Implement Audit Logging System
Complete comprehensive audit trail for all administrative actions.
**Dependencies:** 10
- [ ] Create WebAPI/Filters/AuditActionFilter for automatic audit log creation
- [ ] Implement audit log capture for CUD operations with old/new values in JSON
- [ ] Capture user_id, action_type, entity_name, entity_id, ip_address, user_agent, timestamp
- [ ] Create Application/Features/AuditLogs: Queries (GetAuditLogs with filters), DTOs
- [ ] Create WebAPI/Controllers/V1/AuditLogsController with RequireSuperAdminRole
- [ ] Implement GET /api/v1/audit-logs with filtering (userId, actionType, entityName, dateRange) and pagination
- [ ] Integrate with Persistence/Interceptors/AuditableEntityInterceptor for automatic CreatedBy/UpdatedAt

## Task 12: Implement Analytics and Reporting
Build analytics dashboard and report generation capabilities.
**Dependencies:** 8
- [ ] Create Application/Features/Analytics: Queries (GetOccupancyTrends, GetZonePerformance, GetPeakHours, ExportReport), DTOs
- [ ] Implement occupancy trend calculation by hour-of-day and day-of-week from SlotStatusHistory
- [ ] Implement zone performance metrics (average occupancy %, peak hours, average stay duration)
- [ ] Implement peak hours identification per zone
- [ ] Create Infrastructure/Services/ReportGenerationService for PDF/Excel export
- [ ] Create WebAPI/Controllers/V1/AnalyticsController with RequireAdminRole
- [ ] Implement GET /api/v1/analytics/occupancy-trends
- [ ] Implement GET /api/v1/analytics/zone-performance
- [ ] Implement GET /api/v1/analytics/peak-hours
- [ ] Implement POST /api/v1/analytics/reports/export with file download

## Task 13: Implement User Management (SuperAdmin)
Enable SuperAdmin to manage user accounts, roles, and activation.
**Dependencies:** 4
- [ ] Create Application/Features/Users: Commands (Create, UpdateRole, Activate, Deactivate), Queries (GetAll with filters, GetById), DTOs, Validators
- [ ] Implement temporary password generation for new users
- [ ] Implement password change requirement on first login
- [ ] Implement refresh token revocation on user deactivation
- [ ] Create WebAPI/Controllers/V1/UsersController with RequireSuperAdminRole
- [ ] Implement GET /api/v1/users with filtering (role, isActive) and pagination
- [ ] Implement POST /api/v1/users with user creation and email notification
- [ ] Implement PATCH /api/v1/users/{userId}/activate
- [ ] Implement PATCH /api/v1/users/{userId}/deactivate
- [ ] Implement PATCH /api/v1/users/{userId}/role
- [ ] Add validation to prevent deletion of last SuperAdmin account

## Task 14: Implement System Settings Management
Enable SuperAdmin to manage global system configuration.
**Dependencies:** 13
- [ ] Create Application/Features/Settings: Commands (UpdateSetting), Queries (GetAllSettings, GetSettingByKey), DTOs
- [ ] Implement default settings: MallOpeningTime, MallClosingTime, PredictionWeightTrend, PredictionWeightHistorical, MaxPredictionHours
- [ ] Implement setting value validation by data type
- [ ] Implement setting caching with 5-minute refresh
- [ ] Create WebAPI/Controllers/V1/SettingsController with RequireSuperAdminRole
- [ ] Implement GET /api/v1/settings
- [ ] Implement GET /api/v1/settings/{key}
- [ ] Implement PUT /api/v1/settings/{key}
- [ ] Integrate settings into prediction engine and business logic

## Task 15: Implement Public API Endpoints
Create public endpoints for Guest visitors to view parking availability.
**Dependencies:** 8
- [ ] Create Application/Features/Public: Queries (GetAreas, GetZones, GetSlots, GetOccupancy), DTOs
- [ ] Create WebAPI/Controllers/PublicController with no authentication
- [ ] Implement GET /api/v1/public/areas to list all parking areas
- [ ] Implement GET /api/v1/public/areas/{areaId}/zones to get zones
- [ ] Implement GET /api/v1/public/areas/{areaId}/slots with vehicleType filter
- [ ] Implement GET /api/v1/public/areas/{areaId}/zones/{zoneId}/slots
- [ ] Implement GET /api/v1/public/areas/{areaId}/occupancy for counter data
- [ ] Implement WebAPI/Middleware/RateLimitingMiddleware (60 requests/minute per IP)
- [ ] Configure CORS for public endpoints

## Task 16: Implement Exception Handling and Validation
Add global exception handling, validation middleware, and error responses.
**Dependencies:** 15
- [ ] Create WebAPI/Middleware/ExceptionHandlingMiddleware for global exception catching
- [ ] Implement Problem Details (RFC 7807) response format for errors
- [ ] Configure FluentValidation automatic validation in MediatR pipeline via ValidationBehavior
- [ ] Implement custom validation rules: email (RFC 5322), hex color (#RRGGBB), coordinates (0-1000), slot number pattern
- [ ] Add structured logging with Serilog (console + file + Application Insights)
- [ ] Configure LoggingBehavior to log all MediatR requests/responses
- [ ] Configure PerformanceBehavior to warn on requests >500ms
- [ ] Create WebAPI/Filters/ApiExceptionFilterAttribute for controller-level exception handling

## Task 17: Add Database Migrations and Complete Seed Data
Create EF Core migrations and seed production-ready data.
**Dependencies:** 16
- [ ] Run `dotnet ef migrations add CompleteSchema` from Infrastructure project
- [ ] Update ApplicationDbContextSeed with default SuperAdmin user (username: admin, secure password)
- [ ] Seed initial ParkingArea: "Ayala Malls Abreeza Ground Floor"
- [ ] Seed 4 zones: Zone A (#3B82F6), Zone B (#10B981), Zone C (#F59E0B), Zone D (#EF4444)
- [ ] Seed 145 parking slots with realistic coordinates
- [ ] Seed default system settings
- [ ] Configure automatic migration application in Development environment
- [ ] Run `dotnet ef database update` to apply migrations
- [ ] Verify seed data in SQL Server

## Task 18: Add Background Jobs with Hangfire
Set up Hangfire for scheduled background tasks.
**Dependencies:** 17
- [ ] Install Hangfire NuGet packages (Hangfire.Core, Hangfire.SqlServer, Hangfire.AspNetCore)
- [ ] Configure Hangfire with SQL Server storage in Program.cs
- [ ] Create Infrastructure/BackgroundJobs/PredictionCacheRefreshJob (runs every 5 minutes)
- [ ] Create Infrastructure/BackgroundJobs/NotificationCleanupJob (runs daily at 2 AM)
- [ ] Register background jobs in Hangfire
- [ ] Add Hangfire dashboard at /hangfire with SuperAdmin authorization
- [ ] Configure job retry policies and logging

## Task 19: Add Health Checks and Monitoring
Implement health check endpoints and application monitoring.
**Dependencies:** 18
- [ ] Install Microsoft.Extensions.Diagnostics.HealthChecks NuGet packages
- [ ] Configure health checks for: DbContext, SQL Server, Redis (if used), SignalR
- [ ] Add GET /health endpoint for basic health status
- [ ] Add GET /health/ready for Kubernetes readiness probe
- [ ] Add GET /health/live for Kubernetes liveness probe
- [ ] Configure Application Insights for monitoring (optional)
- [ ] Add custom health check for prediction engine availability
- [ ] Configure health check UI dashboard (optional)

## Task 20: Implement Caching Strategy
Add comprehensive caching for performance optimization.
**Dependencies:** 19
- [ ] Install StackExchange.Redis NuGet package for distributed caching
- [ ] Configure IDistributedCache (Redis) in Program.cs
- [ ] Configure IMemoryCache for local caching
- [ ] Implement CacheService with cache-aside pattern
- [ ] Add prediction caching with 5-minute expiration
- [ ] Add zone/slot configuration caching with 30-minute expiration
- [ ] Add system settings caching with 5-minute expiration
- [ ] Implement cache invalidation on entity updates
- [ ] Add cache statistics endpoint for monitoring (Admin+)

## Task 21: Complete API Documentation with Swagger
Enhance Swagger/OpenAPI documentation for all endpoints.
**Dependencies:** 20
- [ ] Configure Swagger with JWT bearer token support
- [ ] Add XML documentation comments to all controllers and DTOs
- [ ] Configure Swagger to show authorization requirements per endpoint
- [ ] Add example request/response bodies for all endpoints
- [ ] Group endpoints by feature
- [ ] Add API versioning display (v1)
- [ ] Configure Swagger UI customization (logo, title, description)
- [ ] Add security scheme documentation

## Task 22: Backend Integration Testing and Verification
Verify all backend functionality works correctly end-to-end.
**Dependencies:** 21
- [ ] Test authentication: login, token refresh, logout, change password
- [ ] Test parking infrastructure CRUD: create/update/delete parking areas, zones, slots
- [ ] Test slot status updates and status history tracking
- [ ] Test SignalR connection and real-time broadcasting
- [ ] Test prediction engine with various time windows
- [ ] Test incident management workflow
- [ ] Test notification creation and delivery
- [ ] Test audit log creation for all CUD operations
- [ ] Test user management
- [ ] Test system settings management
- [ ] Test public endpoints without authentication
- [ ] Test rate limiting on public endpoints
- [ ] Test analytics queries and report generation
- [ ] Verify all authorization policies work correctly
- [ ] Test background jobs execution
- [ ] Test health check endpoints

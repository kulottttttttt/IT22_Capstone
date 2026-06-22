# Requirements Document

## Introduction

The Smart Parking Management System for Ayala Malls Abreeza is a real-time web-based platform that provides parking slot monitoring, predictive occupancy analytics, incident management, and comprehensive management capabilities for ground-floor parking operations. The system addresses urban parking congestion by offering real-time visibility and forward-looking forecasts for availability across multiple parking zones, enabling shoppers to plan their visits effectively while providing mall management with actionable insights, operational control, and incident tracking capabilities. The architecture supports multi-location expansion while the current deployment focuses on the Ayala Malls Abreeza Ground Floor parking area.

## Glossary

- **System**: The Smart Parking Management System web application
- **Authentication_Service**: The JWT-based authentication and authorization subsystem
- **Parking_Infrastructure_Manager**: The subsystem managing parking areas, zones, and parking slots configuration
- **Real_Time_Monitor**: The SignalR-based subsystem broadcasting live slot status updates
- **Prediction_Engine**: The rule-based analytics engine forecasting future occupancy
- **Map_Visualizer**: The SVG-based interactive parking layout rendering component
- **Analytics_Engine**: The subsystem generating reports and trend analysis
- **Audit_System**: The subsystem tracking all administrative actions and changes
- **Incident_Manager**: The subsystem managing parking incident reports and resolution tracking
- **Notification_Service**: The subsystem delivering real-time and stored notifications to authenticated users
- **Guest**: A public, anonymous visitor accessing the system without authentication or account
- **Staff**: An authenticated user with permissions to update slot statuses and report incidents
- **Admin**: An authenticated user with permissions to configure zones and slots
- **SuperAdmin**: An authenticated user with full system access including user management
- **Parking_Area**: A physical location containing multiple zones (e.g., "Ayala Malls Abreeza Ground Floor")
- **Zone**: A geographic section within a parking area (e.g., Zone A, Zone B)
- **Parking_Slot**: An individual parking space for a vehicle (car or motorcycle)
- **Slot_Status**: The current state of a parking slot (Available, Occupied, Maintenance)
- **Parking_Incident**: A reported issue related to parking operations requiring staff attention
- **Incident_Type**: Category of incident (Blocked_Slot, Maintenance_Issue, Unauthorized_Parking, Sensor_Failure, Safety_Concern)
- **Incident_Status**: Current state of incident resolution (Open, In_Progress, Resolved, Closed)
- **Notification**: A system-generated alert delivered to authenticated users
- **Occupancy_Forecast**: A prediction of parking availability for a future time window
- **Status_History**: The historical record of all slot status transitions
- **Refresh_Token**: A long-lived token used to obtain new access tokens
- **Access_Token**: A short-lived JWT token authorizing API requests
- **Audit_Log**: A record of an administrative action with full context


## Requirements

### Requirement 1: User Authentication with JWT

**User Story:** As a Staff member, I want to securely log in to the system, so that I can access protected features and manage parking operations.

#### Acceptance Criteria

1. WHEN a user submits valid credentials, THE Authentication_Service SHALL return an access token with 15 minute expiration
2. WHEN a user submits valid credentials, THE Authentication_Service SHALL return a refresh token with 7 day expiration
3. WHEN a user submits invalid credentials, THE Authentication_Service SHALL return an authentication error within 200 milliseconds
4. WHEN an access token expires, THE Authentication_Service SHALL accept a valid refresh token to generate a new access token
5. WHEN a refresh token is used, THE Authentication_Service SHALL invalidate the old refresh token and issue a new one
6. THE Authentication_Service SHALL hash all passwords using BCrypt with work factor of 12
7. THE Authentication_Service SHALL store refresh tokens in HttpOnly secure cookies to prevent XSS attacks
8. WHEN a user logs out, THE Authentication_Service SHALL revoke all associated refresh tokens

### Requirement 2: Role-Based Access Control

**User Story:** As a SuperAdmin, I want to assign different permission levels to authenticated users, so that access to system features is properly controlled based on user roles.

#### Acceptance Criteria

1. THE System SHALL support exactly three authenticated user roles stored in the database: SuperAdmin, Admin, and Staff
2. WHEN a Guest (anonymous visitor) accesses public endpoints, THE System SHALL allow access without authentication or account creation
3. WHEN a Staff user attempts to access zone configuration endpoints, THE System SHALL deny access with 403 Forbidden status
4. WHEN an Admin user attempts to access user management endpoints, THE System SHALL deny access with 403 Forbidden status
5. WHEN a SuperAdmin user attempts to access any endpoint, THE System SHALL allow access
6. THE System SHALL evaluate role permissions on every protected API request
7. THE System SHALL include user role information in the JWT access token claims
8. THE System SHALL NOT store Guest as a database role or user account type


### Requirement 3: Parking Area Management

**User Story:** As an Admin, I want to create and manage parking areas, so that the system can support multiple physical locations while maintaining the current single-location deployment.

#### Acceptance Criteria

1. WHEN an Admin creates a parking area, THE Parking_Infrastructure_Manager SHALL assign a unique identifier to the parking area
2. WHEN an Admin creates a parking area, THE Parking_Infrastructure_Manager SHALL require a name between 1 and 100 characters
3. WHEN an Admin creates a parking area, THE Parking_Infrastructure_Manager SHALL require a physical address
4. WHEN an Admin creates a parking area, THE Parking_Infrastructure_Manager SHALL record total capacity as the sum of all slots
5. THE Parking_Infrastructure_Manager SHALL initialize the system with default parking area "Ayala Malls Abreeza Ground Floor"
6. WHEN an Admin updates a parking area, THE Parking_Infrastructure_Manager SHALL preserve the parking area identifier
7. WHEN an Admin deletes a parking area, THE Parking_Infrastructure_Manager SHALL perform a soft delete by setting is_deleted flag to true
8. WHEN an Admin deletes a parking area with zones, THE Parking_Infrastructure_Manager SHALL cascade soft delete to all associated zones and slots
9. THE Parking_Infrastructure_Manager SHALL record all parking area modifications in the Audit_System
10. THE Parking_Infrastructure_Manager SHALL support a description field for additional parking area information

### Requirement 4: Zone Management

**User Story:** As an Admin, I want to create and configure parking zones within a parking area, so that each location is organized into manageable sections with visual distinction.

#### Acceptance Criteria

1. WHEN an Admin creates a zone, THE Parking_Infrastructure_Manager SHALL assign a unique identifier to the zone
2. WHEN an Admin creates a zone, THE Parking_Infrastructure_Manager SHALL require a zone name between 1 and 50 characters
3. WHEN an Admin creates a zone, THE Parking_Infrastructure_Manager SHALL require a valid parking area identifier as foreign key
4. WHEN an Admin creates a zone, THE Parking_Infrastructure_Manager SHALL require a valid hex color code for map visualization
5. WHEN an Admin updates a zone, THE Parking_Infrastructure_Manager SHALL preserve the zone identifier
6. WHEN an Admin deletes a zone, THE Parking_Infrastructure_Manager SHALL perform a soft delete by setting is_deleted flag to true
7. WHEN an Admin deletes a zone with active parking slots, THE Parking_Infrastructure_Manager SHALL also soft delete all associated slots
8. THE Parking_Infrastructure_Manager SHALL record all zone modifications in the Audit_System
9. THE Parking_Infrastructure_Manager SHALL support a sort_order property for zone display ordering
10. THE Parking_Infrastructure_Manager SHALL scope all zone queries by parking_area_id

### Requirement 5: Parking Slot Configuration

**User Story:** As an Admin, I want to create and position parking slots within zones, so that the system accurately represents the physical parking layout.

#### Acceptance Criteria

1. WHEN an Admin creates a parking slot, THE Parking_Infrastructure_Manager SHALL assign a unique slot number within the format {ZoneLetter}-{ThreeDigitNumber}
2. WHEN an Admin creates a parking slot, THE Parking_Infrastructure_Manager SHALL require a valid zone identifier
3. WHEN an Admin creates a parking slot, THE Parking_Infrastructure_Manager SHALL require a vehicle type of either Car or Motorcycle
4. WHEN an Admin creates a parking slot, THE Parking_Infrastructure_Manager SHALL require X and Y coordinates as decimal values between 0 and 1000
5. WHEN an Admin updates slot coordinates, THE Parking_Infrastructure_Manager SHALL validate that coordinates do not overlap with existing slots within 5 unit radius
6. THE Parking_Infrastructure_Manager SHALL initialize new slots with Available status
7. THE Parking_Infrastructure_Manager SHALL support a is_sensor_enabled flag for future IoT integration
8. WHEN an Admin deletes a parking slot, THE Parking_Infrastructure_Manager SHALL perform a soft delete to preserve historical data


### Requirement 6: Real-Time Slot Status Updates

**User Story:** As a Staff member, I want to manually update parking slot status, so that the system reflects current parking conditions when sensors are not available.

#### Acceptance Criteria

1. WHEN a Staff user updates a slot status, THE Real_Time_Monitor SHALL validate the new status is one of: Available, Occupied, or Maintenance
2. WHEN a Staff user updates a slot status, THE Real_Time_Monitor SHALL record the status change timestamp in UTC
3. WHEN a slot status changes, THE Real_Time_Monitor SHALL create a new entry in Status_History with start_time
4. WHEN a slot status changes, THE Real_Time_Monitor SHALL update the previous Status_History entry with end_time and calculate duration_minutes
5. WHEN a slot status changes, THE Real_Time_Monitor SHALL broadcast the update to all connected clients via SignalR within 100 milliseconds
6. WHEN a slot transitions from Occupied to Available, THE Real_Time_Monitor SHALL calculate and store the occupancy duration
7. THE Real_Time_Monitor SHALL reject status updates from anonymous Guest visitors with 401 Unauthorized status
8. THE Real_Time_Monitor SHALL log all manual status updates in the Audit_System with user identifier and timestamp

### Requirement 7: SignalR Real-Time Broadcasting

**User Story:** As a Guest, I want to see parking availability updates instantly on the map, so that I can make informed decisions about where to park.

#### Acceptance Criteria

1. WHEN a client connects to the real-time hub, THE Real_Time_Monitor SHALL establish a WebSocket connection
2. WHEN a slot status changes, THE Real_Time_Monitor SHALL broadcast the update to all connected clients within 100 milliseconds
3. WHEN an anonymous Guest client connects, THE Real_Time_Monitor SHALL allow subscription to status update events without authentication
4. WHEN a Staff client attempts to broadcast status updates, THE Real_Time_Monitor SHALL validate the user has Staff role or higher
5. WHEN a WebSocket connection fails, THE Real_Time_Monitor SHALL fall back to long polling transport
6. THE Real_Time_Monitor SHALL broadcast updates containing slot_id, new_status, zone_id, parking_area_id, and timestamp
7. THE Real_Time_Monitor SHALL support broadcasting zone-level aggregate updates for occupancy counters
8. THE Real_Time_Monitor SHALL maintain connection state and automatically reconnect clients after network interruptions


### Requirement 8: Predictive Occupancy Analytics Engine

**User Story:** As a Guest, I want to see predicted parking availability for the next 2 hours, so that I can plan my arrival time to find available parking.

#### Acceptance Criteria

1. WHEN a prediction is requested for a parking area, THE Prediction_Engine SHALL generate forecasts for 30 minutes, 60 minutes, and 120 minutes into the future
2. WHEN calculating predictions, THE Prediction_Engine SHALL compute historical baseline from day-of-week and hour-of-day occupancy averages scoped to the parking area
3. WHEN calculating predictions, THE Prediction_Engine SHALL analyze current trend momentum from the last 15 minutes of status changes
4. WHEN calculating predictions, THE Prediction_Engine SHALL apply event modifiers for weekends and peak hours
5. WHEN calculating predictions, THE Prediction_Engine SHALL weight historical baseline at 60 percent and current trend at 40 percent
6. THE Prediction_Engine SHALL generate separate predictions for car slots and motorcycle slots within each zone
7. THE Prediction_Engine SHALL store prediction snapshots in the database with calculation timestamp, parking_area_id, and basis metadata
8. WHEN insufficient historical data exists, THE Prediction_Engine SHALL return predictions based solely on current occupancy with a confidence flag set to low
9. THE Prediction_Engine SHALL calculate predictions for all zones within a parking area within 500 milliseconds
10. THE Prediction_Engine SHALL include predicted occupancy count and percentage in each forecast
11. THE Prediction_Engine SHALL support per-parking-area prediction aggregation for future multi-location deployments

### Requirement 9: Historical Data Collection for Analytics

**User Story:** As the System, I want to record all slot status transitions with precise timestamps, so that the Prediction_Engine has accurate historical data for forecasting.

#### Acceptance Criteria

1. WHEN a slot status changes, THE System SHALL create a Status_History record with slot_id, status, and start_time
2. WHEN a new status change occurs for a slot, THE System SHALL update the previous Status_History record's end_time
3. WHEN updating end_time, THE System SHALL calculate and store duration_minutes as the difference between start_time and end_time
4. THE System SHALL store all timestamps in UTC timezone
5. THE System SHALL preserve Status_History records indefinitely for analytics purposes
6. THE System SHALL index Status_History by slot_id and start_time for efficient query performance
7. WHEN exporting historical data, THE System SHALL support filtering by date range, zone, and vehicle type
8. THE System SHALL aggregate historical data by day-of-week and hour-of-day for baseline calculations


### Requirement 10: Interactive SVG Map Visualization

**User Story:** As a Guest, I want to view an interactive map of parking zones and slots, so that I can see the spatial layout and current availability at a glance.

#### Acceptance Criteria

1. WHEN a user loads the map, THE Map_Visualizer SHALL render all zones using their configured hex colors
2. WHEN a user loads the map, THE Map_Visualizer SHALL position all slots using their X and Y coordinates
3. THE Map_Visualizer SHALL render Available slots in emerald green (#10B981)
4. THE Map_Visualizer SHALL render Occupied slots in rose red (#F43F5E)
5. THE Map_Visualizer SHALL render Maintenance slots in amber (#F59E0B)
6. WHEN a user hovers over a slot, THE Map_Visualizer SHALL display a tooltip containing slot number and vehicle type
7. WHEN a slot status update is received via SignalR, THE Map_Visualizer SHALL update the slot color within 50 milliseconds
8. THE Map_Visualizer SHALL support zoom controls for detailed viewing
9. THE Map_Visualizer SHALL support zone filtering to show only selected zones
10. THE Map_Visualizer SHALL support parking area selection for multi-location future deployment
11. WHEN a Staff user clicks a slot, THE Map_Visualizer SHALL open a status update menu

### Requirement 11: Predictive Map Visualization with Time Scrubbing

**User Story:** As a Guest, I want to scrub through future time windows on the map, so that I can visualize predicted parking availability at different times.

#### Acceptance Criteria

1. WHEN a user loads the map, THE Map_Visualizer SHALL display a time scrubber control with current time and three future markers
2. THE Map_Visualizer SHALL mark future time windows at +30 minutes, +60 minutes, and +120 minutes
3. WHEN a user selects a future time marker, THE Map_Visualizer SHALL request predictions for that time window
4. WHEN predictions are received, THE Map_Visualizer SHALL render slots with predicted likelihood indicators
5. THE Map_Visualizer SHALL render slots likely to become available with a glowing green border animation
6. THE Map_Visualizer SHALL render slots likely to remain occupied with standard occupied styling
7. WHEN switching between time windows, THE Map_Visualizer SHALL transition within 200 milliseconds
8. THE Map_Visualizer SHALL display a timestamp label showing the currently selected time window
9. WHEN returning to current time, THE Map_Visualizer SHALL revert to real-time status display


### Requirement 12: Occupancy Trend Analytics

**User Story:** As an Admin, I want to view occupancy trends over time, so that I can identify peak hours and optimize parking management strategies.

#### Acceptance Criteria

1. WHEN an Admin requests trend analysis, THE Analytics_Engine SHALL generate occupancy charts for the last 7 days
2. WHEN an Admin requests trend analysis, THE Analytics_Engine SHALL identify peak occupancy hours for each zone
3. THE Analytics_Engine SHALL calculate average occupancy percentage by hour-of-day across all zones
4. THE Analytics_Engine SHALL calculate average occupancy percentage by day-of-week across all zones
5. THE Analytics_Engine SHALL generate zone comparison heatmaps showing which zones fill fastest
6. THE Analytics_Engine SHALL calculate average stay duration for car slots and motorcycle slots separately
7. WHEN generating reports, THE Analytics_Engine SHALL support date range filtering from 1 day to 365 days
8. THE Analytics_Engine SHALL visualize trends using line charts with zone-colored lines
9. THE Analytics_Engine SHALL render heatmaps with color intensity indicating occupancy percentage

### Requirement 13: Report Generation and Export

**User Story:** As an Admin, I want to export occupancy reports to PDF and Excel, so that I can share parking analytics with mall management stakeholders.

#### Acceptance Criteria

1. WHEN an Admin requests a report export, THE Analytics_Engine SHALL generate a report containing zone summaries and trend charts
2. THE Analytics_Engine SHALL support PDF export with embedded charts and formatted tables
3. THE Analytics_Engine SHALL support Excel export with raw data in separate worksheets per zone
4. WHEN exporting to Excel, THE Analytics_Engine SHALL include a summary worksheet with aggregated statistics
5. THE Analytics_Engine SHALL include report generation timestamp and date range in the document header
6. THE Analytics_Engine SHALL include the following metrics: total slots, average occupancy, peak hours, and average stay duration
7. THE Analytics_Engine SHALL complete report generation within 3 seconds for 30-day date ranges
8. THE Analytics_Engine SHALL log all report generations in the Audit_System with user identifier


### Requirement 14: Comprehensive Audit Logging

**User Story:** As a SuperAdmin, I want to review all administrative actions taken in the system, so that I can ensure accountability and investigate issues.

#### Acceptance Criteria

1. WHEN a user performs an administrative action, THE Audit_System SHALL create an audit log record within 10 milliseconds
2. THE Audit_System SHALL record the user identifier, action type, entity name, and entity identifier
3. THE Audit_System SHALL capture old values and new values for update operations in JSON format
4. THE Audit_System SHALL record the timestamp in UTC, IP address, and user agent string
5. THE Audit_System SHALL log the following action types: Create, Update, Delete, StatusChange, Login, Logout, ConfigurationChange
6. THE Audit_System SHALL preserve audit logs indefinitely without soft delete capability
7. WHEN a SuperAdmin queries audit logs, THE Audit_System SHALL support filtering by user, action type, entity, and date range
8. THE Audit_System SHALL support pagination with 50 records per page for audit log viewing

### Requirement 15: User Management and Invitation

**User Story:** As a SuperAdmin, I want to invite new users and assign roles, so that I can control who has access to the system and their permission levels.

#### Acceptance Criteria

1. WHEN a SuperAdmin invites a user, THE System SHALL create a user account with is_active set to false
2. WHEN a SuperAdmin invites a user, THE System SHALL require a valid email address and username between 3 and 50 characters
3. WHEN a SuperAdmin invites a user, THE System SHALL assign a role of Staff, Admin, or SuperAdmin
4. WHEN a SuperAdmin creates a user, THE System SHALL generate a temporary password and send it via email
5. WHEN a new user first logs in, THE System SHALL require a password change
6. WHEN a SuperAdmin activates a user, THE System SHALL set is_active to true
7. WHEN a SuperAdmin deactivates a user, THE System SHALL set is_active to false and revoke all refresh tokens
8. THE System SHALL prevent deletion of the last remaining SuperAdmin account
9. THE System SHALL log all user management actions in the Audit_System


### Requirement 16: System Settings Management

**User Story:** As a SuperAdmin, I want to configure global system settings, so that I can customize system behavior without code changes.

#### Acceptance Criteria

1. THE System SHALL support configurable settings stored as key-value pairs
2. THE System SHALL support the following setting keys: MallOpeningTime, MallClosingTime, PredictionWeightTrend, PredictionWeightHistorical, MaxPredictionHours
3. WHEN a SuperAdmin updates a setting, THE System SHALL validate the value format matches the expected data type
4. WHEN a SuperAdmin updates a setting, THE System SHALL log the change in the Audit_System
5. THE System SHALL load settings from the database on application startup
6. THE System SHALL cache settings in memory and refresh every 5 minutes
7. WHEN a setting is not found, THE System SHALL return a default value
8. THE System SHALL support setting descriptions for administrative guidance

### Requirement 17: API Rate Limiting for Public Endpoints

**User Story:** As a System Administrator, I want to limit the request rate from public endpoints, so that the system is protected from scraping and abuse.

#### Acceptance Criteria

1. THE System SHALL limit public endpoint requests to 60 requests per minute per IP address
2. WHEN a client exceeds the rate limit, THE System SHALL return 429 Too Many Requests status
3. WHEN returning 429 status, THE System SHALL include Retry-After header with seconds until reset
4. THE System SHALL reset rate limit counters every 60 seconds
5. THE System SHALL exclude authenticated requests from public endpoint rate limiting
6. THE System SHALL apply rate limiting using a sliding window algorithm
7. THE System SHALL log rate limit violations with IP address and endpoint path
8. WHERE rate limiting is disabled in configuration, THE System SHALL bypass rate limit checks


### Requirement 18: Input Validation and Error Handling

**User Story:** As a developer, I want all user inputs to be validated with clear error messages, so that invalid data cannot enter the system and users receive helpful feedback.

#### Acceptance Criteria

1. THE System SHALL validate all API request inputs using FluentValidation before processing
2. WHEN validation fails, THE System SHALL return 400 Bad Request status with detailed error messages
3. THE System SHALL validate email addresses conform to RFC 5322 standard
4. THE System SHALL validate hex color codes match the pattern #[0-9A-Fa-f]{6}
5. THE System SHALL validate coordinate values are decimal numbers between 0 and 1000
6. THE System SHALL validate slot numbers match the pattern {Letter}-{ThreeDigits}
7. WHEN an unhandled exception occurs, THE System SHALL return 500 Internal Server Error with a generic message
8. WHEN an unhandled exception occurs, THE System SHALL log the full stack trace for debugging
9. THE System SHALL validate all required fields are present before processing requests
10. THE System SHALL validate string lengths do not exceed defined maximum values

### Requirement 19: CORS Configuration for Frontend Integration

**User Story:** As a frontend developer, I want the API to accept requests from the official web domain, so that the React application can communicate with the backend.

#### Acceptance Criteria

1. THE System SHALL configure CORS to allow requests from the production web domain
2. THE System SHALL configure CORS to allow requests from localhost:5173 in development environment
3. THE System SHALL allow the following HTTP methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
4. THE System SHALL allow the following headers: Authorization, Content-Type, Accept
5. THE System SHALL expose the following headers to clients: Content-Type, X-Pagination
6. THE System SHALL allow credentials (cookies) to be sent with cross-origin requests
7. THE System SHALL reject requests from origins not in the allowed list with 403 Forbidden status
8. WHERE the environment is development, THE System SHALL allow all origins


### Requirement 20: Database Migration and Seed Data Management

**User Story:** As a developer, I want automated database schema management and seed data, so that the system can be deployed consistently across environments.

#### Acceptance Criteria

1. THE System SHALL use Entity Framework Core migrations for all schema changes
2. WHEN the application starts, THE System SHALL apply pending migrations automatically in development environment
3. THE System SHALL require manual migration execution in production environment
4. THE System SHALL seed initial SuperAdmin account with username "admin" and secure default password
5. THE System SHALL seed sample zones (Zone A, Zone B, Zone C, Zone D) with distinct colors in development environment
6. THE System SHALL seed sample parking slots in development environment for testing
7. THE System SHALL use sequential Guid generation for primary keys to optimize database performance
8. THE System SHALL configure all datetime columns to store UTC timestamps

### Requirement 21: Responsive Frontend Layout

**User Story:** As a Guest using a mobile device, I want the parking map to adapt to my screen size, so that I can view parking availability on any device.

#### Acceptance Criteria

1. THE System SHALL render the user interface responsively for screen widths from 320px to 3840px
2. WHEN viewed on mobile devices, THE System SHALL display a simplified list view alongside the map
3. WHEN viewed on mobile devices, THE System SHALL collapse the sidebar navigation into a hamburger menu
4. THE System SHALL support touch gestures for map zoom and pan on mobile devices
5. THE System SHALL use TailwindCSS responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
6. WHEN viewed on tablet devices, THE System SHALL display the map and zone selector side by side
7. THE System SHALL optimize SVG rendering performance for mobile devices by simplifying slot rendering
8. THE System SHALL maintain readable text sizes with minimum 14px font on mobile devices


### Requirement 22: Performance Optimization and Caching

**User Story:** As a Guest, I want the parking map to load quickly and update smoothly, so that I can get parking information without delays.

#### Acceptance Criteria

1. WHEN a user loads the map, THE System SHALL return initial slot data within 500 milliseconds
2. THE System SHALL cache zone configuration data in memory for 30 minutes
3. THE System SHALL cache prediction snapshots for 5 minutes to reduce database queries
4. THE System SHALL implement database query result caching for frequently accessed historical data
5. THE System SHALL use database indexes on slot_id, zone_id, and start_time columns
6. THE System SHALL paginate large result sets with maximum 100 records per page
7. THE System SHALL compress API responses using gzip for responses larger than 1KB
8. THE System SHALL implement lazy loading for historical analytics data beyond 30 days

### Requirement 23: Real-Time Dashboard Counters

**User Story:** As a Guest, I want to see large prominent counters showing total available slots, so that I can quickly assess parking availability without studying the map.

#### Acceptance Criteria

1. WHEN a user loads the dashboard, THE System SHALL display total available car slots across all zones
2. WHEN a user loads the dashboard, THE System SHALL display total available motorcycle slots across all zones
3. WHEN a slot status changes, THE System SHALL update the dashboard counters via SignalR within 100 milliseconds
4. THE System SHALL display separate counters for each zone showing available slots
5. THE System SHALL calculate counter values from current slot statuses, excluding Maintenance slots
6. THE System SHALL display counters with large, readable font size of at least 48px
7. THE System SHALL use color coding: green for high availability (>50%), amber for medium (20-50%), red for low (<20%)
8. THE System SHALL animate counter value changes with a smooth transition effect


### Requirement 24: Staff Activity Feed

**User Story:** As a Staff member, I want to see a live feed of parking status changes, so that I can monitor parking operations in real time.

#### Acceptance Criteria

1. WHEN a Staff user views the dashboard, THE System SHALL display an activity feed showing the 20 most recent status changes
2. WHEN a slot status changes, THE System SHALL add the change to the activity feed via SignalR within 100 milliseconds
3. THE System SHALL display activity entries with slot number, old status, new status, and timestamp
4. THE System SHALL display relative timestamps (e.g., "2 minutes ago") for entries within the last hour
5. THE System SHALL auto-scroll the activity feed to show the newest entry at the top
6. THE System SHALL limit the activity feed to 50 entries in memory to prevent performance degradation
7. THE System SHALL color-code activity entries by status change type for quick visual scanning
8. WHEN a Staff user clicks an activity entry, THE System SHALL highlight the corresponding slot on the map

### Requirement 25: Map Configurator for Slot Positioning

**User Story:** As an Admin, I want to drag and drop parking slots on a canvas to define their map positions, so that the visual layout matches the physical parking area.

#### Acceptance Criteria

1. WHEN an Admin opens the map configurator, THE System SHALL display all slots at their current X and Y coordinates
2. WHEN an Admin drags a slot, THE System SHALL update its position in real time
3. WHEN an Admin releases a slot, THE System SHALL save the new X and Y coordinates to the database
4. THE System SHALL validate that slot positions remain within the canvas bounds (0-1000 for both X and Y)
5. THE System SHALL display a grid overlay with 50-unit spacing to assist with alignment
6. THE System SHALL support multi-select to move multiple slots together while maintaining their relative positions
7. THE System SHALL provide snap-to-grid functionality that can be toggled on or off
8. THE System SHALL display zone boundaries as colored regions to help with slot placement
9. THE System SHALL log all coordinate changes in the Audit_System


### Requirement 26: Session Management and Timeout

**User Story:** As a security-conscious system, I want to automatically expire inactive user sessions, so that unauthorized access is prevented when users leave their workstations.

#### Acceptance Criteria

1. WHEN a user is inactive for 30 minutes, THE System SHALL expire the access token
2. WHEN an access token expires during an API request, THE System SHALL return 401 Unauthorized status
3. WHEN the frontend receives 401 status, THE System SHALL attempt to refresh the access token using the refresh token
4. WHEN a refresh token is expired or invalid, THE System SHALL redirect the user to the login page
5. THE System SHALL track the last activity timestamp for each authenticated session
6. WHEN a user performs any API action, THE System SHALL update the last activity timestamp
7. THE System SHALL provide a "Remember Me" option that extends refresh token expiration to 30 days
8. THE System SHALL display a warning notification 2 minutes before session timeout

### Requirement 27: Error Boundary and Graceful Degradation

**User Story:** As a Guest, I want the application to handle errors gracefully without crashing the entire interface, so that I can continue using available features even when problems occur.

#### Acceptance Criteria

1. WHEN a React component throws an error, THE System SHALL catch the error using an error boundary
2. WHEN an error is caught, THE System SHALL display a user-friendly error message instead of crashing the application
3. WHEN a SignalR connection fails, THE System SHALL display a warning notification and attempt to reconnect every 5 seconds
4. WHEN the API is unreachable, THE System SHALL display cached data with a staleness indicator
5. WHEN prediction data fails to load, THE System SHALL continue to display real-time slot status
6. THE System SHALL log all frontend errors to the browser console for debugging
7. THE System SHALL provide a "Reload" button in error states to allow users to retry
8. WHEN the map fails to render, THE System SHALL fall back to a list view of slots


### Requirement 28: Logging and Monitoring

**User Story:** As a system administrator, I want comprehensive application logging, so that I can troubleshoot issues and monitor system health.

#### Acceptance Criteria

1. THE System SHALL log all API requests with HTTP method, path, status code, and duration
2. THE System SHALL log all unhandled exceptions with full stack traces
3. THE System SHALL log database query performance metrics for queries exceeding 500 milliseconds
4. THE System SHALL implement structured logging using JSON format for log aggregation
5. THE System SHALL log at the following levels: Trace, Debug, Information, Warning, Error, Critical
6. THE System SHALL log SignalR connection events including connect, disconnect, and reconnect attempts
7. WHEN errors occur, THE System SHALL include correlation IDs to trace requests across service boundaries
8. THE System SHALL configure log retention for 90 days in production environment
9. THE System SHALL support log output to console, file, and external logging services

### Requirement 29: Configuration Management Across Environments

**User Story:** As a developer, I want environment-specific configuration, so that the system behaves appropriately in development, staging, and production environments.

#### Acceptance Criteria

1. THE System SHALL load configuration from appsettings.json and environment-specific appsettings.{Environment}.json files
2. THE System SHALL load sensitive configuration values from environment variables
3. THE System SHALL support the following environments: Development, Staging, Production
4. WHEN running in Development, THE System SHALL enable detailed error messages and CORS for all origins
5. WHEN running in Production, THE System SHALL enforce HTTPS-only connections
6. THE System SHALL validate required configuration values on startup and fail fast if missing
7. THE System SHALL support configuration for: Database connection string, JWT secret key, CORS origins, Rate limit settings
8. THE System SHALL log the current environment name on application startup


### Requirement 30: Data Integrity and Constraint Enforcement

**User Story:** As a database administrator, I want the database to enforce data integrity rules, so that invalid or inconsistent data cannot be stored.

#### Acceptance Criteria

1. THE System SHALL enforce unique constraints on user email addresses
2. THE System SHALL enforce unique constraints on user usernames
3. THE System SHALL enforce unique constraints on slot numbers within the entire system
4. THE System SHALL enforce foreign key constraints between slots and zones
5. THE System SHALL enforce check constraints ensuring coordinates are non-negative
6. THE System SHALL enforce check constraints ensuring duration_minutes is non-negative
7. THE System SHALL use database transactions for operations that modify multiple tables
8. WHEN a constraint violation occurs, THE System SHALL roll back the transaction and return a clear error message
9. THE System SHALL prevent deletion of zones that have non-deleted slots
10. THE System SHALL prevent setting a slot's zone_id to a non-existent zone

### Requirement 31: Search and Filter Capabilities

**User Story:** As an Admin, I want to search and filter parking slots, zones, and audit logs, so that I can quickly find specific information.

#### Acceptance Criteria

1. WHEN an Admin searches for slots, THE System SHALL support filtering by zone, vehicle type, and current status
2. WHEN an Admin searches for slots, THE System SHALL support text search on slot number with partial matching
3. WHEN an Admin searches audit logs, THE System SHALL support filtering by user, action type, date range, and entity type
4. THE System SHALL return search results within 300 milliseconds for datasets up to 10,000 records
5. THE System SHALL support sorting search results by multiple columns
6. THE System SHALL implement server-side pagination for search results with configurable page size
7. THE System SHALL return total record count along with paginated results
8. WHEN no results match the search criteria, THE System SHALL return an empty result set with appropriate status code


### Requirement 32: Parking Incident Reporting

**User Story:** As a Staff member, I want to report parking incidents, so that operational issues can be tracked and resolved systematically.

#### Acceptance Criteria

1. WHEN a Staff user creates an incident report, THE Incident_Manager SHALL assign a unique identifier to the incident
2. WHEN a Staff user creates an incident report, THE Incident_Manager SHALL require an incident type of: Blocked_Slot, Maintenance_Issue, Unauthorized_Parking, Sensor_Failure, or Safety_Concern
3. WHEN a Staff user creates an incident report, THE Incident_Manager SHALL require a severity level of: Low, Medium, High, or Critical
4. WHEN a Staff user creates an incident report, THE Incident_Manager SHALL require a description between 10 and 500 characters
5. WHEN a Staff user creates an incident report, THE Incident_Manager SHALL record the reporting user identifier and timestamp in UTC
6. WHEN a Staff user creates an incident report, THE Incident_Manager SHALL initialize the incident status to Open
7. WHEN an incident is related to a specific slot, THE Incident_Manager SHALL accept an optional slot_id as foreign key
8. WHEN an incident is related to a zone, THE Incident_Manager SHALL accept an optional zone_id as foreign key
9. THE Incident_Manager SHALL require a parking_area_id for all incident reports
10. THE Incident_Manager SHALL log all incident creation actions in the Audit_System

### Requirement 33: Parking Incident Management

**User Story:** As a Staff member, I want to update incident status and add resolution notes, so that the incident lifecycle is tracked from report to closure.

#### Acceptance Criteria

1. WHEN a Staff user updates an incident status, THE Incident_Manager SHALL validate the new status is one of: Open, In_Progress, Resolved, or Closed
2. WHEN a Staff user sets status to In_Progress, THE Incident_Manager SHALL record the current timestamp
3. WHEN a Staff user sets status to Resolved, THE Incident_Manager SHALL require resolution notes between 10 and 500 characters
4. WHEN a Staff user sets status to Resolved, THE Incident_Manager SHALL record the resolving user identifier and resolution timestamp
5. WHEN a Staff user sets status to Closed, THE Incident_Manager SHALL require prior status to be Resolved
6. THE Incident_Manager SHALL prevent status transitions from Closed to any other status
7. THE Incident_Manager SHALL log all incident status changes in the Audit_System
8. THE Incident_Manager SHALL broadcast incident status changes to authenticated users via SignalR within 100 milliseconds

### Requirement 34: Incident Query and Filtering

**User Story:** As an Admin, I want to view and filter parking incidents, so that I can monitor operational issues and identify patterns.

#### Acceptance Criteria

1. WHEN an Admin queries incidents, THE Incident_Manager SHALL support filtering by parking_area_id, zone_id, incident_type, severity, and status
2. WHEN an Admin queries incidents, THE Incident_Manager SHALL support date range filtering by reported_at timestamp
3. WHEN an Admin queries incidents, THE Incident_Manager SHALL support text search on description and resolution notes
4. THE Incident_Manager SHALL support sorting by severity (Critical, High, Medium, Low) and timestamp
5. THE Incident_Manager SHALL return incident data with related slot and zone information
6. THE Incident_Manager SHALL paginate incident results with maximum 50 records per page
7. THE Incident_Manager SHALL return total count of open incidents for dashboard display
8. THE Incident_Manager SHALL calculate average resolution time for closed incidents by incident type

### Requirement 35: Incident-Linked Maintenance Status

**User Story:** As a Staff member, I want to automatically set slots to Maintenance status when maintenance incidents are reported, so that parking operations reflect ongoing maintenance work.

#### Acceptance Criteria

1. WHEN a Staff user creates an incident with type Maintenance_Issue and provides a slot_id, THE Incident_Manager SHALL automatically update the slot status to Maintenance
2. WHEN a maintenance incident is resolved, THE Incident_Manager SHALL prompt the user to update the slot status back to Available
3. WHEN a slot is set to Maintenance status, THE Incident_Manager SHALL check for existing open maintenance incidents
4. THE Incident_Manager SHALL prevent closing maintenance incidents while the linked slot remains in Maintenance status
5. THE Incident_Manager SHALL log automatic slot status changes triggered by incidents in the Audit_System


### Requirement 36: Incident Dashboard Visualization

**User Story:** As an Admin, I want to see a dashboard of incident metrics, so that I can quickly assess operational health and prioritize issues.

#### Acceptance Criteria

1. WHEN an Admin views the incident dashboard, THE System SHALL display the count of open incidents by severity level
2. WHEN an Admin views the incident dashboard, THE System SHALL display the count of incidents by type for the current week
3. THE System SHALL display average resolution time for each incident type over the last 30 days
4. THE System SHALL highlight critical incidents that have been open for more than 2 hours
5. THE System SHALL display a trend chart showing incident creation rate over the last 7 days
6. THE System SHALL support drilling down from dashboard metrics to filtered incident lists
7. THE System SHALL update dashboard metrics in real-time when new incidents are created or resolved

### Requirement 37: System Notification Creation

**User Story:** As the System, I want to automatically create notifications for critical events, so that authenticated users are promptly informed of important changes.

#### Acceptance Criteria

1. WHEN a critical incident is created, THE Notification_Service SHALL create a notification for all SuperAdmin users
2. WHEN a slot is set to Maintenance status, THE Notification_Service SHALL create a notification for Admin and SuperAdmin users
3. WHEN a user is mentioned in incident notes, THE Notification_Service SHALL create a notification for that user
4. WHEN creating a notification, THE Notification_Service SHALL require a notification_type of: Incident_Alert, Maintenance_Alert, System_Notification, Prediction_Alert, or Sensor_Alert
5. WHEN creating a notification, THE Notification_Service SHALL require a severity level of: Info, Warning, or Error
6. THE Notification_Service SHALL record the related entity type and entity identifier for context linking
7. THE Notification_Service SHALL initialize notifications with is_read set to false
8. THE Notification_Service SHALL store notification creation timestamp in UTC


### Requirement 38: Real-Time Notification Delivery

**User Story:** As an authenticated user, I want to receive notifications in real-time via SignalR, so that I am immediately aware of events requiring my attention.

#### Acceptance Criteria

1. WHEN a notification is created for a user, THE Notification_Service SHALL broadcast the notification to that user via SignalR within 100 milliseconds
2. WHEN a user is connected via SignalR, THE Notification_Service SHALL deliver notifications only to the intended recipient
3. WHEN a user is not connected, THE Notification_Service SHALL store the notification for retrieval upon next login
4. THE Notification_Service SHALL include notification severity in the SignalR broadcast for UI styling
5. THE Notification_Service SHALL include related entity type and ID for client-side navigation
6. THE Notification_Service SHALL prevent delivery of notifications to anonymous Guest connections
7. THE Notification_Service SHALL support broadcasting System_Notification type to all connected authenticated users

### Requirement 39: Notification Management by Users

**User Story:** As an authenticated user, I want to view and manage my notifications, so that I can stay informed and maintain a clean notification list.

#### Acceptance Criteria

1. WHEN a user requests their notifications, THE Notification_Service SHALL return notifications sorted by creation timestamp descending
2. WHEN a user requests their notifications, THE Notification_Service SHALL support filtering by is_read status
3. WHEN a user marks a notification as read, THE Notification_Service SHALL set is_read to true and record read_at timestamp
4. WHEN a user marks multiple notifications as read, THE Notification_Service SHALL support bulk update operations
5. THE Notification_Service SHALL display unread notification count in the user interface header
6. THE Notification_Service SHALL paginate notification lists with maximum 20 records per page
7. THE Notification_Service SHALL support filtering notifications by notification_type and severity
8. THE Notification_Service SHALL render notification messages with entity links for navigation to related records


### Requirement 40: Notification Archival and Cleanup

**User Story:** As the System, I want to automatically archive old notifications, so that the notification table remains performant and relevant.

#### Acceptance Criteria

1. THE Notification_Service SHALL automatically mark notifications older than 30 days as archived
2. WHEN querying notifications, THE Notification_Service SHALL exclude archived notifications by default
3. WHEN a user explicitly requests archived notifications, THE Notification_Service SHALL include them in results
4. THE Notification_Service SHALL run archival process daily at midnight UTC
5. THE Notification_Service SHALL prevent physical deletion of notifications for audit trail purposes
6. THE Notification_Service SHALL include archived notification count in user profile statistics

### Requirement 41: Security and Access Control for Multi-Area Operations

**User Story:** As a SuperAdmin, I want to prepare for future multi-location deployments, so that user permissions can be scoped to specific parking areas.

#### Acceptance Criteria

1. THE System SHALL support future extension for user-to-parking-area assignments
2. WHEN querying data, THE System SHALL accept optional parking_area_id parameter with default to current area
3. THE System SHALL design API endpoints to include parking_area_id in route or query parameters
4. THE System SHALL validate that users cannot access parking areas they are not assigned to in future implementations
5. THE System SHALL include parking_area_id in JWT claims for future authorization logic
6. THE System SHALL design database schema to support parking area-scoped data isolation


### Requirement 42: API Versioning and Backward Compatibility

**User Story:** As a developer, I want API versioning support, so that future changes can be made without breaking existing clients.

#### Acceptance Criteria

1. THE System SHALL support API versioning using URL path prefix (e.g., /api/v1/)
2. THE System SHALL maintain the current API as version 1.0
3. WHEN introducing breaking changes, THE System SHALL create a new API version
4. THE System SHALL maintain previous API versions for at least 6 months after new version release
5. THE System SHALL document API version deprecation timelines in API documentation
6. THE System SHALL return API version information in response headers
7. THE System SHALL support content negotiation for API version selection via Accept header

### Requirement 43: Health Check and Monitoring Endpoints

**User Story:** As a system administrator, I want health check endpoints, so that monitoring systems can verify application health and dependencies.

#### Acceptance Criteria

1. THE System SHALL expose a /health endpoint that returns 200 OK when the application is healthy
2. THE System SHALL include database connectivity status in health check results
3. THE System SHALL include SignalR hub status in health check results
4. THE System SHALL expose a /health/ready endpoint for Kubernetes readiness probes
5. THE System SHALL expose a /health/live endpoint for Kubernetes liveness probes
6. THE System SHALL return degraded status (status 200 with degraded flag) when non-critical services are unavailable
7. THE System SHALL return unhealthy status (status 503) when critical services like database are unavailable
8. THE System SHALL include response time metrics in health check detailed results


### Requirement 44: Database Connection Pooling and Optimization

**User Story:** As a system administrator, I want optimized database connection management, so that the system handles concurrent users efficiently.

#### Acceptance Criteria

1. THE System SHALL configure database connection pooling with minimum 5 and maximum 100 connections
2. THE System SHALL set connection timeout to 30 seconds
3. THE System SHALL set command timeout to 30 seconds for long-running queries
4. THE System SHALL enable connection retry logic with exponential backoff for transient failures
5. THE System SHALL log slow queries exceeding 1 second execution time
6. THE System SHALL use database indexes on frequently queried columns: slot_id, zone_id, parking_area_id, start_time, user_id
7. THE System SHALL implement query result caching for parking area and zone configuration data

### Requirement 45: SignalR Connection Management and Scalability

**User Story:** As a system administrator, I want SignalR connection management optimized for scalability, so that the system supports multiple concurrent users and future server scaling.

#### Acceptance Criteria

1. THE System SHALL configure SignalR with Azure SignalR Service support for horizontal scaling
2. THE System SHALL set WebSocket keep-alive interval to 15 seconds
3. THE System SHALL set client timeout to 60 seconds
4. THE System SHALL implement connection grouping by parking_area_id for targeted broadcasting
5. THE System SHALL limit concurrent SignalR connections per IP address to 10 for anonymous guests
6. THE System SHALL track active connection count and expose metric via monitoring endpoint
7. THE System SHALL gracefully handle connection drops and support automatic reconnection
8. THE System SHALL log connection and disconnection events for monitoring


### Requirement 46: Brute Force Protection and Account Security

**User Story:** As a security administrator, I want brute force protection on login attempts, so that user accounts are protected from credential attacks.

#### Acceptance Criteria

1. THE System SHALL track failed login attempts by username and IP address
2. WHEN a user account reaches 5 failed login attempts within 15 minutes, THE System SHALL temporarily lock the account for 15 minutes
3. WHEN an IP address reaches 10 failed login attempts within 15 minutes, THE System SHALL temporarily block the IP for 30 minutes
4. THE System SHALL log all account lockout events in the Audit_System
5. THE System SHALL send notification to SuperAdmin users when an account is locked
6. THE System SHALL display remaining lockout time to users attempting to login from locked accounts
7. THE System SHALL reset failed attempt counter upon successful login
8. THE System SHALL allow SuperAdmin users to manually unlock accounts

### Requirement 47: Content Sanitization and XSS Prevention

**User Story:** As a security administrator, I want user-generated content sanitized, so that the system is protected from XSS attacks.

#### Acceptance Criteria

1. THE System SHALL sanitize all user input before storing in the database
2. THE System SHALL encode HTML entities in incident descriptions and resolution notes
3. THE System SHALL prevent script tag injection in all text input fields
4. THE System SHALL validate that notification messages do not contain executable code
5. THE System SHALL implement Content Security Policy headers to prevent inline script execution
6. THE System SHALL escape special characters in zone names and parking area names
7. THE System SHALL validate that color hex codes contain only valid hexadecimal characters
8. THE System SHALL log suspected XSS attempts in the security audit log


### Requirement 48: Backup and Disaster Recovery Preparation

**User Story:** As a system administrator, I want database backup procedures defined, so that data can be recovered in case of system failure.

#### Acceptance Criteria

1. THE System SHALL support automated daily database backups at 2 AM local time
2. THE System SHALL retain daily backups for 30 days
3. THE System SHALL retain weekly backups for 12 weeks
4. THE System SHALL support point-in-time recovery for the last 7 days
5. THE System SHALL validate backup integrity with automated restore tests monthly
6. THE System SHALL log all backup operations with success or failure status
7. THE System SHALL send notification to SuperAdmin users when backups fail
8. THE System SHALL support manual backup triggering via admin interface

### Requirement 49: Data Retention and Archival Policy

**User Story:** As a system administrator, I want configurable data retention policies, so that historical data is preserved for analytics while managing storage costs.

#### Acceptance Criteria

1. THE System SHALL retain Status_History records indefinitely for analytics and ML training
2. THE System SHALL retain Audit_Log records for minimum 2 years
3. THE System SHALL archive Notification records older than 90 days
4. THE System SHALL archive PredictionSnapshot records older than 180 days
5. THE System SHALL support configurable retention periods via SystemSettings
6. THE System SHALL run data archival process weekly
7. THE System SHALL log all archival operations in the Audit_System
8. THE System SHALL support restoration of archived data upon request


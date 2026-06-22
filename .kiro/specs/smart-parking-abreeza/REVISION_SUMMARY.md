# Requirements Document Revision Summary

## Overview
The requirements document has been comprehensively revised to incorporate critical architectural corrections and new functional modules. The document now contains **49 requirements** (up from 30), with all requirements following EARS patterns and INCOSE quality rules.

## Critical Architectural Corrections

### 1. ✅ Guest Access Clarification
**CORRECTED:** Guest is now properly defined as an anonymous, public visitor
- **Glossary Updated:** "Guest: A public, anonymous visitor accessing the system without authentication or account"
- **Requirement 2:** Modified to clarify only 3 authenticated roles exist in database (SuperAdmin, Admin, Staff)
- **Throughout:** Removed references to "Guest users" having accounts; changed to "anonymous Guest visitors"
- **Impact:** 8 requirements updated

### 2. ✅ ParkingArea Entity Added
**NEW ENTITY:** Multi-location architecture support
- **Glossary Added:** "Parking_Area: A physical location containing multiple zones"
- **New Requirement 3:** Complete ParkingArea Management (10 acceptance criteria)
- **Requirement 4:** Zone Management updated to include parking_area_id FK
- **Database Hierarchy:** ParkingArea → Zones → ParkingSlots
- **Default Deployment:** "Ayala Malls Abreeza Ground Floor"
- **Impact:** 15 requirements updated with parking_area_id scoping

### 3. ✅ Parking Slot Status Simplification
**REMOVED:** "Reserved" status (not in project scope)
- **Glossary Updated:** "Slot_Status: Available, Occupied, Maintenance" (removed Reserved)
- **Requirement 6:** Updated to validate only 3 statuses
- **Requirement 10:** Removed blue color for Reserved slots
- **Impact:** 4 requirements updated

## New Functional Modules

### 4. ✅ Parking Incident Management Module (6 Requirements)
**Requirements 32-37:** Complete incident tracking system

#### Requirement 32: Parking Incident Reporting
- 5 incident types: Blocked_Slot, Maintenance_Issue, Unauthorized_Parking, Sensor_Failure, Safety_Concern
- 4 severity levels: Low, Medium, High, Critical
- Optional slot_id and zone_id linking
- Required parking_area_id for all incidents

#### Requirement 33: Parking Incident Management
- 4 status states: Open, In_Progress, Resolved, Closed
- Resolution tracking with user_id and timestamp
- Status transition validation
- Real-time broadcast via SignalR

#### Requirement 34: Incident Query and Filtering
- Multi-criteria filtering (area, zone, type, severity, status)
- Text search on descriptions
- Average resolution time calculation
- Pagination support

#### Requirement 35: Incident-Linked Maintenance Status
- Automatic slot status update to Maintenance
- Bi-directional linking between incidents and slots
- Resolution workflow integration

#### Requirement 36: Incident Dashboard Visualization
- Open incident counts by severity
- Incident type distribution charts
- Average resolution time metrics
- Critical incident highlighting (>2 hours open)

### 5. ✅ Notification System Module (4 Requirements)
**Requirements 37-40:** Real-time user notifications

#### Requirement 37: System Notification Creation
- 5 notification types: Incident_Alert, Maintenance_Alert, System_Notification, Prediction_Alert, Sensor_Alert
- 3 severity levels: Info, Warning, Error
- Auto-creation for critical events
- Entity linking for context

#### Requirement 38: Real-Time Notification Delivery
- SignalR broadcast within 100ms
- User-specific delivery
- Offline storage for disconnected users
- Broadcast support for system-wide notifications

#### Requirement 39: Notification Management by Users
- Inbox with read/unread filtering
- Bulk mark-as-read operations
- Unread count display
- Entity navigation links

#### Requirement 40: Notification Archival and Cleanup
- Auto-archive after 30 days
- Optional archived notification retrieval
- Daily cleanup process

## Additional Enhancements (Requirements 41-49)

### Security & Infrastructure
- **Req 41:** Multi-area access control preparation
- **Req 42:** API versioning and backward compatibility
- **Req 43:** Health check endpoints (/health, /health/ready, /health/live)
- **Req 44:** Database connection pooling (5-100 connections)
- **Req 45:** SignalR scalability with Azure SignalR Service support
- **Req 46:** Brute force protection (5 failed attempts = 15 min lockout)
- **Req 47:** XSS prevention and content sanitization
- **Req 48:** Backup and disaster recovery (daily backups, 30-day retention)
- **Req 49:** Data retention policies (Status_History indefinite, Notifications 90 days)

## Entities Added/Modified

### New Entities
1. **ParkingArea**
   - id, name, address, description, total_capacity
   - created_at, updated_at, is_deleted

2. **ParkingIncident**
   - id, slot_id (nullable), zone_id (nullable), parking_area_id
   - incident_type, severity, status, description
   - reported_by, reported_at, resolved_by, resolved_at, resolution_notes

3. **Notification**
   - id, user_id, notification_type, severity
   - title, message, is_read, read_at
   - related_entity_type, related_entity_id, created_at

### Modified Entities
- **Zones:** Added parking_area_id FK
- **ParkingSlots:** current_status enum reduced to 3 values
- **PredictionSnapshots:** Added parking_area_id
- **AuditLogs:** Extended for incident tracking

## Glossary Additions
- Parking_Area
- Parking_Incident
- Incident_Type
- Incident_Status
- Incident_Manager (subsystem)
- Notification
- Notification_Service (subsystem)

## Testability Notes

### Property-Based Testing Opportunities
1. **Round-trip Properties:**
   - Incident lifecycle: Open → In_Progress → Resolved → Closed (unidirectional)
   - Notification creation → delivery → read → archive

2. **Invariants:**
   - Incident.parking_area_id must always be valid
   - Slot.status changes must create incident for Maintenance type
   - Notification.user_id must exist in Users table

3. **Error Conditions:**
   - Invalid incident type enum values
   - Status transitions from Closed state (should fail)
   - Notification delivery to non-existent users

## Migration Path

### Database Migrations Needed
1. Create ParkingAreas table
2. Add parking_area_id to Zones table (FK)
3. Seed default "Ayala Malls Abreeza Ground Floor" parking area
4. Update existing Zones to link to default parking area
5. Create ParkingIncidents table with FKs
6. Create Notifications table with FKs
7. Remove "Reserved" enum value from ParkingSlot.current_status

### Code Changes Required
1. Add Incident_Manager subsystem
2. Add Notification_Service subsystem
3. Extend SignalR hub for incident and notification broadcasts
4. Update all zone queries to include parking_area_id filtering
5. Remove Reserved status handling in frontend and backend

## Compliance Verification

✅ All requirements follow EARS patterns
✅ All requirements are testable and measurable
✅ No vague terms ("quickly", "reasonable")
✅ Active voice used throughout
✅ Consistent terminology from Glossary
✅ No escape clauses ("where possible")
✅ Solution-free (implementation left to design phase)

## Next Steps
1. Review and approve revised requirements
2. Proceed to Design phase (technical architecture)
3. Create database migration scripts
4. Define API contracts for new modules
5. Create task breakdown for implementation

---

**Revision Date:** 2024
**Total Requirements:** 49 (was 30)
**New Requirements:** 19
**Modified Requirements:** 15
**Ready for Design Phase:** ✅

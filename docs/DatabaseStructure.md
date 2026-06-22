DatabaseStructure.md

Smart Parking Abreeza — Database Structure

AI Instruction File | Read Before Creating Entities or Migrations

1. Database Overview

The Smart Parking Abreeza system utilizes a relational database to manage
ground-floor parking operations, real-time slot status, and historical data
required for predictive occupancy analytics.

Technical Specifications:

  - RDBMS: SQL Server
  - ORM: Entity Framework Core 9 (Code-First)
  - Primary Keys: Guid (Sequential for performance)
  - Timezone: All timestamps are stored in UTC.

2. Database Rules & Standards

  - Clean Architecture Compliance: Entities reside in the Domain layer;
    Configurations and Migrations reside in the Infrastructure layer.
  - Naming Convention: Use PascalCase for C# Entity properties and snake_case
    for SQL table/column names.
  - Base Entity: All main entities must inherit from BaseEntity.
  - Soft Delete: Use is_deleted (boolean) instead of physical deletion for Zones
    and Slots to maintain historical data integrity for analytics.

3. Base Entity Structure

public abstract class BaseEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public string? CreatedBy { get; set; }
    public bool IsDeleted { get; set; } = false;
}

4. Identity & Access Control (RBAC)

Users

Stores administrative and operational personnel.

  - id (Guid, PK)
  - username (string)
  - email (string)
  - password_hash (string)
  - role (Enum: SuperAdmin, Admin, Staff)
  - is_active (bool)

RefreshTokens

Used for secure JWT-based authentication.

  - id (Guid, PK)
  - user_id (Guid, FK)
  - token (string)
  - expiry_date (DateTime)
  - is_revoked (bool)

5. Parking Infrastructure Tables

Zones

Dividing the Abreeza Ground Floor parking into manageable sections.

  - id (Guid, PK)
  - name (string) — e.g., "Zone A", "Zone B"
  - description (string)
  - map_color_hex (string) — For frontend visualization.
  - sort_order (int)

ParkingSlots

Individual slots for cars or motorcycles.

  - id (Guid, PK)
  - zone_id (Guid, FK)
  - slot_number (string) — e.g., "A-001"
  - vehicle_type (Enum: Car, Motorcycle)
  - current_status (Enum: Available, Occupied, Maintenance, Reserved)
  - last_status_change (DateTime)
  - x_coordinate (float) — Used for SVG/Canvas map positioning.
  - y_coordinate (float) — Used for SVG/Canvas map positioning.
  - is_sensor_enabled (bool) — Flag for future IoT integration.

6. Occupancy & Analytics Tables

SlotStatusHistory

The most critical table for Predictive Analytics. Every state change is logged
here.

  - id (Guid, PK)
  - slot_id (Guid, FK)
  - status (Enum)
  - start_time (DateTime)
  - end_time (DateTime, Nullable) — Updated when the next status change occurs.
  - duration_minutes (int) — Calculated field.

PredictionSnapshots

Stores generated forecasts to allow the frontend to display data without
recalculating on every request.

  - id (Guid, PK)
  - zone_id (Guid, FK)
  - vehicle_type (Enum)
  - forecast_time (DateTime) — The future time this prediction is for.
  - predicted_occupancy_count (int)
  - predicted_occupancy_percentage (float)
  - calculation_basis (string) — Metadata about which rule/logic was used.

7. System & Audit Tables

AuditLogs

Records every administrative action for accountability.

  - id (Guid, PK)
  - user_id (Guid, FK)
  - action (string) — e.g., "Manual Update", "Zone Configuration Change"
  - entity_name (string)
  - entity_id (string)
  - old_values (string/JSON)
  - new_values (string/JSON)
  - timestamp (DateTime)

SystemSettings

Global configurations for the mall's parking logic.

  - id (Guid, PK)
  - setting_key (string) — e.g., "MallOpeningTime", "PredictionWeightTrend"
  - setting_value (string)

8. Main Relationships (ERD Summary)

  - Zone (1) ↔ (N) ParkingSlots
      - One zone contains many individual slots.
  - ParkingSlot (1) ↔ (N) SlotStatusHistory
      - One slot has an infinite history of status transitions.
  - User (1) ↔ (N) AuditLogs
      - All admin/staff actions are tracked back to a specific user.
  - Zone (1) ↔ (N) PredictionSnapshots
      - Predictions are generated and aggregated per zone.

9. Analytics Design Note (ML-Ready)

The structure of the SlotStatusHistory table is designed to be compatible with
future Machine Learning integration. By recording the start_time and end_time of
every "Occupied" event, you can later export this data to train regression
models based on:

1.  Day of the week (extracted from start_time).
2.  Hour of the day (extracted from start_time).
3.  Average duration for that specific zone.

10. Future IoT Device Mapping (Extension)

The database is prepared for the future "IoT Integration" phase via the
following planned table:

SensorDevices (Conceptual)

  - id (Guid, PK)
  - slot_id (Guid, FK)
  - mac_address (string)
  - device_type (Ultrasonic / IR)
  - battery_level (float)
  - last_heartbeat (DateTime)

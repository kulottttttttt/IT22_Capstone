using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartParking.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "parking_areas",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    address = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    total_capacity = table.Column<int>(type: "int", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: true),
                    created_by = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    is_deleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_parking_areas", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "system_settings",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    setting_key = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    setting_value = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: true),
                    created_by = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    is_deleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_system_settings", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    username = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    password_hash = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    role = table.Column<byte>(type: "tinyint", nullable: false),
                    is_active = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: true),
                    created_by = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    is_deleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "zones",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    parking_area_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    map_color_hex = table.Column<string>(type: "nvarchar(7)", maxLength: 7, nullable: false),
                    sort_order = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: true),
                    created_by = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    is_deleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_zones", x => x.id);
                    table.ForeignKey(
                        name: "FK_zones_parking_areas_parking_area_id",
                        column: x => x.parking_area_id,
                        principalTable: "parking_areas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "audit_logs",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    user_id = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    action_type = table.Column<byte>(type: "tinyint", nullable: false),
                    entity_name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    entity_id = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    old_values = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    new_values = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ip_address = table.Column<string>(type: "nvarchar(45)", maxLength: 45, nullable: true),
                    user_agent = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    timestamp = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_audit_logs", x => x.id);
                    table.ForeignKey(
                        name: "FK_audit_logs_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "notifications",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    user_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    notification_type = table.Column<byte>(type: "tinyint", nullable: false),
                    severity = table.Column<byte>(type: "tinyint", nullable: false),
                    title = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    message = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    is_read = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    read_at = table.Column<DateTime>(type: "datetime2", nullable: true),
                    related_entity_type = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    related_entity_id = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    is_archived = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: true),
                    created_by = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    is_deleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_notifications", x => x.id);
                    table.ForeignKey(
                        name: "FK_notifications_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "refresh_tokens",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    user_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    token = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    expiry_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    is_revoked = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: true),
                    created_by = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    is_deleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_refresh_tokens", x => x.id);
                    table.ForeignKey(
                        name: "FK_refresh_tokens_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "parking_slots",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    zone_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    slot_number = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    vehicle_type = table.Column<byte>(type: "tinyint", nullable: false),
                    current_status = table.Column<byte>(type: "tinyint", nullable: false),
                    last_status_change = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    x_coordinate = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    y_coordinate = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    is_sensor_enabled = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: true),
                    created_by = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    is_deleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_parking_slots", x => x.id);
                    table.ForeignKey(
                        name: "FK_parking_slots_zones_zone_id",
                        column: x => x.zone_id,
                        principalTable: "zones",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "prediction_snapshots",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    parking_area_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    zone_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    vehicle_type = table.Column<byte>(type: "tinyint", nullable: false),
                    forecast_time = table.Column<DateTime>(type: "datetime2", nullable: false),
                    predicted_occupancy_count = table.Column<int>(type: "int", nullable: false),
                    predicted_occupancy_percentage = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    confidence_level = table.Column<byte>(type: "tinyint", nullable: false),
                    calculation_basis = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: true),
                    created_by = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    is_deleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_prediction_snapshots", x => x.id);
                    table.ForeignKey(
                        name: "FK_prediction_snapshots_parking_areas_parking_area_id",
                        column: x => x.parking_area_id,
                        principalTable: "parking_areas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_prediction_snapshots_zones_zone_id",
                        column: x => x.zone_id,
                        principalTable: "zones",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "parking_incidents",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    parking_area_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    zone_id = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    slot_id = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    incident_type = table.Column<byte>(type: "tinyint", nullable: false),
                    severity = table.Column<byte>(type: "tinyint", nullable: false),
                    status = table.Column<byte>(type: "tinyint", nullable: false),
                    description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    reported_by = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    reported_at = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    resolved_by = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    resolved_at = table.Column<DateTime>(type: "datetime2", nullable: true),
                    resolution_notes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_parking_incidents", x => x.id);
                    table.ForeignKey(
                        name: "FK_parking_incidents_parking_areas_parking_area_id",
                        column: x => x.parking_area_id,
                        principalTable: "parking_areas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_parking_incidents_parking_slots_slot_id",
                        column: x => x.slot_id,
                        principalTable: "parking_slots",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_parking_incidents_users_reported_by",
                        column: x => x.reported_by,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_parking_incidents_users_resolved_by",
                        column: x => x.resolved_by,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_parking_incidents_zones_zone_id",
                        column: x => x.zone_id,
                        principalTable: "zones",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "slot_status_history",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    slot_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    status = table.Column<byte>(type: "tinyint", nullable: false),
                    start_time = table.Column<DateTime>(type: "datetime2", nullable: false),
                    end_time = table.Column<DateTime>(type: "datetime2", nullable: true),
                    duration_minutes = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_slot_status_history", x => x.id);
                    table.ForeignKey(
                        name: "FK_slot_status_history_parking_slots_slot_id",
                        column: x => x.slot_id,
                        principalTable: "parking_slots",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "idx_audit_logs_action_type",
                table: "audit_logs",
                column: "action_type");

            migrationBuilder.CreateIndex(
                name: "idx_audit_logs_entity",
                table: "audit_logs",
                columns: new[] { "entity_name", "entity_id" });

            migrationBuilder.CreateIndex(
                name: "idx_audit_logs_entity_name",
                table: "audit_logs",
                column: "entity_name");

            migrationBuilder.CreateIndex(
                name: "idx_audit_logs_timestamp",
                table: "audit_logs",
                column: "timestamp");

            migrationBuilder.CreateIndex(
                name: "idx_audit_logs_user_id",
                table: "audit_logs",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "idx_notifications_created_at",
                table: "notifications",
                column: "created_at");

            migrationBuilder.CreateIndex(
                name: "idx_notifications_is_archived",
                table: "notifications",
                column: "is_archived");

            migrationBuilder.CreateIndex(
                name: "idx_notifications_is_read",
                table: "notifications",
                column: "is_read");

            migrationBuilder.CreateIndex(
                name: "idx_notifications_user_id",
                table: "notifications",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "idx_parking_areas_is_deleted",
                table: "parking_areas",
                column: "is_deleted");

            migrationBuilder.CreateIndex(
                name: "idx_incidents_parking_area_id",
                table: "parking_incidents",
                column: "parking_area_id");

            migrationBuilder.CreateIndex(
                name: "idx_incidents_reported_at",
                table: "parking_incidents",
                column: "reported_at");

            migrationBuilder.CreateIndex(
                name: "idx_incidents_severity",
                table: "parking_incidents",
                column: "severity");

            migrationBuilder.CreateIndex(
                name: "idx_incidents_slot_id",
                table: "parking_incidents",
                column: "slot_id");

            migrationBuilder.CreateIndex(
                name: "idx_incidents_status",
                table: "parking_incidents",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "idx_incidents_zone_id",
                table: "parking_incidents",
                column: "zone_id");

            migrationBuilder.CreateIndex(
                name: "IX_parking_incidents_reported_by",
                table: "parking_incidents",
                column: "reported_by");

            migrationBuilder.CreateIndex(
                name: "IX_parking_incidents_resolved_by",
                table: "parking_incidents",
                column: "resolved_by");

            migrationBuilder.CreateIndex(
                name: "idx_slots_current_status",
                table: "parking_slots",
                column: "current_status");

            migrationBuilder.CreateIndex(
                name: "idx_slots_is_deleted",
                table: "parking_slots",
                column: "is_deleted");

            migrationBuilder.CreateIndex(
                name: "idx_slots_slot_number",
                table: "parking_slots",
                column: "slot_number",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "idx_slots_vehicle_type",
                table: "parking_slots",
                column: "vehicle_type");

            migrationBuilder.CreateIndex(
                name: "idx_slots_zone_id",
                table: "parking_slots",
                column: "zone_id");

            migrationBuilder.CreateIndex(
                name: "idx_prediction_snapshots_created_at",
                table: "prediction_snapshots",
                column: "created_at");

            migrationBuilder.CreateIndex(
                name: "idx_prediction_snapshots_forecast_time",
                table: "prediction_snapshots",
                column: "forecast_time");

            migrationBuilder.CreateIndex(
                name: "idx_prediction_snapshots_parking_area_id",
                table: "prediction_snapshots",
                column: "parking_area_id");

            migrationBuilder.CreateIndex(
                name: "idx_prediction_snapshots_zone_id",
                table: "prediction_snapshots",
                column: "zone_id");

            migrationBuilder.CreateIndex(
                name: "idx_refresh_tokens_expiry",
                table: "refresh_tokens",
                column: "expiry_date",
                filter: "[is_revoked] = 0");

            migrationBuilder.CreateIndex(
                name: "idx_refresh_tokens_token",
                table: "refresh_tokens",
                column: "token",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "idx_refresh_tokens_user_id",
                table: "refresh_tokens",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "idx_slot_status_history_end_time",
                table: "slot_status_history",
                column: "end_time",
                filter: "[end_time] IS NULL");

            migrationBuilder.CreateIndex(
                name: "idx_slot_status_history_slot_id",
                table: "slot_status_history",
                column: "slot_id");

            migrationBuilder.CreateIndex(
                name: "idx_slot_status_history_start_time",
                table: "slot_status_history",
                column: "start_time");

            migrationBuilder.CreateIndex(
                name: "idx_slot_status_history_status",
                table: "slot_status_history",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "idx_system_settings_key",
                table: "system_settings",
                column: "setting_key",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "idx_users_email",
                table: "users",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "idx_users_role",
                table: "users",
                column: "role");

            migrationBuilder.CreateIndex(
                name: "idx_users_username",
                table: "users",
                column: "username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "idx_zones_is_deleted",
                table: "zones",
                column: "is_deleted");

            migrationBuilder.CreateIndex(
                name: "idx_zones_parking_area_id",
                table: "zones",
                column: "parking_area_id");

            migrationBuilder.CreateIndex(
                name: "idx_zones_sort_order",
                table: "zones",
                column: "sort_order");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "audit_logs");

            migrationBuilder.DropTable(
                name: "notifications");

            migrationBuilder.DropTable(
                name: "parking_incidents");

            migrationBuilder.DropTable(
                name: "prediction_snapshots");

            migrationBuilder.DropTable(
                name: "refresh_tokens");

            migrationBuilder.DropTable(
                name: "slot_status_history");

            migrationBuilder.DropTable(
                name: "system_settings");

            migrationBuilder.DropTable(
                name: "users");

            migrationBuilder.DropTable(
                name: "parking_slots");

            migrationBuilder.DropTable(
                name: "zones");

            migrationBuilder.DropTable(
                name: "parking_areas");
        }
    }
}

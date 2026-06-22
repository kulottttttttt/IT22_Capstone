using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartParking.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSlotStatusHistoryForPhase4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "idx_slot_status_history_end_time",
                table: "slot_status_history");

            migrationBuilder.DropIndex(
                name: "idx_slot_status_history_status",
                table: "slot_status_history");

            migrationBuilder.DropColumn(
                name: "duration_minutes",
                table: "slot_status_history");

            migrationBuilder.DropColumn(
                name: "end_time",
                table: "slot_status_history");

            migrationBuilder.RenameColumn(
                name: "status",
                table: "slot_status_history",
                newName: "previous_status");

            migrationBuilder.RenameColumn(
                name: "start_time",
                table: "slot_status_history",
                newName: "changed_at");

            migrationBuilder.RenameIndex(
                name: "idx_slot_status_history_start_time",
                table: "slot_status_history",
                newName: "idx_slot_status_history_changed_at");

            migrationBuilder.AddColumn<Guid>(
                name: "changed_by_user_id",
                table: "slot_status_history",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<byte>(
                name: "new_status",
                table: "slot_status_history",
                type: "tinyint",
                nullable: false,
                defaultValue: (byte)0);

            migrationBuilder.AddColumn<string>(
                name: "reason",
                table: "slot_status_history",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "idx_slot_status_history_changed_by_user_id",
                table: "slot_status_history",
                column: "changed_by_user_id");

            migrationBuilder.CreateIndex(
                name: "idx_slot_status_history_new_status",
                table: "slot_status_history",
                column: "new_status");

            migrationBuilder.AddForeignKey(
                name: "FK_slot_status_history_users_changed_by_user_id",
                table: "slot_status_history",
                column: "changed_by_user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_slot_status_history_users_changed_by_user_id",
                table: "slot_status_history");

            migrationBuilder.DropIndex(
                name: "idx_slot_status_history_changed_by_user_id",
                table: "slot_status_history");

            migrationBuilder.DropIndex(
                name: "idx_slot_status_history_new_status",
                table: "slot_status_history");

            migrationBuilder.DropColumn(
                name: "changed_by_user_id",
                table: "slot_status_history");

            migrationBuilder.DropColumn(
                name: "new_status",
                table: "slot_status_history");

            migrationBuilder.DropColumn(
                name: "reason",
                table: "slot_status_history");

            migrationBuilder.RenameColumn(
                name: "previous_status",
                table: "slot_status_history",
                newName: "status");

            migrationBuilder.RenameColumn(
                name: "changed_at",
                table: "slot_status_history",
                newName: "start_time");

            migrationBuilder.RenameIndex(
                name: "idx_slot_status_history_changed_at",
                table: "slot_status_history",
                newName: "idx_slot_status_history_start_time");

            migrationBuilder.AddColumn<int>(
                name: "duration_minutes",
                table: "slot_status_history",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "end_time",
                table: "slot_status_history",
                type: "datetime2",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "idx_slot_status_history_end_time",
                table: "slot_status_history",
                column: "end_time",
                filter: "[end_time] IS NULL");

            migrationBuilder.CreateIndex(
                name: "idx_slot_status_history_status",
                table: "slot_status_history",
                column: "status");
        }
    }
}

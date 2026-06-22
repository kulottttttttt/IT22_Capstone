using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartParking.Domain.Entities;
using SmartParking.Domain.Enums;

namespace SmartParking.Infrastructure.Persistence.Configurations;

public class ParkingSlotConfiguration : IEntityTypeConfiguration<ParkingSlot>
{
    public void Configure(EntityTypeBuilder<ParkingSlot> builder)
    {
        builder.ToTable("parking_slots");

        builder.HasKey(ps => ps.Id);

        builder.Property(ps => ps.Id)
            .HasColumnName("id")
            .ValueGeneratedNever();

        builder.Property(ps => ps.ZoneId)
            .HasColumnName("zone_id")
            .IsRequired();

        builder.Property(ps => ps.SlotNumber)
            .HasColumnName("slot_number")
            .HasMaxLength(10)
            .IsRequired();

        builder.Property(ps => ps.VehicleType)
            .HasColumnName("vehicle_type")
            .HasConversion<byte>()
            .IsRequired();

        builder.Property(ps => ps.CurrentStatus)
            .HasColumnName("current_status")
            .HasConversion<byte>()
            .IsRequired();

        builder.Property(ps => ps.LastStatusChange)
            .HasColumnName("last_status_change")
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(ps => ps.XCoordinate)
            .HasColumnName("x_coordinate")
            .HasColumnType("decimal(10,2)")
            .IsRequired();

        builder.Property(ps => ps.YCoordinate)
            .HasColumnName("y_coordinate")
            .HasColumnType("decimal(10,2)")
            .IsRequired();

        builder.Property(ps => ps.IsSensorEnabled)
            .HasColumnName("is_sensor_enabled")
            .HasDefaultValue(false);

        builder.Property(ps => ps.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(ps => ps.UpdatedAt)
            .HasColumnName("updated_at");

        builder.Property(ps => ps.CreatedBy)
            .HasColumnName("created_by")
            .HasMaxLength(50);

        builder.Property(ps => ps.IsDeleted)
            .HasColumnName("is_deleted")
            .HasDefaultValue(false);

        builder.HasIndex(ps => ps.ZoneId)
            .HasDatabaseName("idx_slots_zone_id");

        builder.HasIndex(ps => ps.CurrentStatus)
            .HasDatabaseName("idx_slots_current_status");

        builder.HasIndex(ps => ps.VehicleType)
            .HasDatabaseName("idx_slots_vehicle_type");

        builder.HasIndex(ps => ps.SlotNumber)
            .HasDatabaseName("idx_slots_slot_number")
            .IsUnique();

        builder.HasIndex(ps => ps.IsDeleted)
            .HasDatabaseName("idx_slots_is_deleted");

        builder.HasMany(ps => ps.StatusHistory)
            .WithOne(ssh => ssh.Slot)
            .HasForeignKey(ssh => ssh.SlotId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

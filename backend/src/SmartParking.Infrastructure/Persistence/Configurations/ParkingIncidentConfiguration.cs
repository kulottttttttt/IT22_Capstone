using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartParking.Domain.Entities;

namespace SmartParking.Infrastructure.Persistence.Configurations;

public class ParkingIncidentConfiguration : IEntityTypeConfiguration<ParkingIncident>
{
    public void Configure(EntityTypeBuilder<ParkingIncident> builder)
    {
        builder.ToTable("parking_incidents");

        builder.HasKey(pi => pi.Id);

        builder.Property(pi => pi.Id)
            .HasColumnName("id")
            .ValueGeneratedNever();

        builder.Property(pi => pi.ParkingAreaId)
            .HasColumnName("parking_area_id")
            .IsRequired();

        builder.Property(pi => pi.ZoneId)
            .HasColumnName("zone_id");

        builder.Property(pi => pi.SlotId)
            .HasColumnName("slot_id");

        builder.Property(pi => pi.IncidentType)
            .HasColumnName("incident_type")
            .HasConversion<byte>()
            .IsRequired();

        builder.Property(pi => pi.Severity)
            .HasColumnName("severity")
            .HasConversion<byte>()
            .IsRequired();

        builder.Property(pi => pi.Status)
            .HasColumnName("status")
            .HasConversion<byte>()
            .IsRequired();

        builder.Property(pi => pi.Description)
            .HasColumnName("description")
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(pi => pi.ReportedBy)
            .HasColumnName("reported_by")
            .IsRequired();

        builder.Property(pi => pi.ReportedAt)
            .HasColumnName("reported_at")
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(pi => pi.ResolvedBy)
            .HasColumnName("resolved_by");

        builder.Property(pi => pi.ResolvedAt)
            .HasColumnName("resolved_at");

        builder.Property(pi => pi.ResolutionNotes)
            .HasColumnName("resolution_notes")
            .HasMaxLength(500);

        builder.Property(pi => pi.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(pi => pi.UpdatedAt)
            .HasColumnName("updated_at");

        builder.HasIndex(pi => pi.ParkingAreaId)
            .HasDatabaseName("idx_incidents_parking_area_id");

        builder.HasIndex(pi => pi.ZoneId)
            .HasDatabaseName("idx_incidents_zone_id");

        builder.HasIndex(pi => pi.SlotId)
            .HasDatabaseName("idx_incidents_slot_id");

        builder.HasIndex(pi => pi.Status)
            .HasDatabaseName("idx_incidents_status");

        builder.HasIndex(pi => pi.Severity)
            .HasDatabaseName("idx_incidents_severity");

        builder.HasIndex(pi => pi.ReportedAt)
            .HasDatabaseName("idx_incidents_reported_at");

        builder.HasOne(pi => pi.ParkingArea)
            .WithMany()
            .HasForeignKey(pi => pi.ParkingAreaId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(pi => pi.Zone)
            .WithMany()
            .HasForeignKey(pi => pi.ZoneId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(pi => pi.Slot)
            .WithMany()
            .HasForeignKey(pi => pi.SlotId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

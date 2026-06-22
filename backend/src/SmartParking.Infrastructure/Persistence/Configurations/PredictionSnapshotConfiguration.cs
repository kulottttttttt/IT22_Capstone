using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartParking.Domain.Entities;

namespace SmartParking.Infrastructure.Persistence.Configurations;

public class PredictionSnapshotConfiguration : IEntityTypeConfiguration<PredictionSnapshot>
{
    public void Configure(EntityTypeBuilder<PredictionSnapshot> builder)
    {
        builder.ToTable("prediction_snapshots");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Id)
            .HasColumnName("id");

        builder.Property(p => p.ParkingAreaId)
            .HasColumnName("parking_area_id")
            .IsRequired();

        builder.Property(p => p.ZoneId)
            .HasColumnName("zone_id")
            .IsRequired();

        builder.Property(p => p.VehicleType)
            .HasColumnName("vehicle_type")
            .HasConversion<byte>()
            .IsRequired();

        builder.Property(p => p.ForecastTime)
            .HasColumnName("forecast_time")
            .IsRequired();

        builder.Property(p => p.PredictedOccupancyCount)
            .HasColumnName("predicted_occupancy_count")
            .IsRequired();

        builder.Property(p => p.PredictedOccupancyPercentage)
            .HasColumnName("predicted_occupancy_percentage")
            .HasColumnType("decimal(5,2)")
            .IsRequired();

        builder.Property(p => p.ConfidenceLevel)
            .HasColumnName("confidence_level")
            .HasConversion<byte>()
            .IsRequired();

        builder.Property(p => p.CalculationBasis)
            .HasColumnName("calculation_basis")
            .HasMaxLength(500);

        builder.Property(p => p.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(p => p.UpdatedAt)
            .HasColumnName("updated_at");

        builder.Property(p => p.CreatedBy)
            .HasColumnName("created_by")
            .HasMaxLength(50);

        builder.Property(p => p.IsDeleted)
            .HasColumnName("is_deleted")
            .IsRequired()
            .HasDefaultValue(false);

        // Indexes
        builder.HasIndex(p => p.ZoneId)
            .HasDatabaseName("idx_prediction_snapshots_zone_id");

        builder.HasIndex(p => p.ParkingAreaId)
            .HasDatabaseName("idx_prediction_snapshots_parking_area_id");

        builder.HasIndex(p => p.ForecastTime)
            .HasDatabaseName("idx_prediction_snapshots_forecast_time");

        builder.HasIndex(p => p.CreatedAt)
            .HasDatabaseName("idx_prediction_snapshots_created_at");

        // Relationships
        builder.HasOne(p => p.ParkingArea)
            .WithMany(pa => pa.PredictionSnapshots)
            .HasForeignKey(p => p.ParkingAreaId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(p => p.Zone)
            .WithMany(z => z.PredictionSnapshots)
            .HasForeignKey(p => p.ZoneId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

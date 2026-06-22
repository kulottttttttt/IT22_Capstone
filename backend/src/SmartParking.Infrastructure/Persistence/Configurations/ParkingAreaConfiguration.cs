using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartParking.Domain.Entities;

namespace SmartParking.Infrastructure.Persistence.Configurations;

public class ParkingAreaConfiguration : IEntityTypeConfiguration<ParkingArea>
{
    public void Configure(EntityTypeBuilder<ParkingArea> builder)
    {
        builder.ToTable("parking_areas");

        builder.HasKey(pa => pa.Id);

        builder.Property(pa => pa.Id)
            .HasColumnName("id")
            .ValueGeneratedNever();

        builder.Property(pa => pa.Name)
            .HasColumnName("name")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(pa => pa.Address)
            .HasColumnName("address")
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(pa => pa.Description)
            .HasColumnName("description")
            .HasMaxLength(1000);

        builder.Property(pa => pa.TotalCapacity)
            .HasColumnName("total_capacity");

        builder.Property(pa => pa.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(pa => pa.UpdatedAt)
            .HasColumnName("updated_at");

        builder.Property(pa => pa.CreatedBy)
            .HasColumnName("created_by")
            .HasMaxLength(50);

        builder.Property(pa => pa.IsDeleted)
            .HasColumnName("is_deleted")
            .HasDefaultValue(false);

        builder.HasIndex(pa => pa.IsDeleted)
            .HasDatabaseName("idx_parking_areas_is_deleted");

        builder.HasMany(pa => pa.Zones)
            .WithOne(z => z.ParkingArea)
            .HasForeignKey(z => z.ParkingAreaId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

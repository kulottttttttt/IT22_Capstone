using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartParking.Domain.Entities;

namespace SmartParking.Infrastructure.Persistence.Configurations;

public class ZoneConfiguration : IEntityTypeConfiguration<Zone>
{
    public void Configure(EntityTypeBuilder<Zone> builder)
    {
        builder.ToTable("zones");

        builder.HasKey(z => z.Id);

        builder.Property(z => z.Id)
            .HasColumnName("id")
            .ValueGeneratedNever();

        builder.Property(z => z.ParkingAreaId)
            .HasColumnName("parking_area_id")
            .IsRequired();

        builder.Property(z => z.Name)
            .HasColumnName("name")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(z => z.Description)
            .HasColumnName("description")
            .HasMaxLength(500);

        builder.Property(z => z.MapColorHex)
            .HasColumnName("map_color_hex")
            .HasMaxLength(7)
            .IsRequired();

        builder.Property(z => z.SortOrder)
            .HasColumnName("sort_order")
            .HasDefaultValue(0);

        builder.Property(z => z.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(z => z.UpdatedAt)
            .HasColumnName("updated_at");

        builder.Property(z => z.CreatedBy)
            .HasColumnName("created_by")
            .HasMaxLength(50);

        builder.Property(z => z.IsDeleted)
            .HasColumnName("is_deleted")
            .HasDefaultValue(false);

        builder.HasIndex(z => z.ParkingAreaId)
            .HasDatabaseName("idx_zones_parking_area_id");

        builder.HasIndex(z => z.SortOrder)
            .HasDatabaseName("idx_zones_sort_order");

        builder.HasIndex(z => z.IsDeleted)
            .HasDatabaseName("idx_zones_is_deleted");

        builder.HasMany(z => z.ParkingSlots)
            .WithOne(ps => ps.Zone)
            .HasForeignKey(ps => ps.ZoneId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

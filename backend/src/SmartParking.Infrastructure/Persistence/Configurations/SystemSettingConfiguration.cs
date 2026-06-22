using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartParking.Domain.Entities;

namespace SmartParking.Infrastructure.Persistence.Configurations;

public class SystemSettingConfiguration : IEntityTypeConfiguration<SystemSetting>
{
    public void Configure(EntityTypeBuilder<SystemSetting> builder)
    {
        builder.ToTable("system_settings");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.Id)
            .HasColumnName("id");

        builder.Property(s => s.SettingKey)
            .HasColumnName("setting_key")
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(s => s.SettingValue)
            .HasColumnName("setting_value")
            .IsRequired()
            .HasColumnType("nvarchar(max)");

        builder.Property(s => s.Description)
            .HasColumnName("description")
            .HasMaxLength(500);

        builder.Property(s => s.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(s => s.UpdatedAt)
            .HasColumnName("updated_at");

        builder.Property(s => s.CreatedBy)
            .HasColumnName("created_by")
            .HasMaxLength(50);

        builder.Property(s => s.IsDeleted)
            .HasColumnName("is_deleted")
            .IsRequired()
            .HasDefaultValue(false);

        // Indexes
        builder.HasIndex(s => s.SettingKey)
            .HasDatabaseName("idx_system_settings_key")
            .IsUnique();
    }
}

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartParking.Domain.Entities;

namespace SmartParking.Infrastructure.Persistence.Configurations;

public class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
{
    public void Configure(EntityTypeBuilder<AuditLog> builder)
    {
        builder.ToTable("audit_logs");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.Id)
            .HasColumnName("id");

        builder.Property(a => a.UserId)
            .HasColumnName("user_id");

        builder.Property(a => a.ActionType)
            .HasColumnName("action_type")
            .HasConversion<byte>()
            .IsRequired();

        builder.Property(a => a.EntityName)
            .HasColumnName("entity_name")
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(a => a.EntityId)
            .HasColumnName("entity_id")
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(a => a.OldValues)
            .HasColumnName("old_values")
            .HasColumnType("nvarchar(max)");

        builder.Property(a => a.NewValues)
            .HasColumnName("new_values")
            .HasColumnType("nvarchar(max)");

        builder.Property(a => a.IpAddress)
            .HasColumnName("ip_address")
            .HasMaxLength(45);

        builder.Property(a => a.UserAgent)
            .HasColumnName("user_agent")
            .HasMaxLength(500);

        builder.Property(a => a.Timestamp)
            .HasColumnName("timestamp")
            .IsRequired();

        // Indexes
        builder.HasIndex(a => a.UserId)
            .HasDatabaseName("idx_audit_logs_user_id");

        builder.HasIndex(a => a.ActionType)
            .HasDatabaseName("idx_audit_logs_action_type");

        builder.HasIndex(a => a.EntityName)
            .HasDatabaseName("idx_audit_logs_entity_name");

        builder.HasIndex(a => a.Timestamp)
            .HasDatabaseName("idx_audit_logs_timestamp");

        builder.HasIndex(a => new { a.EntityName, a.EntityId })
            .HasDatabaseName("idx_audit_logs_entity");
    }
}

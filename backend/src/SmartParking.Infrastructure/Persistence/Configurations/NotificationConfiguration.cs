using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartParking.Domain.Entities;

namespace SmartParking.Infrastructure.Persistence.Configurations;

public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        builder.ToTable("notifications");

        builder.HasKey(n => n.Id);

        builder.Property(n => n.Id)
            .HasColumnName("id");

        builder.Property(n => n.UserId)
            .HasColumnName("user_id")
            .IsRequired();

        builder.Property(n => n.NotificationType)
            .HasColumnName("notification_type")
            .HasConversion<byte>()
            .IsRequired();

        builder.Property(n => n.Severity)
            .HasColumnName("severity")
            .HasConversion<byte>()
            .IsRequired();

        builder.Property(n => n.Title)
            .HasColumnName("title")
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(n => n.Message)
            .HasColumnName("message")
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(n => n.IsRead)
            .HasColumnName("is_read")
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(n => n.ReadAt)
            .HasColumnName("read_at");

        builder.Property(n => n.RelatedEntityType)
            .HasColumnName("related_entity_type")
            .HasMaxLength(50);

        builder.Property(n => n.RelatedEntityId)
            .HasColumnName("related_entity_id")
            .HasMaxLength(50);

        builder.Property(n => n.IsArchived)
            .HasColumnName("is_archived")
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(n => n.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(n => n.UpdatedAt)
            .HasColumnName("updated_at");

        builder.Property(n => n.CreatedBy)
            .HasColumnName("created_by")
            .HasMaxLength(50);

        builder.Property(n => n.IsDeleted)
            .HasColumnName("is_deleted")
            .IsRequired()
            .HasDefaultValue(false);

        // Indexes
        builder.HasIndex(n => n.UserId)
            .HasDatabaseName("idx_notifications_user_id");

        builder.HasIndex(n => n.IsRead)
            .HasDatabaseName("idx_notifications_is_read");

        builder.HasIndex(n => n.CreatedAt)
            .HasDatabaseName("idx_notifications_created_at");

        builder.HasIndex(n => n.IsArchived)
            .HasDatabaseName("idx_notifications_is_archived");
    }
}

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartParking.Domain.Entities;

namespace SmartParking.Infrastructure.Persistence.Configurations;

public class SlotStatusHistoryConfiguration : IEntityTypeConfiguration<SlotStatusHistory>
{
    public void Configure(EntityTypeBuilder<SlotStatusHistory> builder)
    {
        builder.ToTable("slot_status_history");

        builder.HasKey(ssh => ssh.Id);

        builder.Property(ssh => ssh.Id)
            .HasColumnName("id")
            .ValueGeneratedNever();

        builder.Property(ssh => ssh.SlotId)
            .HasColumnName("slot_id")
            .IsRequired();

        builder.Property(ssh => ssh.PreviousStatus)
            .HasColumnName("previous_status")
            .HasConversion<byte>()
            .IsRequired();

        builder.Property(ssh => ssh.NewStatus)
            .HasColumnName("new_status")
            .HasConversion<byte>()
            .IsRequired();

        builder.Property(ssh => ssh.ChangedByUserId)
            .HasColumnName("changed_by_user_id");

        builder.Property(ssh => ssh.ChangedAt)
            .HasColumnName("changed_at")
            .IsRequired();

        builder.Property(ssh => ssh.Reason)
            .HasColumnName("reason")
            .HasMaxLength(500);

        // Relationships
        builder.HasOne(ssh => ssh.ChangedByUser)
            .WithMany()
            .HasForeignKey(ssh => ssh.ChangedByUserId)
            .OnDelete(DeleteBehavior.SetNull);

        // Indexes
        builder.HasIndex(ssh => ssh.SlotId)
            .HasDatabaseName("idx_slot_status_history_slot_id");

        builder.HasIndex(ssh => ssh.ChangedAt)
            .HasDatabaseName("idx_slot_status_history_changed_at");

        builder.HasIndex(ssh => ssh.NewStatus)
            .HasDatabaseName("idx_slot_status_history_new_status");

        builder.HasIndex(ssh => ssh.ChangedByUserId)
            .HasDatabaseName("idx_slot_status_history_changed_by_user_id");
    }
}

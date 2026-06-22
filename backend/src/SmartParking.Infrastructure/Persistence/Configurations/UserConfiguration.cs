using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartParking.Domain.Entities;

namespace SmartParking.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");

        builder.HasKey(u => u.Id);

        builder.Property(u => u.Id)
            .HasColumnName("id");

        builder.Property(u => u.Username)
            .HasColumnName("username")
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(u => u.Email)
            .HasColumnName("email")
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(u => u.PasswordHash)
            .HasColumnName("password_hash")
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(u => u.Role)
            .HasColumnName("role")
            .HasConversion<byte>()
            .IsRequired();

        builder.Property(u => u.IsActive)
            .HasColumnName("is_active")
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(u => u.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(u => u.UpdatedAt)
            .HasColumnName("updated_at");

        builder.Property(u => u.CreatedBy)
            .HasColumnName("created_by")
            .HasMaxLength(50);

        builder.Property(u => u.IsDeleted)
            .HasColumnName("is_deleted")
            .IsRequired()
            .HasDefaultValue(false);

        // Indexes
        builder.HasIndex(u => u.Email)
            .HasDatabaseName("idx_users_email")
            .IsUnique();

        builder.HasIndex(u => u.Username)
            .HasDatabaseName("idx_users_username")
            .IsUnique();

        builder.HasIndex(u => u.Role)
            .HasDatabaseName("idx_users_role");

        // Relationships
        builder.HasMany(u => u.RefreshTokens)
            .WithOne(rt => rt.User)
            .HasForeignKey(rt => rt.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(u => u.ReportedIncidents)
            .WithOne(i => i.Reporter)
            .HasForeignKey(i => i.ReportedBy)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(u => u.ResolvedIncidents)
            .WithOne(i => i.Resolver)
            .HasForeignKey(i => i.ResolvedBy)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(u => u.Notifications)
            .WithOne(n => n.User)
            .HasForeignKey(n => n.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(u => u.AuditLogs)
            .WithOne(a => a.User)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

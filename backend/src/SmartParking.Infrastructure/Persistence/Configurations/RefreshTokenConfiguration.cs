using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartParking.Domain.Entities;

namespace SmartParking.Infrastructure.Persistence.Configurations;

public class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
{
    public void Configure(EntityTypeBuilder<RefreshToken> builder)
    {
        builder.ToTable("refresh_tokens");

        builder.HasKey(rt => rt.Id);

        builder.Property(rt => rt.Id)
            .HasColumnName("id");

        builder.Property(rt => rt.UserId)
            .HasColumnName("user_id")
            .IsRequired();

        builder.Property(rt => rt.Token)
            .HasColumnName("token")
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(rt => rt.ExpiryDate)
            .HasColumnName("expiry_date")
            .IsRequired();

        builder.Property(rt => rt.IsRevoked)
            .HasColumnName("is_revoked")
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(rt => rt.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(rt => rt.UpdatedAt)
            .HasColumnName("updated_at");

        builder.Property(rt => rt.CreatedBy)
            .HasColumnName("created_by")
            .HasMaxLength(50);

        builder.Property(rt => rt.IsDeleted)
            .HasColumnName("is_deleted")
            .IsRequired()
            .HasDefaultValue(false);

        // Indexes
        builder.HasIndex(rt => rt.UserId)
            .HasDatabaseName("idx_refresh_tokens_user_id");

        builder.HasIndex(rt => rt.Token)
            .HasDatabaseName("idx_refresh_tokens_token")
            .IsUnique();

        builder.HasIndex(rt => rt.ExpiryDate)
            .HasDatabaseName("idx_refresh_tokens_expiry")
            .HasFilter("[is_revoked] = 0");
    }
}

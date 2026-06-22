using Microsoft.EntityFrameworkCore;
using SmartParking.Application.Common.Interfaces;
using SmartParking.Domain.Entities;
using System.Reflection;

namespace SmartParking.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // Parking Infrastructure
    public DbSet<ParkingArea> ParkingAreas => Set<ParkingArea>();
    public DbSet<Zone> Zones => Set<Zone>();
    public DbSet<ParkingSlot> ParkingSlots => Set<ParkingSlot>();
    public DbSet<SlotStatusHistory> SlotStatusHistory => Set<SlotStatusHistory>();
    
    // Incidents
    public DbSet<ParkingIncident> ParkingIncidents => Set<ParkingIncident>();
    
    // Identity & Auth
    public DbSet<User> Users => Set<User>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    
    // Analytics & Predictions
    public DbSet<PredictionSnapshot> PredictionSnapshots => Set<PredictionSnapshot>();
    
    // Notifications & Audit
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    
    // Settings
    public DbSet<SystemSetting> SystemSettings => Set<SystemSetting>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        base.OnModelCreating(modelBuilder);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await base.SaveChangesAsync(cancellationToken);
    }
}

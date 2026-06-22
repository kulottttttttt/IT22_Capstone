using Microsoft.EntityFrameworkCore;
using SmartParking.Domain.Entities;

namespace SmartParking.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    // Parking Infrastructure
    DbSet<ParkingArea> ParkingAreas { get; }
    DbSet<Zone> Zones { get; }
    DbSet<ParkingSlot> ParkingSlots { get; }
    DbSet<SlotStatusHistory> SlotStatusHistory { get; }
    
    // Incidents
    DbSet<ParkingIncident> ParkingIncidents { get; }
    
    // Identity & Auth
    DbSet<User> Users { get; }
    DbSet<RefreshToken> RefreshTokens { get; }
    
    // Analytics & Predictions
    DbSet<PredictionSnapshot> PredictionSnapshots { get; }
    
    // Notifications & Audit
    DbSet<Notification> Notifications { get; }
    DbSet<AuditLog> AuditLogs { get; }
    
    // Settings
    DbSet<SystemSetting> SystemSettings { get; }
    
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}

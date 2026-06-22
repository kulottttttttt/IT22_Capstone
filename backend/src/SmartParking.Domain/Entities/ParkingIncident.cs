using SmartParking.Domain.Common;
using SmartParking.Domain.Enums;

namespace SmartParking.Domain.Entities;

public class ParkingIncident : BaseEntity
{
    public Guid ParkingAreaId { get; set; }
    public Guid? ZoneId { get; set; }
    public Guid? SlotId { get; set; }
    public IncidentType IncidentType { get; set; }
    public IncidentSeverity Severity { get; set; }
    public IncidentStatus Status { get; set; }
    public string Description { get; set; } = string.Empty;
    public Guid ReportedBy { get; set; }
    public DateTime ReportedAt { get; set; } = DateTime.UtcNow;
    public Guid? ResolvedBy { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public string? ResolutionNotes { get; set; }
    
    // Navigation properties
    public ParkingArea ParkingArea { get; set; } = null!;
    public Zone? Zone { get; set; }
    public ParkingSlot? Slot { get; set; }
    public User Reporter { get; set; } = null!;
    public User? Resolver { get; set; }
}

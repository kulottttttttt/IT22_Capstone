using SmartParking.Domain.Common;
using SmartParking.Domain.Enums;

namespace SmartParking.Domain.Entities;

public class ParkingSlot : BaseEntity
{
    public Guid ZoneId { get; set; }
    public string SlotNumber { get; set; } = string.Empty;
    public VehicleType VehicleType { get; set; }
    public SlotStatus CurrentStatus { get; set; }
    public DateTime LastStatusChange { get; set; } = DateTime.UtcNow;
    public decimal XCoordinate { get; set; }
    public decimal YCoordinate { get; set; }
    public bool IsSensorEnabled { get; set; }
    
    // Navigation properties
    public Zone Zone { get; set; } = null!;
    public ICollection<SlotStatusHistory> StatusHistory { get; set; } = new List<SlotStatusHistory>();
}

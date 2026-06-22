using SmartParking.Domain.Common;

namespace SmartParking.Domain.Entities;

public class Zone : BaseEntity
{
    public Guid ParkingAreaId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string MapColorHex { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    
    // Navigation properties
    public ParkingArea ParkingArea { get; set; } = null!;
    public ICollection<ParkingSlot> ParkingSlots { get; set; } = new List<ParkingSlot>();
    public ICollection<PredictionSnapshot> PredictionSnapshots { get; set; } = new List<PredictionSnapshot>();
}

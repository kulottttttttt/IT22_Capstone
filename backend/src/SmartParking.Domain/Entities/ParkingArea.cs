using SmartParking.Domain.Common;

namespace SmartParking.Domain.Entities;

public class ParkingArea : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int TotalCapacity { get; set; }
    
    // Navigation properties
    public ICollection<Zone> Zones { get; set; } = new List<Zone>();
    public ICollection<PredictionSnapshot> PredictionSnapshots { get; set; } = new List<PredictionSnapshot>();
}

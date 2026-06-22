using SmartParking.Domain.Enums;

namespace SmartParking.Domain.Entities;

public class SlotStatusHistory
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid SlotId { get; set; }
    public SlotStatus PreviousStatus { get; set; }
    public SlotStatus NewStatus { get; set; }
    public Guid? ChangedByUserId { get; set; }
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
    public string? Reason { get; set; }
    
    // Navigation properties
    public ParkingSlot Slot { get; set; } = null!;
    public User? ChangedByUser { get; set; }
}

namespace SmartParking.Application.Common.DTOs.SignalR;

public class ParkingAreaUpdatedEvent
{
    public Guid ParkingAreaId { get; set; }
    public int TotalSlots { get; set; }
    public int AvailableSlots { get; set; }
    public int OccupiedSlots { get; set; }
    public int MaintenanceSlots { get; set; }
}

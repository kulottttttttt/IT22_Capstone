namespace SmartParking.Application.Common.DTOs.SignalR;

public class ZoneOccupancyUpdatedEvent
{
    public Guid ZoneId { get; set; }
    public int TotalSlots { get; set; }
    public int AvailableSlots { get; set; }
    public int OccupiedSlots { get; set; }
    public int MaintenanceSlots { get; set; }
    public decimal OccupancyPercentage { get; set; }
}

namespace SmartParking.Application.Common.DTOs.SignalR;

public class SlotStatusChangedEvent
{
    public Guid SlotId { get; set; }
    public string SlotNumber { get; set; } = string.Empty;
    public Guid ZoneId { get; set; }
    public string PreviousStatus { get; set; } = string.Empty;
    public string NewStatus { get; set; } = string.Empty;
    public DateTime ChangedAt { get; set; }
    public string? ChangedBy { get; set; }
}

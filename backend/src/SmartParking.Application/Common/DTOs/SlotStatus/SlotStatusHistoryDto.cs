namespace SmartParking.Application.Common.DTOs.SlotStatus;

public class SlotStatusHistoryDto
{
    public Guid Id { get; set; }
    public Guid SlotId { get; set; }
    public string? SlotNumber { get; set; }
    public string PreviousStatus { get; set; } = string.Empty;
    public string NewStatus { get; set; } = string.Empty;
    public Guid? ChangedByUserId { get; set; }
    public string? ChangedByUsername { get; set; }
    public DateTime ChangedAt { get; set; }
    public string? Reason { get; set; }
}

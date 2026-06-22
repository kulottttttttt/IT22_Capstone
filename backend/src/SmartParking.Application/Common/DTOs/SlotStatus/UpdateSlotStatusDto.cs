namespace SmartParking.Application.Common.DTOs.SlotStatus;

public class UpdateSlotStatusDto
{
    public string Status { get; set; } = string.Empty;
    public string? Reason { get; set; }
}

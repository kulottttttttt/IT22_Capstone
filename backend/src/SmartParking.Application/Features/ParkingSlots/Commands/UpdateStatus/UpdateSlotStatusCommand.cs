using MediatR;
using SmartParking.Application.Common.DTOs.ParkingSlot;

namespace SmartParking.Application.Features.ParkingSlots.Commands.UpdateStatus;

public class UpdateSlotStatusCommand : IRequest<ParkingSlotDto>
{
    public Guid SlotId { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Reason { get; set; }
    public Guid UserId { get; set; }
}

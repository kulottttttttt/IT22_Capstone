using MediatR;
using SmartParking.Application.Common.DTOs.SlotStatus;

namespace SmartParking.Application.Features.ParkingSlots.Queries.GetHistory;

public class GetSlotHistoryQuery : IRequest<List<SlotStatusHistoryDto>>
{
    public Guid SlotId { get; set; }
}

using MediatR;
using SmartParking.Application.Common.DTOs.SlotStatus;

namespace SmartParking.Application.Features.ParkingSlots.Queries.GetAllHistory;

public class GetAllSlotHistoryQuery : IRequest<List<SlotStatusHistoryDto>>
{
}

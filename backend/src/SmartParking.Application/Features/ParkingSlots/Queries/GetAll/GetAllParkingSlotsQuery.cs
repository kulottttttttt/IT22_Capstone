using MediatR;
using SmartParking.Application.Common.DTOs.ParkingSlot;

namespace SmartParking.Application.Features.ParkingSlots.Queries.GetAll;

public class GetAllParkingSlotsQuery : IRequest<List<ParkingSlotDto>>
{
}

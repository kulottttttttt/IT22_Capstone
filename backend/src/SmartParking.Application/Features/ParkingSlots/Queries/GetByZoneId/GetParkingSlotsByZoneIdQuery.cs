using MediatR;
using SmartParking.Application.Common.DTOs.ParkingSlot;

namespace SmartParking.Application.Features.ParkingSlots.Queries.GetByZoneId;

public class GetParkingSlotsByZoneIdQuery : IRequest<List<ParkingSlotDto>>
{
    public Guid ZoneId { get; set; }
}

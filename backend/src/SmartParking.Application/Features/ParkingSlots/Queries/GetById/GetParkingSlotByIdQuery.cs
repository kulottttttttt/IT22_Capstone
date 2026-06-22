using MediatR;
using SmartParking.Application.Common.DTOs.ParkingSlot;

namespace SmartParking.Application.Features.ParkingSlots.Queries.GetById;

public class GetParkingSlotByIdQuery : IRequest<ParkingSlotDto>
{
    public Guid Id { get; set; }
}

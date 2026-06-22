using MediatR;

namespace SmartParking.Application.Features.ParkingSlots.Commands.Delete;

public class DeleteParkingSlotCommand : IRequest<bool>
{
    public Guid Id { get; set; }
}

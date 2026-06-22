using MediatR;

namespace SmartParking.Application.Features.ParkingAreas.Commands.Delete;

public class DeleteParkingAreaCommand : IRequest<bool>
{
    public Guid Id { get; set; }
}

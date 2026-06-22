using MediatR;

namespace SmartParking.Application.Features.Zones.Commands.Delete;

public class DeleteZoneCommand : IRequest<bool>
{
    public Guid Id { get; set; }
}

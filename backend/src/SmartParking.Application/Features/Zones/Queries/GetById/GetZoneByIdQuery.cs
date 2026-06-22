using MediatR;
using SmartParking.Application.Common.DTOs.Zone;

namespace SmartParking.Application.Features.Zones.Queries.GetById;

public class GetZoneByIdQuery : IRequest<ZoneDto>
{
    public Guid Id { get; set; }
}

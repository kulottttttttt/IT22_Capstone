using MediatR;
using SmartParking.Application.Common.DTOs.Zone;

namespace SmartParking.Application.Features.Zones.Queries.GetByParkingAreaId;

public class GetZonesByParkingAreaIdQuery : IRequest<List<ZoneDto>>
{
    public Guid ParkingAreaId { get; set; }
}

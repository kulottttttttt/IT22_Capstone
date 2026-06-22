using MediatR;
using SmartParking.Application.Common.DTOs.Zone;

namespace SmartParking.Application.Features.Zones.Queries.GetAll;

public class GetAllZonesQuery : IRequest<List<ZoneDto>>
{
}

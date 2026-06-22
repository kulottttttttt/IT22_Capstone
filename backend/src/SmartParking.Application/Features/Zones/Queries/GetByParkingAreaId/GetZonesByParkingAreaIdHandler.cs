using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartParking.Application.Common.DTOs.Zone;
using SmartParking.Application.Common.Interfaces;

namespace SmartParking.Application.Features.Zones.Queries.GetByParkingAreaId;

public class GetZonesByParkingAreaIdHandler : IRequestHandler<GetZonesByParkingAreaIdQuery, List<ZoneDto>>
{
    private readonly IApplicationDbContext _context;

    public GetZonesByParkingAreaIdHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ZoneDto>> Handle(GetZonesByParkingAreaIdQuery request, CancellationToken cancellationToken)
    {
        var zones = await _context.Zones
            .Include(z => z.ParkingArea)
            .Where(z => z.ParkingAreaId == request.ParkingAreaId && !z.IsDeleted)
            .OrderBy(z => z.SortOrder)
            .ThenBy(z => z.Name)
            .Select(z => new ZoneDto
            {
                Id = z.Id,
                ParkingAreaId = z.ParkingAreaId,
                ParkingAreaName = z.ParkingArea!.Name,
                Name = z.Name,
                Description = z.Description,
                MapColorHex = z.MapColorHex,
                SortOrder = z.SortOrder,
                CreatedAt = z.CreatedAt,
                UpdatedAt = z.UpdatedAt
            })
            .ToListAsync(cancellationToken);

        return zones;
    }
}

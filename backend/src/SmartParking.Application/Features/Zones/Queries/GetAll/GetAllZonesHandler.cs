using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartParking.Application.Common.DTOs.Zone;
using SmartParking.Application.Common.Interfaces;

namespace SmartParking.Application.Features.Zones.Queries.GetAll;

public class GetAllZonesHandler : IRequestHandler<GetAllZonesQuery, List<ZoneDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAllZonesHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ZoneDto>> Handle(GetAllZonesQuery request, CancellationToken cancellationToken)
    {
        var zones = await _context.Zones
            .Where(z => !z.IsDeleted)
            .OrderBy(z => z.SortOrder)
            .ThenBy(z => z.Name)
            .Select(z => new ZoneDto
            {
                Id = z.Id,
                ParkingAreaId = z.ParkingAreaId,
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

using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartParking.Application.Common.DTOs.Zone;
using SmartParking.Application.Common.Interfaces;

namespace SmartParking.Application.Features.Zones.Queries.GetById;

public class GetZoneByIdHandler : IRequestHandler<GetZoneByIdQuery, ZoneDto>
{
    private readonly IApplicationDbContext _context;

    public GetZoneByIdHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ZoneDto> Handle(GetZoneByIdQuery request, CancellationToken cancellationToken)
    {
        var zone = await _context.Zones
            .Include(z => z.ParkingArea)
            .FirstOrDefaultAsync(z => z.Id == request.Id && !z.IsDeleted, cancellationToken);

        if (zone == null)
        {
            throw new KeyNotFoundException($"Zone with ID {request.Id} not found.");
        }

        return new ZoneDto
        {
            Id = zone.Id,
            ParkingAreaId = zone.ParkingAreaId,
            ParkingAreaName = zone.ParkingArea?.Name,
            Name = zone.Name,
            Description = zone.Description,
            MapColorHex = zone.MapColorHex,
            SortOrder = zone.SortOrder,
            CreatedAt = zone.CreatedAt,
            UpdatedAt = zone.UpdatedAt
        };
    }
}

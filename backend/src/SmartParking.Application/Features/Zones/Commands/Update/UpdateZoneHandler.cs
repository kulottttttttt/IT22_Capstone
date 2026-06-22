using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartParking.Application.Common.DTOs.Zone;
using SmartParking.Application.Common.Interfaces;

namespace SmartParking.Application.Features.Zones.Commands.Update;

public class UpdateZoneHandler : IRequestHandler<UpdateZoneCommand, ZoneDto>
{
    private readonly IApplicationDbContext _context;

    public UpdateZoneHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ZoneDto> Handle(UpdateZoneCommand request, CancellationToken cancellationToken)
    {
        var zone = await _context.Zones
            .FirstOrDefaultAsync(z => z.Id == request.Id && !z.IsDeleted, cancellationToken);

        if (zone == null)
        {
            throw new KeyNotFoundException($"Zone with ID {request.Id} not found.");
        }

        // Validate parking area exists if changed
        if (zone.ParkingAreaId != request.ParkingAreaId)
        {
            var parkingAreaExists = await _context.ParkingAreas
                .AnyAsync(pa => pa.Id == request.ParkingAreaId && !pa.IsDeleted, cancellationToken);

            if (!parkingAreaExists)
            {
                throw new KeyNotFoundException($"Parking area with ID {request.ParkingAreaId} not found.");
            }
        }

        zone.ParkingAreaId = request.ParkingAreaId;
        zone.Name = request.Name;
        zone.Description = request.Description;
        zone.MapColorHex = request.MapColorHex;
        zone.SortOrder = request.SortOrder;
        zone.UpdatedAt = DateTime.UtcNow;
        // TODO: Add audit logging when available - UpdatedBy = currentUserId

        await _context.SaveChangesAsync(cancellationToken);

        return new ZoneDto
        {
            Id = zone.Id,
            ParkingAreaId = zone.ParkingAreaId,
            Name = zone.Name,
            Description = zone.Description,
            MapColorHex = zone.MapColorHex,
            SortOrder = zone.SortOrder,
            CreatedAt = zone.CreatedAt,
            UpdatedAt = zone.UpdatedAt
        };
    }
}

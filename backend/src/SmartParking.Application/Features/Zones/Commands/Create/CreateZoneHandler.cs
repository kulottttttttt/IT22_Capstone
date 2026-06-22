using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartParking.Application.Common.DTOs.Zone;
using SmartParking.Application.Common.Interfaces;
using SmartParking.Domain.Entities;

namespace SmartParking.Application.Features.Zones.Commands.Create;

public class CreateZoneHandler : IRequestHandler<CreateZoneCommand, ZoneDto>
{
    private readonly IApplicationDbContext _context;

    public CreateZoneHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ZoneDto> Handle(CreateZoneCommand request, CancellationToken cancellationToken)
    {
        // Validate parking area exists
        var parkingAreaExists = await _context.ParkingAreas
            .AnyAsync(pa => pa.Id == request.ParkingAreaId && !pa.IsDeleted, cancellationToken);

        if (!parkingAreaExists)
        {
            throw new KeyNotFoundException($"Parking area with ID {request.ParkingAreaId} not found.");
        }

        var zone = new Zone
        {
            Id = Guid.NewGuid(),
            ParkingAreaId = request.ParkingAreaId,
            Name = request.Name,
            Description = request.Description,
            MapColorHex = request.MapColorHex,
            SortOrder = request.SortOrder,
            CreatedAt = DateTime.UtcNow
            // TODO: Add audit logging when available - CreatedBy = currentUserId
        };

        _context.Zones.Add(zone);
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

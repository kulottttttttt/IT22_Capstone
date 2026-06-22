using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartParking.Application.Common.DTOs.ParkingSlot;
using SmartParking.Application.Common.Interfaces;

namespace SmartParking.Application.Features.ParkingSlots.Queries.GetById;

public class GetParkingSlotByIdHandler : IRequestHandler<GetParkingSlotByIdQuery, ParkingSlotDto>
{
    private readonly IApplicationDbContext _context;

    public GetParkingSlotByIdHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ParkingSlotDto> Handle(GetParkingSlotByIdQuery request, CancellationToken cancellationToken)
    {
        var slot = await _context.ParkingSlots
            .Include(ps => ps.Zone)
                .ThenInclude(z => z.ParkingArea)
            .FirstOrDefaultAsync(ps => ps.Id == request.Id && !ps.IsDeleted, cancellationToken);

        if (slot == null)
        {
            throw new KeyNotFoundException($"Parking slot with ID {request.Id} not found.");
        }

        return new ParkingSlotDto
        {
            Id = slot.Id,
            ZoneId = slot.ZoneId,
            ZoneName = slot.Zone.Name,
            ParkingAreaName = slot.Zone.ParkingArea?.Name,
            SlotNumber = slot.SlotNumber,
            CurrentStatus = slot.CurrentStatus.ToString(),
            VehicleType = slot.VehicleType.ToString(),
            LastStatusChange = slot.LastStatusChange,
            XCoordinate = slot.XCoordinate,
            YCoordinate = slot.YCoordinate,
            IsSensorEnabled = slot.IsSensorEnabled,
            CreatedAt = slot.CreatedAt,
            UpdatedAt = slot.UpdatedAt
        };
    }
}

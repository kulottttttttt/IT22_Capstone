using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartParking.Application.Common.DTOs.ParkingSlot;
using SmartParking.Application.Common.Interfaces;

namespace SmartParking.Application.Features.ParkingSlots.Queries.GetAll;

public class GetAllParkingSlotsHandler : IRequestHandler<GetAllParkingSlotsQuery, List<ParkingSlotDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAllParkingSlotsHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ParkingSlotDto>> Handle(GetAllParkingSlotsQuery request, CancellationToken cancellationToken)
    {
        var slots = await _context.ParkingSlots
            .Include(ps => ps.Zone)
                .ThenInclude(z => z.ParkingArea)
            .Where(ps => !ps.IsDeleted)
            .OrderBy(ps => ps.Zone.ParkingArea!.Name)
            .ThenBy(ps => ps.Zone.Name)
            .ThenBy(ps => ps.SlotNumber)
            .Select(ps => new ParkingSlotDto
            {
                Id = ps.Id,
                ZoneId = ps.ZoneId,
                ZoneName = ps.Zone.Name,
                ParkingAreaName = ps.Zone.ParkingArea!.Name,
                SlotNumber = ps.SlotNumber,
                CurrentStatus = ps.CurrentStatus.ToString(),
                VehicleType = ps.VehicleType.ToString(),
                LastStatusChange = ps.LastStatusChange,
                XCoordinate = ps.XCoordinate,
                YCoordinate = ps.YCoordinate,
                IsSensorEnabled = ps.IsSensorEnabled,
                CreatedAt = ps.CreatedAt,
                UpdatedAt = ps.UpdatedAt
            })
            .ToListAsync(cancellationToken);

        return slots;
    }
}

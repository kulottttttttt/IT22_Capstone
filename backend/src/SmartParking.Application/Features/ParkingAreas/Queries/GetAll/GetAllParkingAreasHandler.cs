using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartParking.Application.Common.DTOs.ParkingArea;
using SmartParking.Application.Common.Interfaces;

namespace SmartParking.Application.Features.ParkingAreas.Queries.GetAll;

public class GetAllParkingAreasHandler : IRequestHandler<GetAllParkingAreasQuery, List<ParkingAreaDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAllParkingAreasHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ParkingAreaDto>> Handle(GetAllParkingAreasQuery request, CancellationToken cancellationToken)
    {
        var parkingAreas = await _context.ParkingAreas
            .Where(pa => !pa.IsDeleted)
            .OrderBy(pa => pa.Name)
            .Select(pa => new ParkingAreaDto
            {
                Id = pa.Id,
                Name = pa.Name,
                Address = pa.Address,
                Description = pa.Description,
                TotalCapacity = pa.TotalCapacity,
                CreatedAt = pa.CreatedAt,
                UpdatedAt = pa.UpdatedAt
            })
            .ToListAsync(cancellationToken);

        return parkingAreas;
    }
}

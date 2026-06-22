using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartParking.Application.Common.DTOs.ParkingArea;
using SmartParking.Application.Common.Interfaces;

namespace SmartParking.Application.Features.ParkingAreas.Queries.GetById;

public class GetParkingAreaByIdHandler : IRequestHandler<GetParkingAreaByIdQuery, ParkingAreaDto>
{
    private readonly IApplicationDbContext _context;

    public GetParkingAreaByIdHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ParkingAreaDto> Handle(GetParkingAreaByIdQuery request, CancellationToken cancellationToken)
    {
        var parkingArea = await _context.ParkingAreas
            .Where(pa => pa.Id == request.Id && !pa.IsDeleted)
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
            .FirstOrDefaultAsync(cancellationToken);

        if (parkingArea == null)
        {
            throw new KeyNotFoundException($"Parking area with ID {request.Id} not found.");
        }

        return parkingArea;
    }
}

using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartParking.Application.Common.DTOs.ParkingArea;
using SmartParking.Application.Common.Interfaces;

namespace SmartParking.Application.Features.ParkingAreas.Commands.Update;

public class UpdateParkingAreaHandler : IRequestHandler<UpdateParkingAreaCommand, ParkingAreaDto>
{
    private readonly IApplicationDbContext _context;

    public UpdateParkingAreaHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ParkingAreaDto> Handle(UpdateParkingAreaCommand request, CancellationToken cancellationToken)
    {
        var parkingArea = await _context.ParkingAreas
            .FirstOrDefaultAsync(pa => pa.Id == request.Id && !pa.IsDeleted, cancellationToken);

        if (parkingArea == null)
        {
            throw new KeyNotFoundException($"Parking area with ID {request.Id} not found.");
        }

        parkingArea.Name = request.Name;
        parkingArea.Address = request.Address;
        parkingArea.Description = request.Description;
        parkingArea.UpdatedAt = DateTime.UtcNow;
        // TODO: Add audit logging when available - UpdatedBy = currentUserId

        await _context.SaveChangesAsync(cancellationToken);

        return new ParkingAreaDto
        {
            Id = parkingArea.Id,
            Name = parkingArea.Name,
            Address = parkingArea.Address,
            Description = parkingArea.Description,
            TotalCapacity = parkingArea.TotalCapacity,
            CreatedAt = parkingArea.CreatedAt,
            UpdatedAt = parkingArea.UpdatedAt
        };
    }
}

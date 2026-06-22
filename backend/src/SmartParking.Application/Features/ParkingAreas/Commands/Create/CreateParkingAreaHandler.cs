using MediatR;
using SmartParking.Application.Common.DTOs.ParkingArea;
using SmartParking.Application.Common.Interfaces;
using SmartParking.Domain.Entities;

namespace SmartParking.Application.Features.ParkingAreas.Commands.Create;

public class CreateParkingAreaHandler : IRequestHandler<CreateParkingAreaCommand, ParkingAreaDto>
{
    private readonly IApplicationDbContext _context;

    public CreateParkingAreaHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ParkingAreaDto> Handle(CreateParkingAreaCommand request, CancellationToken cancellationToken)
    {
        var parkingArea = new ParkingArea
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Address = request.Address,
            Description = request.Description,
            TotalCapacity = 0, // Will be calculated based on parking slots
            CreatedAt = DateTime.UtcNow
            // TODO: Add audit logging when available - CreatedBy = currentUserId
        };

        _context.ParkingAreas.Add(parkingArea);
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

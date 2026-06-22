using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartParking.Application.Common.Interfaces;

namespace SmartParking.Application.Features.ParkingAreas.Commands.Delete;

public class DeleteParkingAreaHandler : IRequestHandler<DeleteParkingAreaCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public DeleteParkingAreaHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteParkingAreaCommand request, CancellationToken cancellationToken)
    {
        var parkingArea = await _context.ParkingAreas
            .FirstOrDefaultAsync(pa => pa.Id == request.Id && !pa.IsDeleted, cancellationToken);

        if (parkingArea == null)
        {
            throw new KeyNotFoundException($"Parking area with ID {request.Id} not found.");
        }

        // Soft delete - preserve historical data
        parkingArea.IsDeleted = true;
        parkingArea.UpdatedAt = DateTime.UtcNow;
        // TODO: Add audit logging when available - DeletedBy = currentUserId

        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}

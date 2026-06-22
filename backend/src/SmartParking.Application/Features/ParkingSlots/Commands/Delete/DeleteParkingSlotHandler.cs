using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartParking.Application.Common.Interfaces;

namespace SmartParking.Application.Features.ParkingSlots.Commands.Delete;

public class DeleteParkingSlotHandler : IRequestHandler<DeleteParkingSlotCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public DeleteParkingSlotHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteParkingSlotCommand request, CancellationToken cancellationToken)
    {
        var parkingSlot = await _context.ParkingSlots
            .FirstOrDefaultAsync(ps => ps.Id == request.Id && !ps.IsDeleted, cancellationToken);

        if (parkingSlot == null)
        {
            throw new KeyNotFoundException($"Parking slot with ID {request.Id} not found.");
        }

        // Soft delete - preserve historical data
        parkingSlot.IsDeleted = true;
        parkingSlot.UpdatedAt = DateTime.UtcNow;
        // TODO: Add audit logging when available - DeletedBy = currentUserId

        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}

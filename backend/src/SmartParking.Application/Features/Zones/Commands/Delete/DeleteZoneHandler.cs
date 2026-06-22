using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartParking.Application.Common.Interfaces;

namespace SmartParking.Application.Features.Zones.Commands.Delete;

public class DeleteZoneHandler : IRequestHandler<DeleteZoneCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public DeleteZoneHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteZoneCommand request, CancellationToken cancellationToken)
    {
        var zone = await _context.Zones
            .FirstOrDefaultAsync(z => z.Id == request.Id && !z.IsDeleted, cancellationToken);

        if (zone == null)
        {
            throw new KeyNotFoundException($"Zone with ID {request.Id} not found.");
        }

        // Soft delete - preserve historical data
        zone.IsDeleted = true;
        zone.UpdatedAt = DateTime.UtcNow;
        // TODO: Add audit logging when available - DeletedBy = currentUserId

        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}

using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartParking.Application.Common.DTOs.SlotStatus;
using SmartParking.Application.Common.Interfaces;

namespace SmartParking.Application.Features.ParkingSlots.Queries.GetHistory;

public class GetSlotHistoryHandler : IRequestHandler<GetSlotHistoryQuery, List<SlotStatusHistoryDto>>
{
    private readonly IApplicationDbContext _context;

    public GetSlotHistoryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<SlotStatusHistoryDto>> Handle(GetSlotHistoryQuery request, CancellationToken cancellationToken)
    {
        // Verify slot exists
        var slotExists = await _context.ParkingSlots
            .AnyAsync(ps => ps.Id == request.SlotId && !ps.IsDeleted, cancellationToken);

        if (!slotExists)
        {
            throw new KeyNotFoundException($"Parking slot with ID {request.SlotId} not found.");
        }

        // Get history records
        var history = await _context.SlotStatusHistory
            .Include(ssh => ssh.Slot)
            .Include(ssh => ssh.ChangedByUser)
            .Where(ssh => ssh.SlotId == request.SlotId)
            .OrderByDescending(ssh => ssh.ChangedAt)
            .Select(ssh => new SlotStatusHistoryDto
            {
                Id = ssh.Id,
                SlotId = ssh.SlotId,
                SlotNumber = ssh.Slot.SlotNumber,
                PreviousStatus = ssh.PreviousStatus.ToString(),
                NewStatus = ssh.NewStatus.ToString(),
                ChangedByUserId = ssh.ChangedByUserId,
                ChangedByUsername = ssh.ChangedByUser != null ? ssh.ChangedByUser.Username : null,
                ChangedAt = ssh.ChangedAt,
                Reason = ssh.Reason
            })
            .ToListAsync(cancellationToken);

        return history;
    }
}

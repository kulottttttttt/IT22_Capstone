using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartParking.Application.Common.DTOs.SlotStatus;
using SmartParking.Application.Common.Interfaces;

namespace SmartParking.Application.Features.ParkingSlots.Queries.GetAllHistory;

public class GetAllSlotHistoryHandler : IRequestHandler<GetAllSlotHistoryQuery, List<SlotStatusHistoryDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAllSlotHistoryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<SlotStatusHistoryDto>> Handle(GetAllSlotHistoryQuery request, CancellationToken cancellationToken)
    {
        var history = await _context.SlotStatusHistory
            .Include(ssh => ssh.Slot)
            .Include(ssh => ssh.ChangedByUser)
            .Where(ssh => !ssh.Slot.IsDeleted)
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

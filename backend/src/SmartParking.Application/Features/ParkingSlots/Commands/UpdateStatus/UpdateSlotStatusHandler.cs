using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartParking.Application.Common.DTOs.ParkingSlot;
using SmartParking.Application.Common.DTOs.SignalR;
using SmartParking.Application.Common.Interfaces;
using SmartParking.Domain.Entities;
using SmartParking.Domain.Enums;

namespace SmartParking.Application.Features.ParkingSlots.Commands.UpdateStatus;

public class UpdateSlotStatusHandler : IRequestHandler<UpdateSlotStatusCommand, ParkingSlotDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IParkingHubService _hubService;

    public UpdateSlotStatusHandler(IApplicationDbContext context, IParkingHubService hubService)
    {
        _context = context;
        _hubService = hubService;
    }

    public async Task<ParkingSlotDto> Handle(UpdateSlotStatusCommand request, CancellationToken cancellationToken)
    {
        // Find the parking slot
        var slot = await _context.ParkingSlots
            .Include(ps => ps.Zone)
                .ThenInclude(z => z.ParkingArea)
            .FirstOrDefaultAsync(ps => ps.Id == request.SlotId && !ps.IsDeleted, cancellationToken);

        if (slot == null)
        {
            throw new KeyNotFoundException($"Parking slot with ID {request.SlotId} not found.");
        }

        // Parse the new status
        if (!Enum.TryParse<SlotStatus>(request.Status, true, out var newStatus))
        {
            throw new ArgumentException($"Invalid status: {request.Status}");
        }

        // Check if status is actually changing
        if (slot.CurrentStatus == newStatus)
        {
            throw new InvalidOperationException($"Slot is already in {request.Status} status.");
        }

        // Store previous status
        var previousStatus = slot.CurrentStatus;
        var zoneId = slot.ZoneId;
        var parkingAreaId = slot.Zone.ParkingAreaId;

        // Get the user who made the change
        var user = await _context.Users.FindAsync(new object[] { request.UserId }, cancellationToken);
        var changedByUsername = user?.Username;

        // Create history record
        var historyRecord = new SlotStatusHistory
        {
            SlotId = slot.Id,
            PreviousStatus = previousStatus,
            NewStatus = newStatus,
            ChangedByUserId = request.UserId,
            ChangedAt = DateTime.UtcNow,
            Reason = request.Reason
        };

        _context.SlotStatusHistory.Add(historyRecord);

        // Update slot status
        slot.CurrentStatus = newStatus;
        slot.LastStatusChange = DateTime.UtcNow;
        slot.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        // Broadcast slot status changed event via SignalR
        await _hubService.BroadcastSlotStatusChanged(new SlotStatusChangedEvent
        {
            SlotId = slot.Id,
            SlotNumber = slot.SlotNumber,
            ZoneId = zoneId,
            PreviousStatus = previousStatus.ToString(),
            NewStatus = newStatus.ToString(),
            ChangedAt = slot.LastStatusChange,
            ChangedBy = changedByUsername
        });

        // Calculate and broadcast zone occupancy update
        var zoneOccupancy = await CalculateZoneOccupancy(zoneId, cancellationToken);
        await _hubService.BroadcastZoneOccupancyUpdated(zoneOccupancy);

        // Calculate and broadcast parking area update
        var parkingAreaUpdate = await CalculateParkingAreaOccupancy(parkingAreaId, cancellationToken);
        await _hubService.BroadcastParkingAreaUpdated(parkingAreaUpdate);

        // Return updated slot
        return new ParkingSlotDto
        {
            Id = slot.Id,
            ZoneId = slot.ZoneId,
            ZoneName = slot.Zone.Name,
            ParkingAreaName = slot.Zone.ParkingArea?.Name,
            SlotNumber = slot.SlotNumber,
            CurrentStatus = slot.CurrentStatus.ToString(),
            VehicleType = slot.VehicleType.ToString(),
            LastStatusChange = slot.LastStatusChange,
            XCoordinate = slot.XCoordinate,
            YCoordinate = slot.YCoordinate,
            IsSensorEnabled = slot.IsSensorEnabled,
            CreatedAt = slot.CreatedAt,
            UpdatedAt = slot.UpdatedAt
        };
    }

    private async Task<ZoneOccupancyUpdatedEvent> CalculateZoneOccupancy(Guid zoneId, CancellationToken cancellationToken)
    {
        var slots = await _context.ParkingSlots
            .Where(ps => ps.ZoneId == zoneId && !ps.IsDeleted)
            .ToListAsync(cancellationToken);

        var totalSlots = slots.Count;
        var availableSlots = slots.Count(s => s.CurrentStatus == SlotStatus.Available);
        var occupiedSlots = slots.Count(s => s.CurrentStatus == SlotStatus.Occupied);
        var maintenanceSlots = slots.Count(s => s.CurrentStatus == SlotStatus.Maintenance);

        var occupancyPercentage = totalSlots > 0
            ? (decimal)occupiedSlots / totalSlots * 100
            : 0;

        return new ZoneOccupancyUpdatedEvent
        {
            ZoneId = zoneId,
            TotalSlots = totalSlots,
            AvailableSlots = availableSlots,
            OccupiedSlots = occupiedSlots,
            MaintenanceSlots = maintenanceSlots,
            OccupancyPercentage = Math.Round(occupancyPercentage, 2)
        };
    }

    private async Task<ParkingAreaUpdatedEvent> CalculateParkingAreaOccupancy(Guid parkingAreaId, CancellationToken cancellationToken)
    {
        var slots = await _context.ParkingSlots
            .Include(ps => ps.Zone)
            .Where(ps => ps.Zone.ParkingAreaId == parkingAreaId && !ps.IsDeleted && !ps.Zone.IsDeleted)
            .ToListAsync(cancellationToken);

        var totalSlots = slots.Count;
        var availableSlots = slots.Count(s => s.CurrentStatus == SlotStatus.Available);
        var occupiedSlots = slots.Count(s => s.CurrentStatus == SlotStatus.Occupied);
        var maintenanceSlots = slots.Count(s => s.CurrentStatus == SlotStatus.Maintenance);

        return new ParkingAreaUpdatedEvent
        {
            ParkingAreaId = parkingAreaId,
            TotalSlots = totalSlots,
            AvailableSlots = availableSlots,
            OccupiedSlots = occupiedSlots,
            MaintenanceSlots = maintenanceSlots
        };
    }
}

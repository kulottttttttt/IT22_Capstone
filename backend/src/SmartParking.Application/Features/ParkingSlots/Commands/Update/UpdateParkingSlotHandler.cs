using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartParking.Application.Common.DTOs.ParkingSlot;
using SmartParking.Application.Common.Interfaces;
using SmartParking.Domain.Enums;

namespace SmartParking.Application.Features.ParkingSlots.Commands.Update;

public class UpdateParkingSlotHandler : IRequestHandler<UpdateParkingSlotCommand, ParkingSlotDto>
{
    private readonly IApplicationDbContext _context;

    public UpdateParkingSlotHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ParkingSlotDto> Handle(UpdateParkingSlotCommand request, CancellationToken cancellationToken)
    {
        var parkingSlot = await _context.ParkingSlots
            .FirstOrDefaultAsync(ps => ps.Id == request.Id && !ps.IsDeleted, cancellationToken);

        if (parkingSlot == null)
        {
            throw new KeyNotFoundException($"Parking slot with ID {request.Id} not found.");
        }

        // Validate zone exists if changed
        if (parkingSlot.ZoneId != request.ZoneId)
        {
            var zoneExists = await _context.Zones
                .AnyAsync(z => z.Id == request.ZoneId && !z.IsDeleted, cancellationToken);

            if (!zoneExists)
            {
                throw new KeyNotFoundException($"Zone with ID {request.ZoneId} not found.");
            }
        }

        // Validate slot number uniqueness if changed
        if (parkingSlot.SlotNumber != request.SlotNumber)
        {
            var slotExists = await _context.ParkingSlots
                .AnyAsync(ps => ps.SlotNumber == request.SlotNumber && ps.Id != request.Id && !ps.IsDeleted, cancellationToken);

            if (slotExists)
            {
                throw new InvalidOperationException($"Slot number {request.SlotNumber} already exists.");
            }
        }

        // Parse vehicle type enum
        if (!Enum.TryParse<VehicleType>(request.VehicleType, out var vehicleType))
        {
            throw new ArgumentException($"Invalid vehicle type: {request.VehicleType}");
        }

        parkingSlot.ZoneId = request.ZoneId;
        parkingSlot.SlotNumber = request.SlotNumber;
        parkingSlot.VehicleType = vehicleType;
        parkingSlot.XCoordinate = request.XCoordinate;
        parkingSlot.YCoordinate = request.YCoordinate;
        parkingSlot.IsSensorEnabled = request.IsSensorEnabled;
        parkingSlot.UpdatedAt = DateTime.UtcNow;
        // TODO: Add audit logging when available - UpdatedBy = currentUserId

        await _context.SaveChangesAsync(cancellationToken);

        return new ParkingSlotDto
        {
            Id = parkingSlot.Id,
            ZoneId = parkingSlot.ZoneId,
            SlotNumber = parkingSlot.SlotNumber,
            VehicleType = parkingSlot.VehicleType.ToString(),
            CurrentStatus = parkingSlot.CurrentStatus.ToString(),
            LastStatusChange = parkingSlot.LastStatusChange,
            XCoordinate = parkingSlot.XCoordinate,
            YCoordinate = parkingSlot.YCoordinate,
            IsSensorEnabled = parkingSlot.IsSensorEnabled,
            CreatedAt = parkingSlot.CreatedAt,
            UpdatedAt = parkingSlot.UpdatedAt
        };
    }
}

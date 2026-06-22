using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartParking.Application.Common.DTOs.ParkingSlot;
using SmartParking.Application.Common.Interfaces;
using SmartParking.Domain.Entities;
using SmartParking.Domain.Enums;

namespace SmartParking.Application.Features.ParkingSlots.Commands.Create;

public class CreateParkingSlotHandler : IRequestHandler<CreateParkingSlotCommand, ParkingSlotDto>
{
    private readonly IApplicationDbContext _context;

    public CreateParkingSlotHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ParkingSlotDto> Handle(CreateParkingSlotCommand request, CancellationToken cancellationToken)
    {
        // Validate zone exists
        var zoneExists = await _context.Zones
            .AnyAsync(z => z.Id == request.ZoneId && !z.IsDeleted, cancellationToken);

        if (!zoneExists)
        {
            throw new KeyNotFoundException($"Zone with ID {request.ZoneId} not found.");
        }

        // Validate slot number uniqueness
        var slotExists = await _context.ParkingSlots
            .AnyAsync(ps => ps.SlotNumber == request.SlotNumber && !ps.IsDeleted, cancellationToken);

        if (slotExists)
        {
            throw new InvalidOperationException($"Slot number {request.SlotNumber} already exists.");
        }

        // Parse vehicle type enum
        if (!Enum.TryParse<VehicleType>(request.VehicleType, out var vehicleType))
        {
            throw new ArgumentException($"Invalid vehicle type: {request.VehicleType}");
        }

        var parkingSlot = new ParkingSlot
        {
            Id = Guid.NewGuid(),
            ZoneId = request.ZoneId,
            SlotNumber = request.SlotNumber,
            VehicleType = vehicleType,
            CurrentStatus = SlotStatus.Available,
            LastStatusChange = DateTime.UtcNow,
            XCoordinate = request.XCoordinate,
            YCoordinate = request.YCoordinate,
            IsSensorEnabled = request.IsSensorEnabled,
            CreatedAt = DateTime.UtcNow
            // TODO: Add audit logging when available - CreatedBy = currentUserId
        };

        _context.ParkingSlots.Add(parkingSlot);
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

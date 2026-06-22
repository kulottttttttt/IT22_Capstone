using MediatR;
using SmartParking.Application.Common.DTOs.ParkingSlot;

namespace SmartParking.Application.Features.ParkingSlots.Commands.Update;

public class UpdateParkingSlotCommand : IRequest<ParkingSlotDto>
{
    public Guid Id { get; set; }
    public Guid ZoneId { get; set; }
    public string SlotNumber { get; set; } = string.Empty;
    public string VehicleType { get; set; } = string.Empty;
    public decimal XCoordinate { get; set; }
    public decimal YCoordinate { get; set; }
    public bool IsSensorEnabled { get; set; }
}

namespace SmartParking.Application.Common.DTOs.ParkingSlot;

public class CreateParkingSlotDto
{
    public Guid ZoneId { get; set; }
    public string SlotNumber { get; set; } = string.Empty;
    public string VehicleType { get; set; } = string.Empty;
    public decimal XCoordinate { get; set; }
    public decimal YCoordinate { get; set; }
    public bool IsSensorEnabled { get; set; }
}

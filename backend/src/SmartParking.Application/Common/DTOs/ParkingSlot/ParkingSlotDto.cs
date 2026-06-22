namespace SmartParking.Application.Common.DTOs.ParkingSlot;

public class ParkingSlotDto
{
    public Guid Id { get; set; }
    public Guid ZoneId { get; set; }
    public string? ZoneName { get; set; }
    public string? ParkingAreaName { get; set; }
    public string SlotNumber { get; set; } = string.Empty;
    public string VehicleType { get; set; } = string.Empty;
    public string CurrentStatus { get; set; } = string.Empty;
    public DateTime LastStatusChange { get; set; }
    public decimal XCoordinate { get; set; }
    public decimal YCoordinate { get; set; }
    public bool IsSensorEnabled { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

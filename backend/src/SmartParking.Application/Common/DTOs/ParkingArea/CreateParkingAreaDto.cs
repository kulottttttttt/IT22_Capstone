namespace SmartParking.Application.Common.DTOs.ParkingArea;

/// <summary>
/// Data transfer object for creating a parking area.
/// </summary>
public class CreateParkingAreaDto
{
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string? Description { get; set; }
}

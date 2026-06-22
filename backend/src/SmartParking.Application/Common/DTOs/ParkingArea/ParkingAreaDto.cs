namespace SmartParking.Application.Common.DTOs.ParkingArea;

/// <summary>
/// Data transfer object for parking area information.
/// </summary>
public class ParkingAreaDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int TotalCapacity { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

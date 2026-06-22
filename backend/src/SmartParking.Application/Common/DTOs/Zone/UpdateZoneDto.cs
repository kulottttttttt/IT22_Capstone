namespace SmartParking.Application.Common.DTOs.Zone;

public class UpdateZoneDto
{
    public Guid ParkingAreaId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string MapColorHex { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}

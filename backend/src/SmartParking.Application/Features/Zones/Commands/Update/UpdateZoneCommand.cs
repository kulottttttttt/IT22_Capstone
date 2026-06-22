using MediatR;
using SmartParking.Application.Common.DTOs.Zone;

namespace SmartParking.Application.Features.Zones.Commands.Update;

public class UpdateZoneCommand : IRequest<ZoneDto>
{
    public Guid Id { get; set; }
    public Guid ParkingAreaId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string MapColorHex { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}

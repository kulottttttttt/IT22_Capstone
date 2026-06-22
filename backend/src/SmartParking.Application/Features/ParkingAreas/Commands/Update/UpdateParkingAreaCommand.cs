using MediatR;
using SmartParking.Application.Common.DTOs.ParkingArea;

namespace SmartParking.Application.Features.ParkingAreas.Commands.Update;

public class UpdateParkingAreaCommand : IRequest<ParkingAreaDto>
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string? Description { get; set; }
}

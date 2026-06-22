using MediatR;
using SmartParking.Application.Common.DTOs.ParkingArea;

namespace SmartParking.Application.Features.ParkingAreas.Commands.Create;

public class CreateParkingAreaCommand : IRequest<ParkingAreaDto>
{
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string? Description { get; set; }
}

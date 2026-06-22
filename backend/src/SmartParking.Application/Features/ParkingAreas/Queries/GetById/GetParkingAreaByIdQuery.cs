using MediatR;
using SmartParking.Application.Common.DTOs.ParkingArea;

namespace SmartParking.Application.Features.ParkingAreas.Queries.GetById;

public class GetParkingAreaByIdQuery : IRequest<ParkingAreaDto>
{
    public Guid Id { get; set; }
}

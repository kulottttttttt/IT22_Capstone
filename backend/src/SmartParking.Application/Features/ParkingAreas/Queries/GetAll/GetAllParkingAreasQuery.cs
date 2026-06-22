using MediatR;
using SmartParking.Application.Common.DTOs.ParkingArea;

namespace SmartParking.Application.Features.ParkingAreas.Queries.GetAll;

public class GetAllParkingAreasQuery : IRequest<List<ParkingAreaDto>>
{
}

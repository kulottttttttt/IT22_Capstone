using FluentValidation;

namespace SmartParking.Application.Features.Zones.Queries.GetByParkingAreaId;

public class GetZonesByParkingAreaIdValidator : AbstractValidator<GetZonesByParkingAreaIdQuery>
{
    public GetZonesByParkingAreaIdValidator()
    {
        RuleFor(x => x.ParkingAreaId)
            .NotEmpty().WithMessage("Parking Area ID is required.");
    }
}

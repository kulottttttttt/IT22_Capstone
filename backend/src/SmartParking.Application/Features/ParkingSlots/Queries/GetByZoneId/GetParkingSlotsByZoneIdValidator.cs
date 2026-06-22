using FluentValidation;

namespace SmartParking.Application.Features.ParkingSlots.Queries.GetByZoneId;

public class GetParkingSlotsByZoneIdValidator : AbstractValidator<GetParkingSlotsByZoneIdQuery>
{
    public GetParkingSlotsByZoneIdValidator()
    {
        RuleFor(x => x.ZoneId)
            .NotEmpty().WithMessage("Zone ID is required.");
    }
}

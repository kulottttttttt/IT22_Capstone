using FluentValidation;

namespace SmartParking.Application.Features.ParkingSlots.Queries.GetById;

public class GetParkingSlotByIdValidator : AbstractValidator<GetParkingSlotByIdQuery>
{
    public GetParkingSlotByIdValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Parking slot ID is required.");
    }
}

using FluentValidation;

namespace SmartParking.Application.Features.ParkingAreas.Queries.GetById;

public class GetParkingAreaByIdValidator : AbstractValidator<GetParkingAreaByIdQuery>
{
    public GetParkingAreaByIdValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Id is required.");
    }
}

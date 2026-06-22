using FluentValidation;

namespace SmartParking.Application.Features.ParkingAreas.Commands.Delete;

public class DeleteParkingAreaValidator : AbstractValidator<DeleteParkingAreaCommand>
{
    public DeleteParkingAreaValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Id is required.");
    }
}

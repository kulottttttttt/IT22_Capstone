using FluentValidation;

namespace SmartParking.Application.Features.ParkingSlots.Commands.Delete;

public class DeleteParkingSlotValidator : AbstractValidator<DeleteParkingSlotCommand>
{
    public DeleteParkingSlotValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Id is required.");
    }
}

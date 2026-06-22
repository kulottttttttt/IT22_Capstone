using FluentValidation;

namespace SmartParking.Application.Features.Zones.Commands.Delete;

public class DeleteZoneValidator : AbstractValidator<DeleteZoneCommand>
{
    public DeleteZoneValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Id is required.");
    }
}

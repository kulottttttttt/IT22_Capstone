using FluentValidation;
using System.Text.RegularExpressions;

namespace SmartParking.Application.Features.Zones.Commands.Update;

public class UpdateZoneValidator : AbstractValidator<UpdateZoneCommand>
{
    public UpdateZoneValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Id is required.");

        RuleFor(x => x.ParkingAreaId)
            .NotEmpty().WithMessage("Parking Area ID is required.");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.")
            .MaximumLength(50).WithMessage("Name must not exceed 50 characters.");

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters.")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.MapColorHex)
            .NotEmpty().WithMessage("Map color is required.")
            .Matches("^#[0-9A-Fa-f]{6}$").WithMessage("Map color must be a valid hex color (e.g., #3B82F6).");

        RuleFor(x => x.SortOrder)
            .GreaterThanOrEqualTo(0).WithMessage("Sort order must be >= 0.");
    }
}

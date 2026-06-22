using FluentValidation;

namespace SmartParking.Application.Features.ParkingSlots.Commands.UpdateStatus;

public class UpdateSlotStatusValidator : AbstractValidator<UpdateSlotStatusCommand>
{
    private static readonly string[] ValidStatuses = { "Available", "Occupied", "Maintenance" };

    public UpdateSlotStatusValidator()
    {
        RuleFor(x => x.SlotId)
            .NotEmpty().WithMessage("Slot ID is required.");

        RuleFor(x => x.Status)
            .NotEmpty().WithMessage("Status is required.")
            .Must(status => ValidStatuses.Contains(status))
            .WithMessage("Status must be one of: Available, Occupied, Maintenance.");

        RuleFor(x => x.Reason)
            .MaximumLength(500).WithMessage("Reason cannot exceed 500 characters.");

        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID is required.");
    }
}

using FluentValidation;

namespace SmartParking.Application.Features.ParkingSlots.Commands.Update;

public class UpdateParkingSlotValidator : AbstractValidator<UpdateParkingSlotCommand>
{
    public UpdateParkingSlotValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Id is required.");

        RuleFor(x => x.ZoneId)
            .NotEmpty().WithMessage("Zone ID is required.");

        RuleFor(x => x.SlotNumber)
            .NotEmpty().WithMessage("Slot number is required.")
            .MaximumLength(10).WithMessage("Slot number must not exceed 10 characters.");

        RuleFor(x => x.VehicleType)
            .NotEmpty().WithMessage("Vehicle type is required.")
            .Must(vt => vt == "Car" || vt == "Motorcycle" || vt == "SUV" || vt == "Truck")
            .WithMessage("Vehicle type must be Car, Motorcycle, SUV, or Truck.");

        RuleFor(x => x.XCoordinate)
            .GreaterThanOrEqualTo(0).WithMessage("X coordinate must be >= 0.")
            .LessThan(10000).WithMessage("X coordinate must be < 10000.");

        RuleFor(x => x.YCoordinate)
            .GreaterThanOrEqualTo(0).WithMessage("Y coordinate must be >= 0.")
            .LessThan(10000).WithMessage("Y coordinate must be < 10000.");
    }
}

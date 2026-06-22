using FluentValidation;

namespace SmartParking.Application.Features.ParkingSlots.Queries.GetHistory;

public class GetSlotHistoryValidator : AbstractValidator<GetSlotHistoryQuery>
{
    public GetSlotHistoryValidator()
    {
        RuleFor(x => x.SlotId)
            .NotEmpty().WithMessage("Slot ID is required.");
    }
}

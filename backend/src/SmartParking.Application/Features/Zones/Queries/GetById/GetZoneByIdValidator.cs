using FluentValidation;

namespace SmartParking.Application.Features.Zones.Queries.GetById;

public class GetZoneByIdValidator : AbstractValidator<GetZoneByIdQuery>
{
    public GetZoneByIdValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Zone ID is required.");
    }
}

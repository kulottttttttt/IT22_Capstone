using MediatR;
using SmartParking.Application.Common.DTOs.Prediction;

namespace SmartParking.Application.Features.Predictions.Queries.GetZonePrediction;

/// <summary>
/// Query to get prediction data for a specific zone.
/// </summary>
public class GetZonePredictionQuery : IRequest<ZonePredictionDto>
{
    /// <summary>
    /// Gets or sets the zone identifier.
    /// </summary>
    public Guid ZoneId { get; set; }
}

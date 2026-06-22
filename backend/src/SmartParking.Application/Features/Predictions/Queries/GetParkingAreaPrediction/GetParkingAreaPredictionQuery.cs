using MediatR;
using SmartParking.Application.Common.DTOs.Prediction;

namespace SmartParking.Application.Features.Predictions.Queries.GetParkingAreaPrediction;

/// <summary>
/// Query to get prediction data for a specific parking area.
/// </summary>
public class GetParkingAreaPredictionQuery : IRequest<ParkingAreaPredictionDto>
{
    /// <summary>
    /// Gets or sets the parking area identifier.
    /// </summary>
    public Guid ParkingAreaId { get; set; }
}

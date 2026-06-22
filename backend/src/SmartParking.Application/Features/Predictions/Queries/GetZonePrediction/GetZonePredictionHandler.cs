using MediatR;
using SmartParking.Application.Common.DTOs.Prediction;
using SmartParking.Application.Common.Interfaces;

namespace SmartParking.Application.Features.Predictions.Queries.GetZonePrediction;

/// <summary>
/// Handler for getting zone prediction data.
/// </summary>
public class GetZonePredictionHandler : IRequestHandler<GetZonePredictionQuery, ZonePredictionDto>
{
    private readonly IPredictionService _predictionService;

    public GetZonePredictionHandler(IPredictionService predictionService)
    {
        _predictionService = predictionService;
    }

    public async Task<ZonePredictionDto> Handle(GetZonePredictionQuery request, CancellationToken cancellationToken)
    {
        return await _predictionService.PredictZoneOccupancyAsync(request.ZoneId, cancellationToken);
    }
}

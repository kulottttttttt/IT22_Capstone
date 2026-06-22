using MediatR;
using SmartParking.Application.Common.DTOs.Prediction;
using SmartParking.Application.Common.Interfaces;

namespace SmartParking.Application.Features.Predictions.Queries.GetParkingAreaPrediction;

/// <summary>
/// Handler for getting parking area prediction data.
/// </summary>
public class GetParkingAreaPredictionHandler : IRequestHandler<GetParkingAreaPredictionQuery, ParkingAreaPredictionDto>
{
    private readonly IPredictionService _predictionService;

    public GetParkingAreaPredictionHandler(IPredictionService predictionService)
    {
        _predictionService = predictionService;
    }

    public async Task<ParkingAreaPredictionDto> Handle(GetParkingAreaPredictionQuery request, CancellationToken cancellationToken)
    {
        return await _predictionService.PredictParkingAreaOccupancyAsync(request.ParkingAreaId, cancellationToken);
    }
}

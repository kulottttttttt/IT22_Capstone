using MediatR;
using SmartParking.Application.Common.DTOs.Prediction;
using SmartParking.Application.Common.Interfaces;

namespace SmartParking.Application.Features.Predictions.Queries.GetDashboardPrediction;

/// <summary>
/// Handler for getting dashboard prediction data.
/// </summary>
public class GetDashboardPredictionHandler : IRequestHandler<GetDashboardPredictionQuery, DashboardPredictionDto>
{
    private readonly IPredictionService _predictionService;

    public GetDashboardPredictionHandler(IPredictionService predictionService)
    {
        _predictionService = predictionService;
    }

    public async Task<DashboardPredictionDto> Handle(GetDashboardPredictionQuery request, CancellationToken cancellationToken)
    {
        return await _predictionService.PredictDashboardOccupancyAsync(cancellationToken);
    }
}

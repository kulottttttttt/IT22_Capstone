using MediatR;
using SmartParking.Application.Common.DTOs.Prediction;

namespace SmartParking.Application.Features.Predictions.Queries.GetDashboardPrediction;

/// <summary>
/// Query to get dashboard-wide prediction data.
/// </summary>
public class GetDashboardPredictionQuery : IRequest<DashboardPredictionDto>
{
}

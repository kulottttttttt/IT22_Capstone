using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartParking.Application.Common.DTOs.Prediction;
using SmartParking.Application.Features.Predictions.Queries.GetDashboardPrediction;
using SmartParking.Application.Features.Predictions.Queries.GetParkingAreaPrediction;
using SmartParking.Application.Features.Predictions.Queries.GetZonePrediction;

namespace SmartParking.Presentation.Controllers;

/// <summary>
/// Controller for managing predictive occupancy analytics.
/// </summary>
[ApiController]
[Route("api/predictions")]
[Produces("application/json")]
public class PredictionsController : ControllerBase
{
    private readonly ISender _sender;

    public PredictionsController(ISender sender)
    {
        _sender = sender;
    }

    /// <summary>
    /// Gets predictive occupancy analytics for a specific zone.
    /// </summary>
    /// <param name="zoneId">The zone identifier.</param>
    /// <returns>Zone prediction data including 30min, 1hr, and 2hr forecasts.</returns>
    /// <response code="200">Returns the zone prediction data.</response>
    /// <response code="404">Zone not found.</response>
    [HttpGet("zones/{zoneId:guid}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ZonePredictionDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ZonePredictionDto>> GetZonePrediction(Guid zoneId)
    {
        try
        {
            var query = new GetZonePredictionQuery { ZoneId = zoneId };
            var result = await _sender.Send(query);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Gets predictive occupancy analytics for a specific parking area.
    /// </summary>
    /// <param name="parkingAreaId">The parking area identifier.</param>
    /// <returns>Parking area prediction data including zone breakdowns.</returns>
    /// <response code="200">Returns the parking area prediction data.</response>
    /// <response code="404">Parking area not found.</response>
    [HttpGet("parking-areas/{parkingAreaId:guid}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ParkingAreaPredictionDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ParkingAreaPredictionDto>> GetParkingAreaPrediction(Guid parkingAreaId)
    {
        try
        {
            var query = new GetParkingAreaPredictionQuery { ParkingAreaId = parkingAreaId };
            var result = await _sender.Send(query);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Gets dashboard-wide predictive occupancy analytics across all parking areas.
    /// </summary>
    /// <returns>Dashboard prediction data with parking area breakdowns.</returns>
    /// <response code="200">Returns the dashboard prediction data.</response>
    [HttpGet("dashboard")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(DashboardPredictionDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<DashboardPredictionDto>> GetDashboardPrediction()
    {
        var query = new GetDashboardPredictionQuery();
        var result = await _sender.Send(query);
        return Ok(result);
    }
}

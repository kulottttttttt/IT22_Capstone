using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartParking.Application.Common.DTOs.Zone;
using SmartParking.Application.Features.Zones.Commands.Create;
using SmartParking.Application.Features.Zones.Commands.Delete;
using SmartParking.Application.Features.Zones.Commands.Update;
using SmartParking.Application.Features.Zones.Queries.GetAll;
using SmartParking.Application.Features.Zones.Queries.GetById;
using SmartParking.Application.Features.Zones.Queries.GetByParkingAreaId;

namespace SmartParking.Presentation.Controllers;

/// <summary>
/// Controller for managing zones within parking areas.
/// </summary>
[ApiController]
[Route("api/zones")]
public class ZonesController : ControllerBase
{
    private readonly IMediator _mediator;

    public ZonesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Gets all zones.
    /// </summary>
    /// <returns>List of zones.</returns>
    [HttpGet]
    [AllowAnonymous] // Guest users can view
    public async Task<ActionResult<List<ZoneDto>>> GetAll()
    {
        var result = await _mediator.Send(new GetAllZonesQuery());
        return Ok(result);
    }

    /// <summary>
    /// Gets a zone by ID.
    /// </summary>
    /// <param name="id">Zone ID.</param>
    /// <returns>Zone details.</returns>
    [HttpGet("{id}")]
    [AllowAnonymous] // Guest users can view
    public async Task<ActionResult<ZoneDto>> GetById(Guid id)
    {
        try
        {
            var result = await _mediator.Send(new GetZoneByIdQuery { Id = id });
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Gets all zones for a parking area.
    /// </summary>
    /// <param name="parkingAreaId">Parking area ID.</param>
    /// <returns>List of zones in the parking area.</returns>
    [HttpGet("/api/parking-areas/{parkingAreaId}/zones")]
    [AllowAnonymous] // Guest users can view
    public async Task<ActionResult<List<ZoneDto>>> GetByParkingAreaId(Guid parkingAreaId)
    {
        var result = await _mediator.Send(new GetZonesByParkingAreaIdQuery { ParkingAreaId = parkingAreaId });
        return Ok(result);
    }

    /// <summary>
    /// Creates a new zone.
    /// </summary>
    /// <param name="dto">Zone creation data.</param>
    /// <returns>Created zone.</returns>
    [HttpPost]
    [Authorize(Policy = "AdminOrHigher")] // Admin and SuperAdmin only
    public async Task<ActionResult<ZoneDto>> Create([FromBody] CreateZoneDto dto)
    {
        try
        {
            var command = new CreateZoneCommand
            {
                ParkingAreaId = dto.ParkingAreaId,
                Name = dto.Name,
                Description = dto.Description,
                MapColorHex = dto.MapColorHex,
                SortOrder = dto.SortOrder
            };

            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Updates an existing zone.
    /// </summary>
    /// <param name="id">Zone ID.</param>
    /// <param name="dto">Updated zone data.</param>
    /// <returns>Updated zone.</returns>
    [HttpPut("{id}")]
    [Authorize(Policy = "AdminOrHigher")] // Admin and SuperAdmin only
    public async Task<ActionResult<ZoneDto>> Update(Guid id, [FromBody] UpdateZoneDto dto)
    {
        try
        {
            var command = new UpdateZoneCommand
            {
                Id = id,
                ParkingAreaId = dto.ParkingAreaId,
                Name = dto.Name,
                Description = dto.Description,
                MapColorHex = dto.MapColorHex,
                SortOrder = dto.SortOrder
            };

            var result = await _mediator.Send(command);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Deletes a zone (soft delete).
    /// </summary>
    /// <param name="id">Zone ID.</param>
    /// <returns>Success status.</returns>
    [HttpDelete("{id}")]
    [Authorize(Policy = "AdminOrHigher")] // Admin and SuperAdmin only
    public async Task<ActionResult> Delete(Guid id)
    {
        try
        {
            await _mediator.Send(new DeleteZoneCommand { Id = id });
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}

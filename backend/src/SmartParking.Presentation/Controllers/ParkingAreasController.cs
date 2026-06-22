using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartParking.Application.Common.DTOs.ParkingArea;
using SmartParking.Application.Features.ParkingAreas.Commands.Create;
using SmartParking.Application.Features.ParkingAreas.Commands.Delete;
using SmartParking.Application.Features.ParkingAreas.Commands.Update;
using SmartParking.Application.Features.ParkingAreas.Queries.GetAll;
using SmartParking.Application.Features.ParkingAreas.Queries.GetById;

namespace SmartParking.Presentation.Controllers;

/// <summary>
/// Controller for managing parking areas.
/// </summary>
[ApiController]
[Route("api/parking-areas")]
public class ParkingAreasController : ControllerBase
{
    private readonly IMediator _mediator;

    public ParkingAreasController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Gets all parking areas.
    /// </summary>
    /// <returns>List of parking areas.</returns>
    [HttpGet]
    [AllowAnonymous] // Guest users can view
    public async Task<ActionResult<List<ParkingAreaDto>>> GetAll()
    {
        var result = await _mediator.Send(new GetAllParkingAreasQuery());
        return Ok(result);
    }

    /// <summary>
    /// Gets a parking area by ID.
    /// </summary>
    /// <param name="id">Parking area ID.</param>
    /// <returns>Parking area details.</returns>
    [HttpGet("{id}")]
    [AllowAnonymous] // Guest users can view
    public async Task<ActionResult<ParkingAreaDto>> GetById(Guid id)
    {
        try
        {
            var result = await _mediator.Send(new GetParkingAreaByIdQuery { Id = id });
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Creates a new parking area.
    /// </summary>
    /// <param name="dto">Parking area creation data.</param>
    /// <returns>Created parking area.</returns>
    [HttpPost]
    [Authorize(Policy = "AdminOrHigher")] // Admin and SuperAdmin only
    public async Task<ActionResult<ParkingAreaDto>> Create([FromBody] CreateParkingAreaDto dto)
    {
        var command = new CreateParkingAreaCommand
        {
            Name = dto.Name,
            Address = dto.Address,
            Description = dto.Description
        };

        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    /// <summary>
    /// Updates an existing parking area.
    /// </summary>
    /// <param name="id">Parking area ID.</param>
    /// <param name="dto">Updated parking area data.</param>
    /// <returns>Updated parking area.</returns>
    [HttpPut("{id}")]
    [Authorize(Policy = "AdminOrHigher")] // Admin and SuperAdmin only
    public async Task<ActionResult<ParkingAreaDto>> Update(Guid id, [FromBody] UpdateParkingAreaDto dto)
    {
        try
        {
            var command = new UpdateParkingAreaCommand
            {
                Id = id,
                Name = dto.Name,
                Address = dto.Address,
                Description = dto.Description
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
    /// Deletes a parking area (soft delete).
    /// </summary>
    /// <param name="id">Parking area ID.</param>
    /// <returns>Success status.</returns>
    [HttpDelete("{id}")]
    [Authorize(Policy = "AdminOrHigher")] // Admin and SuperAdmin only
    public async Task<ActionResult> Delete(Guid id)
    {
        try
        {
            await _mediator.Send(new DeleteParkingAreaCommand { Id = id });
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}

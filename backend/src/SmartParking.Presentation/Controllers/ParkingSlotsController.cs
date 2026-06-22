using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartParking.Application.Common.DTOs.ParkingSlot;
using SmartParking.Application.Common.DTOs.SlotStatus;
using SmartParking.Application.Features.ParkingSlots.Commands.Create;
using SmartParking.Application.Features.ParkingSlots.Commands.Delete;
using SmartParking.Application.Features.ParkingSlots.Commands.Update;
using SmartParking.Application.Features.ParkingSlots.Commands.UpdateStatus;
using SmartParking.Application.Features.ParkingSlots.Queries.GetAll;
using SmartParking.Application.Features.ParkingSlots.Queries.GetAllHistory;
using SmartParking.Application.Features.ParkingSlots.Queries.GetById;
using SmartParking.Application.Features.ParkingSlots.Queries.GetByZoneId;
using SmartParking.Application.Features.ParkingSlots.Queries.GetHistory;
using System.Security.Claims;

namespace SmartParking.Presentation.Controllers;

/// <summary>
/// Controller for managing parking slots within zones.
/// </summary>
[ApiController]
[Route("api/parking-slots")]
public class ParkingSlotsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ParkingSlotsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Gets all parking slots.
    /// </summary>
    /// <returns>List of parking slots.</returns>
    [HttpGet]
    [AllowAnonymous] // Guest users can view
    public async Task<ActionResult<List<ParkingSlotDto>>> GetAll()
    {
        var result = await _mediator.Send(new GetAllParkingSlotsQuery());
        return Ok(result);
    }

    /// <summary>
    /// Gets a parking slot by ID.
    /// </summary>
    /// <param name="id">Parking slot ID.</param>
    /// <returns>Parking slot details.</returns>
    [HttpGet("{id}")]
    [AllowAnonymous] // Guest users can view
    public async Task<ActionResult<ParkingSlotDto>> GetById(Guid id)
    {
        try
        {
            var result = await _mediator.Send(new GetParkingSlotByIdQuery { Id = id });
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Gets all parking slots for a zone.
    /// </summary>
    /// <param name="zoneId">Zone ID.</param>
    /// <returns>List of parking slots in the zone.</returns>
    [HttpGet("/api/zones/{zoneId}/parking-slots")]
    [AllowAnonymous] // Guest users can view
    public async Task<ActionResult<List<ParkingSlotDto>>> GetByZoneId(Guid zoneId)
    {
        var result = await _mediator.Send(new GetParkingSlotsByZoneIdQuery { ZoneId = zoneId });
        return Ok(result);
    }

    /// <summary>
    /// Creates a new parking slot.
    /// </summary>
    /// <param name="dto">Parking slot creation data.</param>
    /// <returns>Created parking slot.</returns>
    [HttpPost]
    [Authorize(Policy = "AdminOrHigher")] // Admin and SuperAdmin only
    public async Task<ActionResult<ParkingSlotDto>> Create([FromBody] CreateParkingSlotDto dto)
    {
        try
        {
            var command = new CreateParkingSlotCommand
            {
                ZoneId = dto.ZoneId,
                SlotNumber = dto.SlotNumber,
                VehicleType = dto.VehicleType,
                XCoordinate = dto.XCoordinate,
                YCoordinate = dto.YCoordinate,
                IsSensorEnabled = dto.IsSensorEnabled
            };

            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Updates an existing parking slot.
    /// </summary>
    /// <param name="id">Parking slot ID.</param>
    /// <param name="dto">Updated parking slot data.</param>
    /// <returns>Updated parking slot.</returns>
    [HttpPut("{id}")]
    [Authorize(Policy = "AdminOrHigher")] // Admin and SuperAdmin only
    public async Task<ActionResult<ParkingSlotDto>> Update(Guid id, [FromBody] UpdateParkingSlotDto dto)
    {
        try
        {
            var command = new UpdateParkingSlotCommand
            {
                Id = id,
                ZoneId = dto.ZoneId,
                SlotNumber = dto.SlotNumber,
                VehicleType = dto.VehicleType,
                XCoordinate = dto.XCoordinate,
                YCoordinate = dto.YCoordinate,
                IsSensorEnabled = dto.IsSensorEnabled
            };

            var result = await _mediator.Send(command);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Deletes a parking slot (soft delete).
    /// </summary>
    /// <param name="id">Parking slot ID.</param>
    /// <returns>Success status.</returns>
    [HttpDelete("{id}")]
    [Authorize(Policy = "AdminOrHigher")] // Admin and SuperAdmin only
    public async Task<ActionResult> Delete(Guid id)
    {
        try
        {
            await _mediator.Send(new DeleteParkingSlotCommand { Id = id });
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Updates the status of a parking slot.
    /// </summary>
    /// <param name="id">Parking slot ID.</param>
    /// <param name="dto">Status update data.</param>
    /// <returns>Updated parking slot.</returns>
    [HttpPost("{id}/status")]
    [Authorize(Policy = "StaffOrHigher")] // Staff, Admin, and SuperAdmin can update status
    public async Task<ActionResult<ParkingSlotDto>> UpdateStatus(Guid id, [FromBody] UpdateSlotStatusDto dto)
    {
        try
        {
            // Get current user ID from claims
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Invalid user authentication." });
            }

            var command = new UpdateSlotStatusCommand
            {
                SlotId = id,
                Status = dto.Status,
                Reason = dto.Reason,
                UserId = userId
            };

            var result = await _mediator.Send(command);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Gets the status change history for a specific parking slot.
    /// </summary>
    /// <param name="id">Parking slot ID.</param>
    /// <returns>List of status changes.</returns>
    [HttpGet("{id}/history")]
    [Authorize(Policy = "StaffOrHigher")] // Staff or higher can view history
    public async Task<ActionResult<List<SlotStatusHistoryDto>>> GetSlotHistory(Guid id)
    {
        try
        {
            var result = await _mediator.Send(new GetSlotHistoryQuery { SlotId = id });
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Gets the status change history for all parking slots.
    /// </summary>
    /// <returns>List of all status changes.</returns>
    [HttpGet("history")]
    [Authorize(Policy = "StaffOrHigher")] // Staff or higher can view history
    public async Task<ActionResult<List<SlotStatusHistoryDto>>> GetAllHistory()
    {
        var result = await _mediator.Send(new GetAllSlotHistoryQuery());
        return Ok(result);
    }
}

# PowerShell Script to Generate Remaining CRUD Files for Zones and ParkingSlots
# This follows the exact pattern established with ParkingAreas

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Generating Phase 3 CRUD Files" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$appPath = "src\SmartParking.Application"
$presPath = "src\SmartParking.Presentation"

# ==========================
# ZONES - Commands
# ==========================

Write-Host "Creating Zone Commands..." -ForegroundColor Yellow

# CreateZoneCommand
$content = @'
using MediatR;
using SmartParking.Application.Common.DTOs.Zone;

namespace SmartParking.Application.Features.Zones.Commands.Create;

public class CreateZoneCommand : IRequest<ZoneDto>
{
    public Guid ParkingAreaId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string MapColorHex { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}
'@
Set-Content -Path "$appPath\Features\Zones\Commands\Create\CreateZoneCommand.cs" -Value $content

# CreateZoneValidator
$content = @'
using FluentValidation;
using System.Text.RegularExpressions;

namespace SmartParking.Application.Features.Zones.Commands.Create;

public class CreateZoneValidator : AbstractValidator<CreateZoneCommand>
{
    public CreateZoneValidator()
    {
        RuleFor(x => x.ParkingAreaId)
            .NotEmpty().WithMessage("Parking Area ID is required.");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.")
            .MaximumLength(50).WithMessage("Name must not exceed 50 characters.");

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters.")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.MapColorHex)
            .NotEmpty().WithMessage("Map color is required.")
            .Matches("^#[0-9A-Fa-f]{6}$").WithMessage("Map color must be a valid hex color (e.g., #3B82F6).");

        RuleFor(x => x.SortOrder)
            .GreaterThanOrEqualTo(0).WithMessage("Sort order must be >= 0.");
    }
}
'@
Set-Content -Path "$appPath\Features\Zones\Commands\Create\CreateZoneValidator.cs" -Value $content

# CreateZoneHandler
$content = @'
using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartParking.Application.Common.DTOs.Zone;
using SmartParking.Application.Common.Interfaces;
using SmartParking.Domain.Entities;

namespace SmartParking.Application.Features.Zones.Commands.Create;

public class CreateZoneHandler : IRequestHandler<CreateZoneCommand, ZoneDto>
{
    private readonly IApplicationDbContext _context;

    public CreateZoneHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ZoneDto> Handle(CreateZoneCommand request, CancellationToken cancellationToken)
    {
        // Validate parking area exists
        var parkingAreaExists = await _context.ParkingAreas
            .AnyAsync(pa => pa.Id == request.ParkingAreaId && !pa.IsDeleted, cancellationToken);

        if (!parkingAreaExists)
        {
            throw new KeyNotFoundException($"Parking area with ID {request.ParkingAreaId} not found.");
        }

        var zone = new Zone
        {
            Id = Guid.NewGuid(),
            ParkingAreaId = request.ParkingAreaId,
            Name = request.Name,
            Description = request.Description,
            MapColorHex = request.MapColorHex,
            SortOrder = request.SortOrder,
            CreatedAt = DateTime.UtcNow
            // TODO: Add audit logging when available - CreatedBy = currentUserId
        };

        _context.Zones.Add(zone);
        await _context.SaveChangesAsync(cancellationToken);

        return new ZoneDto
        {
            Id = zone.Id,
            ParkingAreaId = zone.ParkingAreaId,
            Name = zone.Name,
            Description = zone.Description,
            MapColorHex = zone.MapColorHex,
            SortOrder = zone.SortOrder,
            CreatedAt = zone.CreatedAt,
            UpdatedAt = zone.UpdatedAt
        };
    }
}
'@
Set-Content -Path "$appPath\Features\Zones\Commands\Create\CreateZoneHandler.cs" -Value $content

# UpdateZoneCommand
$content = @'
using MediatR;
using SmartParking.Application.Common.DTOs.Zone;

namespace SmartParking.Application.Features.Zones.Commands.Update;

public class UpdateZoneCommand : IRequest<ZoneDto>
{
    public Guid Id { get; set; }
    public Guid ParkingAreaId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string MapColorHex { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}
'@
Set-Content -Path "$appPath\Features\Zones\Commands\Update\UpdateZoneCommand.cs" -Value $content

# UpdateZoneValidator
$content = @'
using FluentValidation;
using System.Text.RegularExpressions;

namespace SmartParking.Application.Features.Zones.Commands.Update;

public class UpdateZoneValidator : AbstractValidator<UpdateZoneCommand>
{
    public UpdateZoneValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Id is required.");

        RuleFor(x => x.ParkingAreaId)
            .NotEmpty().WithMessage("Parking Area ID is required.");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.")
            .MaximumLength(50).WithMessage("Name must not exceed 50 characters.");

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters.")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.MapColorHex)
            .NotEmpty().WithMessage("Map color is required.")
            .Matches("^#[0-9A-Fa-f]{6}$").WithMessage("Map color must be a valid hex color (e.g., #3B82F6).");

        RuleFor(x => x.SortOrder)
            .GreaterThanOrEqualTo(0).WithMessage("Sort order must be >= 0.");
    }
}
'@
Set-Content -Path "$appPath\Features\Zones\Commands\Update\UpdateZoneValidator.cs" -Value $content

# UpdateZoneHandler
$content = @'
using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartParking.Application.Common.DTOs.Zone;
using SmartParking.Application.Common.Interfaces;

namespace SmartParking.Application.Features.Zones.Commands.Update;

public class UpdateZoneHandler : IRequestHandler<UpdateZoneCommand, ZoneDto>
{
    private readonly IApplicationDbContext _context;

    public UpdateZoneHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ZoneDto> Handle(UpdateZoneCommand request, CancellationToken cancellationToken)
    {
        var zone = await _context.Zones
            .FirstOrDefaultAsync(z => z.Id == request.Id && !z.IsDeleted, cancellationToken);

        if (zone == null)
        {
            throw new KeyNotFoundException($"Zone with ID {request.Id} not found.");
        }

        // Validate parking area exists if changed
        if (zone.ParkingAreaId != request.ParkingAreaId)
        {
            var parkingAreaExists = await _context.ParkingAreas
                .AnyAsync(pa => pa.Id == request.ParkingAreaId && !pa.IsDeleted, cancellationToken);

            if (!parkingAreaExists)
            {
                throw new KeyNotFoundException($"Parking area with ID {request.ParkingAreaId} not found.");
            }
        }

        zone.ParkingAreaId = request.ParkingAreaId;
        zone.Name = request.Name;
        zone.Description = request.Description;
        zone.MapColorHex = request.MapColorHex;
        zone.SortOrder = request.SortOrder;
        zone.UpdatedAt = DateTime.UtcNow;
        // TODO: Add audit logging when available - UpdatedBy = currentUserId

        await _context.SaveChangesAsync(cancellationToken);

        return new ZoneDto
        {
            Id = zone.Id,
            ParkingAreaId = zone.ParkingAreaId,
            Name = zone.Name,
            Description = zone.Description,
            MapColorHex = zone.MapColorHex,
            SortOrder = zone.SortOrder,
            CreatedAt = zone.CreatedAt,
            UpdatedAt = zone.UpdatedAt
        };
    }
}
'@
Set-Content -Path "$appPath\Features\Zones\Commands\Update\UpdateZoneHandler.cs" -Value $content

# DeleteZoneCommand
$content = @'
using MediatR;

namespace SmartParking.Application.Features.Zones.Commands.Delete;

public class DeleteZoneCommand : IRequest<bool>
{
    public Guid Id { get; set; }
}
'@
Set-Content -Path "$appPath\Features\Zones\Commands\Delete\DeleteZoneCommand.cs" -Value $content

# DeleteZoneValidator
$content = @'
using FluentValidation;

namespace SmartParking.Application.Features.Zones.Commands.Delete;

public class DeleteZoneValidator : AbstractValidator<DeleteZoneCommand>
{
    public DeleteZoneValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Id is required.");
    }
}
'@
Set-Content -Path "$appPath\Features\Zones\Commands\Delete\DeleteZoneValidator.cs" -Value $content

# DeleteZoneHandler
$content = @'
using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartParking.Application.Common.Interfaces;

namespace SmartParking.Application.Features.Zones.Commands.Delete;

public class DeleteZoneHandler : IRequestHandler<DeleteZoneCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public DeleteZoneHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteZoneCommand request, CancellationToken cancellationToken)
    {
        var zone = await _context.Zones
            .FirstOrDefaultAsync(z => z.Id == request.Id && !z.IsDeleted, cancellationToken);

        if (zone == null)
        {
            throw new KeyNotFoundException($"Zone with ID {request.Id} not found.");
        }

        // Soft delete - preserve historical data
        zone.IsDeleted = true;
        zone.UpdatedAt = DateTime.UtcNow;
        // TODO: Add audit logging when available - DeletedBy = currentUserId

        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
'@
Set-Content -Path "$appPath\Features\Zones\Commands\Delete\DeleteZoneHandler.cs" -Value $content

Write-Host "✓ Zone Commands created" -ForegroundColor Green

# ==========================
# ZONES - Queries
# ==========================

Write-Host "Creating Zone Queries..." -ForegroundColor Yellow

# GetAllZonesQuery
$content = @'
using MediatR;
using SmartParking.Application.Common.DTOs.Zone;

namespace SmartParking.Application.Features.Zones.Queries.GetAll;

public class GetAllZonesQuery : IRequest<List<ZoneDto>>
{
}
'@
Set-Content -Path "$appPath\Features\Zones\Queries\GetAll\GetAllZonesQuery.cs" -Value $content

# GetAllZonesHandler
$content = @'
using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartParking.Application.Common.DTOs.Zone;
using SmartParking.Application.Common.Interfaces;

namespace SmartParking.Application.Features.Zones.Queries.GetAll;

public class GetAllZonesHandler : IRequestHandler<GetAllZonesQuery, List<ZoneDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAllZonesHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ZoneDto>> Handle(GetAllZonesQuery request, CancellationToken cancellationToken)
    {
        var zones = await _context.Zones
            .Where(z => !z.IsDeleted)
            .OrderBy(z => z.SortOrder)
            .ThenBy(z => z.Name)
            .Select(z => new ZoneDto
            {
                Id = z.Id,
                ParkingAreaId = z.ParkingAreaId,
                Name = z.Name,
                Description = z.Description,
                MapColorHex = z.MapColorHex,
                SortOrder = z.SortOrder,
                CreatedAt = z.CreatedAt,
                UpdatedAt = z.UpdatedAt
            })
            .ToListAsync(cancellationToken);

        return zones;
    }
}
'@
Set-Content -Path "$appPath\Features\Zones\Queries\GetAll\GetAllZonesHandler.cs" -Value $content

# GetZoneByIdQuery
$content = @'
using MediatR;
using SmartParking.Application.Common.DTOs.Zone;

namespace SmartParking.Application.Features.Zones.Queries.GetById;

public class GetZoneByIdQuery : IRequest<ZoneDto>
{
    public Guid Id { get; set; }
}
'@
Set-Content -Path "$appPath\Features\Zones\Queries\GetById\GetZoneByIdQuery.cs" -Value $content

# GetZoneByIdValidator
$content = @'
using FluentValidation;

namespace SmartParking.Application.Features.Zones.Queries.GetById;

public class GetZoneByIdValidator : AbstractValidator<GetZoneByIdQuery>
{
    public GetZoneByIdValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Id is required.");
    }
}
'@
Set-Content -Path "$appPath\Features\Zones\Queries\GetById\GetZoneByIdValidator.cs" -Value $content

# GetZoneByIdHandler
$content = @'
using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartParking.Application.Common.DTOs.Zone;
using SmartParking.Application.Common.Interfaces;

namespace SmartParking.Application.Features.Zones.Queries.GetById;

public class GetZoneByIdHandler : IRequestHandler<GetZoneByIdQuery, ZoneDto>
{
    private readonly IApplicationDbContext _context;

    public GetZoneByIdHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ZoneDto> Handle(GetZoneByIdQuery request, CancellationToken cancellationToken)
    {
        var zone = await _context.Zones
            .Where(z => z.Id == request.Id && !z.IsDeleted)
            .Select(z => new ZoneDto
            {
                Id = z.Id,
                ParkingAreaId = z.ParkingAreaId,
                Name = z.Name,
                Description = z.Description,
                MapColorHex = z.MapColorHex,
                SortOrder = z.SortOrder,
                CreatedAt = z.CreatedAt,
                UpdatedAt = z.UpdatedAt
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (zone == null)
        {
            throw new KeyNotFoundException($"Zone with ID {request.Id} not found.");
        }

        return zone;
    }
}
'@
Set-Content -Path "$appPath\Features\Zones\Queries\GetById\GetZoneByIdHandler.cs" -Value $content

# GetZonesByParkingAreaIdQuery
$content = @'
using MediatR;
using SmartParking.Application.Common.DTOs.Zone;

namespace SmartParking.Application.Features.Zones.Queries.GetByParkingAreaId;

public class GetZonesByParkingAreaIdQuery : IRequest<List<ZoneDto>>
{
    public Guid ParkingAreaId { get; set; }
}
'@
Set-Content -Path "$appPath\Features\Zones\Queries\GetByParkingAreaId\GetZonesByParkingAreaIdQuery.cs" -Value $content

# GetZonesByParkingAreaIdValidator
$content = @'
using FluentValidation;

namespace SmartParking.Application.Features.Zones.Queries.GetByParkingAreaId;

public class GetZonesByParkingAreaIdValidator : AbstractValidator<GetZonesByParkingAreaIdQuery>
{
    public GetZonesByParkingAreaIdValidator()
    {
        RuleFor(x => x.ParkingAreaId)
            .NotEmpty().WithMessage("Parking Area ID is required.");
    }
}
'@
Set-Content -Path "$appPath\Features\Zones\Queries\GetByParkingAreaId\GetZonesByParkingAreaIdValidator.cs" -Value $content

# GetZonesByParkingAreaIdHandler
$content = @'
using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartParking.Application.Common.DTOs.Zone;
using SmartParking.Application.Common.Interfaces;

namespace SmartParking.Application.Features.Zones.Queries.GetByParkingAreaId;

public class GetZonesByParkingAreaIdHandler : IRequestHandler<GetZonesByParkingAreaIdQuery, List<ZoneDto>>
{
    private readonly IApplicationDbContext _context;

    public GetZonesByParkingAreaIdHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ZoneDto>> Handle(GetZonesByParkingAreaIdQuery request, CancellationToken cancellationToken)
    {
        var zones = await _context.Zones
            .Where(z => z.ParkingAreaId == request.ParkingAreaId && !z.IsDeleted)
            .OrderBy(z => z.SortOrder)
            .ThenBy(z => z.Name)
            .Select(z => new ZoneDto
            {
                Id = z.Id,
                ParkingAreaId = z.ParkingAreaId,
                Name = z.Name,
                Description = z.Description,
                MapColorHex = z.MapColorHex,
                SortOrder = z.SortOrder,
                CreatedAt = z.CreatedAt,
                UpdatedAt = z.UpdatedAt
            })
            .ToListAsync(cancellationToken);

        return zones;
    }
}
'@
Set-Content -Path "$appPath\Features\Zones\Queries\GetByParkingAreaId\GetZonesByParkingAreaIdHandler.cs" -Value $content

Write-Host "✓ Zone Queries created" -ForegroundColor Green

Write-Host ""
Write-Host "Zone files created successfully!" -ForegroundColor Green
Write-Host "Creating ParkingSlot files..." -ForegroundColor Yellow
Write-Host ""

# Script continues in Part 2...
Write-Host "Run generate_parking_slots_crud.ps1 next to create ParkingSlot files" -ForegroundColor Cyan

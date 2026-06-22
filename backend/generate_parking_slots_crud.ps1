# PowerShell Script Part 2: Generate ParkingSlot CRUD Files

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Generating ParkingSlot CRUD Files" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$appPath = "src\SmartParking.Application"

# ==========================
# PARKING SLOTS - Commands
# ==========================

Write-Host "Creating ParkingSlot Commands..." -ForegroundColor Yellow

# CreateParkingSlotCommand
$content = @'
using MediatR;
using SmartParking.Application.Common.DTOs.ParkingSlot;

namespace SmartParking.Application.Features.ParkingSlots.Commands.Create;

public class CreateParkingSlotCommand : IRequest<ParkingSlotDto>
{
    public Guid ZoneId { get; set; }
    public string SlotNumber { get; set; } = string.Empty;
    public string VehicleType { get; set; } = string.Empty;
    public decimal XCoordinate { get; set; }
    public decimal YCoordinate { get; set; }
    public bool IsSensorEnabled { get; set; }
}
'@
Set-Content -Path "$appPath\Features\ParkingSlots\Commands\Create\CreateParkingSlotCommand.cs" -Value $content

# CreateParkingSlotValidator
$content = @'
using FluentValidation;

namespace SmartParking.Application.Features.ParkingSlots.Commands.Create;

public class CreateParkingSlotValidator : AbstractValidator<CreateParkingSlotCommand>
{
    public CreateParkingSlotValidator()
    {
        RuleFor(x => x.ZoneId)
            .NotEmpty().WithMessage("Zone ID is required.");

        RuleFor(x => x.SlotNumber)
            .NotEmpty().WithMessage("Slot number is required.")
            .MaximumLength(10).WithMessage("Slot number must not exceed 10 characters.");

        RuleFor(x => x.VehicleType)
            .NotEmpty().WithMessage("Vehicle type is required.")
            .Must(vt => vt == "Car" || vt == "Motorcycle" || vt == "SUV" || vt == "Truck")
            .WithMessage("Vehicle type must be Car, Motorcycle, SUV, or Truck.");

        RuleFor(x => x.XCoordinate)
            .GreaterThanOrEqualTo(0).WithMessage("X coordinate must be >= 0.")
            .LessThan(10000).WithMessage("X coordinate must be < 10000.");

        RuleFor(x => x.YCoordinate)
            .GreaterThanOrEqualTo(0).WithMessage("Y coordinate must be >= 0.")
            .LessThan(10000).WithMessage("Y coordinate must be < 10000.");
    }
}
'@
Set-Content -Path "$appPath\Features\ParkingSlots\Commands\Create\CreateParkingSlotValidator.cs" -Value $content

# CreateParkingSlotHandler
$content = @'
using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartParking.Application.Common.DTOs.ParkingSlot;
using SmartParking.Application.Common.Interfaces;
using SmartParking.Domain.Entities;
using SmartParking.Domain.Enums;

namespace SmartParking.Application.Features.ParkingSlots.Commands.Create;

public class CreateParkingSlotHandler : IRequestHandler<CreateParkingSlotCommand, ParkingSlotDto>
{
    private readonly IApplicationDbContext _context;

    public CreateParkingSlotHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ParkingSlotDto> Handle(CreateParkingSlotCommand request, CancellationToken cancellationToken)
    {
        // Validate zone exists
        var zoneExists = await _context.Zones
            .AnyAsync(z => z.Id == request.ZoneId && !z.IsDeleted, cancellationToken);

        if (!zoneExists)
        {
            throw new KeyNotFoundException($"Zone with ID {request.ZoneId} not found.");
        }

        // Validate slot number uniqueness
        var slotExists = await _context.ParkingSlots
            .AnyAsync(ps => ps.SlotNumber == request.SlotNumber && !ps.IsDeleted, cancellationToken);

        if (slotExists)
        {
            throw new InvalidOperationException($"Slot number {request.SlotNumber} already exists.");
        }

        // Parse vehicle type enum
        if (!Enum.TryParse<VehicleType>(request.VehicleType, out var vehicleType))
        {
            throw new ArgumentException($"Invalid vehicle type: {request.VehicleType}");
        }

        var parkingSlot = new ParkingSlot
        {
            Id = Guid.NewGuid(),
            ZoneId = request.ZoneId,
            SlotNumber = request.SlotNumber,
            VehicleType = vehicleType,
            CurrentStatus = SlotStatus.Available,
            LastStatusChange = DateTime.UtcNow,
            XCoordinate = request.XCoordinate,
            YCoordinate = request.YCoordinate,
            IsSensorEnabled = request.IsSensorEnabled,
            CreatedAt = DateTime.UtcNow
            // TODO: Add audit logging when available - CreatedBy = currentUserId
        };

        _context.ParkingSlots.Add(parkingSlot);
        await _context.SaveChangesAsync(cancellationToken);

        return new ParkingSlotDto
        {
            Id = parkingSlot.Id,
            ZoneId = parkingSlot.ZoneId,
            SlotNumber = parkingSlot.SlotNumber,
            VehicleType = parkingSlot.VehicleType.ToString(),
            CurrentStatus = parkingSlot.CurrentStatus.ToString(),
            LastStatusChange = parkingSlot.LastStatusChange,
            XCoordinate = parkingSlot.XCoordinate,
            YCoordinate = parkingSlot.YCoordinate,
            IsSensorEnabled = parkingSlot.IsSensorEnabled,
            CreatedAt = parkingSlot.CreatedAt,
            UpdatedAt = parkingSlot.UpdatedAt
        };
    }
}
'@
Set-Content -Path "$appPath\Features\ParkingSlots\Commands\Create\CreateParkingSlotHandler.cs" -Value $content

# UpdateParkingSlotCommand
$content = @'
using MediatR;
using SmartParking.Application.Common.DTOs.ParkingSlot;

namespace SmartParking.Application.Features.ParkingSlots.Commands.Update;

public class UpdateParkingSlotCommand : IRequest<ParkingSlotDto>
{
    public Guid Id { get; set; }
    public Guid ZoneId { get; set; }
    public string SlotNumber { get; set; } = string.Empty;
    public string VehicleType { get; set; } = string.Empty;
    public decimal XCoordinate { get; set; }
    public decimal YCoordinate { get; set; }
    public bool IsSensorEnabled { get; set; }
}
'@
Set-Content -Path "$appPath\Features\ParkingSlots\Commands\Update\UpdateParkingSlotCommand.cs" -Value $content

# UpdateParkingSlotValidator
$content = @'
using FluentValidation;

namespace SmartParking.Application.Features.ParkingSlots.Commands.Update;

public class UpdateParkingSlotValidator : AbstractValidator<UpdateParkingSlotCommand>
{
    public UpdateParkingSlotValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Id is required.");

        RuleFor(x => x.ZoneId)
            .NotEmpty().WithMessage("Zone ID is required.");

        RuleFor(x => x.SlotNumber)
            .NotEmpty().WithMessage("Slot number is required.")
            .MaximumLength(10).WithMessage("Slot number must not exceed 10 characters.");

        RuleFor(x => x.VehicleType)
            .NotEmpty().WithMessage("Vehicle type is required.")
            .Must(vt => vt == "Car" || vt == "Motorcycle" || vt == "SUV" || vt == "Truck")
            .WithMessage("Vehicle type must be Car, Motorcycle, SUV, or Truck.");

        RuleFor(x => x.XCoordinate)
            .GreaterThanOrEqualTo(0).WithMessage("X coordinate must be >= 0.")
            .LessThan(10000).WithMessage("X coordinate must be < 10000.");

        RuleFor(x => x.YCoordinate)
            .GreaterThanOrEqualTo(0).WithMessage("Y coordinate must be >= 0.")
            .LessThan(10000).WithMessage("Y coordinate must be < 10000.");
    }
}
'@
Set-Content -Path "$appPath\Features\ParkingSlots\Commands\Update\UpdateParkingSlotValidator.cs" -Value $content

# UpdateParkingSlotHandler
$content = @'
using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartParking.Application.Common.DTOs.ParkingSlot;
using SmartParking.Application.Common.Interfaces;
using SmartParking.Domain.Enums;

namespace SmartParking.Application.Features.ParkingSlots.Commands.Update;

public class UpdateParkingSlotHandler : IRequestHandler<UpdateParkingSlotCommand, ParkingSlotDto>
{
    private readonly IApplicationDbContext _context;

    public UpdateParkingSlotHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ParkingSlotDto> Handle(UpdateParkingSlotCommand request, CancellationToken cancellationToken)
    {
        var parkingSlot = await _context.ParkingSlots
            .FirstOrDefaultAsync(ps => ps.Id == request.Id && !ps.IsDeleted, cancellationToken);

        if (parkingSlot == null)
        {
            throw new KeyNotFoundException($"Parking slot with ID {request.Id} not found.");
        }

        // Validate zone exists if changed
        if (parkingSlot.ZoneId != request.ZoneId)
        {
            var zoneExists = await _context.Zones
                .AnyAsync(z => z.Id == request.ZoneId && !z.IsDeleted, cancellationToken);

            if (!zoneExists)
            {
                throw new KeyNotFoundException($"Zone with ID {request.ZoneId} not found.");
            }
        }

        // Validate slot number uniqueness if changed
        if (parkingSlot.SlotNumber != request.SlotNumber)
        {
            var slotExists = await _context.ParkingSlots
                .AnyAsync(ps => ps.SlotNumber == request.SlotNumber && ps.Id != request.Id && !ps.IsDeleted, cancellationToken);

            if (slotExists)
            {
                throw new InvalidOperationException($"Slot number {request.SlotNumber} already exists.");
            }
        }

        // Parse vehicle type enum
        if (!Enum.TryParse<VehicleType>(request.VehicleType, out var vehicleType))
        {
            throw new ArgumentException($"Invalid vehicle type: {request.VehicleType}");
        }

        parkingSlot.ZoneId = request.ZoneId;
        parkingSlot.SlotNumber = request.SlotNumber;
        parkingSlot.VehicleType = vehicleType;
        parkingSlot.XCoordinate = request.XCoordinate;
        parkingSlot.YCoordinate = request.YCoordinate;
        parkingSlot.IsSensorEnabled = request.IsSensorEnabled;
        parkingSlot.UpdatedAt = DateTime.UtcNow;
        // TODO: Add audit logging when available - UpdatedBy = currentUserId

        await _context.SaveChangesAsync(cancellationToken);

        return new ParkingSlotDto
        {
            Id = parkingSlot.Id,
            ZoneId = parkingSlot.ZoneId,
            SlotNumber = parkingSlot.SlotNumber,
            VehicleType = parkingSlot.VehicleType.ToString(),
            CurrentStatus = parkingSlot.CurrentStatus.ToString(),
            LastStatusChange = parkingSlot.LastStatusChange,
            XCoordinate = parkingSlot.XCoordinate,
            YCoordinate = parkingSlot.YCoordinate,
            IsSensorEnabled = parkingSlot.IsSensorEnabled,
            CreatedAt = parkingSlot.CreatedAt,
            UpdatedAt = parkingSlot.UpdatedAt
        };
    }
}
'@
Set-Content -Path "$appPath\Features\ParkingSlots\Commands\Update\UpdateParkingSlotHandler.cs" -Value $content

# DeleteParkingSlotCommand
$content = @'
using MediatR;

namespace SmartParking.Application.Features.ParkingSlots.Commands.Delete;

public class DeleteParkingSlotCommand : IRequest<bool>
{
    public Guid Id { get; set; }
}
'@
Set-Content -Path "$appPath\Features\ParkingSlots\Commands\Delete\DeleteParkingSlotCommand.cs" -Value $content

# DeleteParkingSlotValidator
$content = @'
using FluentValidation;

namespace SmartParking.Application.Features.ParkingSlots.Commands.Delete;

public class DeleteParkingSlotValidator : AbstractValidator<DeleteParkingSlotCommand>
{
    public DeleteParkingSlotValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Id is required.");
    }
}
'@
Set-Content -Path "$appPath\Features\ParkingSlots\Commands\Delete\DeleteParkingSlotValidator.cs" -Value $content

# DeleteParkingSlotHandler
$content = @'
using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartParking.Application.Common.Interfaces;

namespace SmartParking.Application.Features.ParkingSlots.Commands.Delete;

public class DeleteParkingSlotHandler : IRequestHandler<DeleteParkingSlotCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public DeleteParkingSlotHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteParkingSlotCommand request, CancellationToken cancellationToken)
    {
        var parkingSlot = await _context.ParkingSlots
            .FirstOrDefaultAsync(ps => ps.Id == request.Id && !ps.IsDeleted, cancellationToken);

        if (parkingSlot == null)
        {
            throw new KeyNotFoundException($"Parking slot with ID {request.Id} not found.");
        }

        // Soft delete - preserve historical data
        parkingSlot.IsDeleted = true;
        parkingSlot.UpdatedAt = DateTime.UtcNow;
        // TODO: Add audit logging when available - DeletedBy = currentUserId

        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
'@
Set-Content -Path "$appPath\Features\ParkingSlots\Commands\Delete\DeleteParkingSlotHandler.cs" -Value $content

Write-Host "✓ ParkingSlot Commands created" -ForegroundColor Green

# ==========================
# PARKING SLOTS - Queries
# ==========================

Write-Host "Creating ParkingSlot Queries..." -ForegroundColor Yellow

# GetAllParkingSlotsQuery
$content = @'
using MediatR;
using SmartParking.Application.Common.DTOs.ParkingSlot;

namespace SmartParking.Application.Features.ParkingSlots.Queries.GetAll;

public class GetAllParkingSlotsQuery : IRequest<List<ParkingSlotDto>>
{
}
'@
Set-Content -Path "$appPath\Features\ParkingSlots\Queries\GetAll\GetAllParkingSlotsQuery.cs" -Value $content

# GetAllParkingSlotsHandler
$content = @'
using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartParking.Application.Common.DTOs.ParkingSlot;
using SmartParking.Application.Common.Interfaces;

namespace SmartParking.Application.Features.ParkingSlots.Queries.GetAll;

public class GetAllParkingSlotsHandler : IRequestHandler<GetAllParkingSlotsQuery, List<ParkingSlotDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAllParkingSlotsHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ParkingSlotDto>> Handle(GetAllParkingSlotsQuery request, CancellationToken cancellationToken)
    {
        var parkingSlots = await _context.ParkingSlots
            .Where(ps => !ps.IsDeleted)
            .OrderBy(ps => ps.SlotNumber)
            .Select(ps => new ParkingSlotDto
            {
                Id = ps.Id,
                ZoneId = ps.ZoneId,
                SlotNumber = ps.SlotNumber,
                VehicleType = ps.VehicleType.ToString(),
                CurrentStatus = ps.CurrentStatus.ToString(),
                LastStatusChange = ps.LastStatusChange,
                XCoordinate = ps.XCoordinate,
                YCoordinate = ps.YCoordinate,
                IsSensorEnabled = ps.IsSensorEnabled,
                CreatedAt = ps.CreatedAt,
                UpdatedAt = ps.UpdatedAt
            })
            .ToListAsync(cancellationToken);

        return parkingSlots;
    }
}
'@
Set-Content -Path "$appPath\Features\ParkingSlots\Queries\GetAll\GetAllParkingSlotsHandler.cs" -Value $content

# GetParkingSlotByIdQuery
$content = @'
using MediatR;
using SmartParking.Application.Common.DTOs.ParkingSlot;

namespace SmartParking.Application.Features.ParkingSlots.Queries.GetById;

public class GetParkingSlotByIdQuery : IRequest<ParkingSlotDto>
{
    public Guid Id { get; set; }
}
'@
Set-Content -Path "$appPath\Features\ParkingSlots\Queries\GetById\GetParkingSlotByIdQuery.cs" -Value $content

# GetParkingSlotByIdValidator
$content = @'
using FluentValidation;

namespace SmartParking.Application.Features.ParkingSlots.Queries.GetById;

public class GetParkingSlotByIdValidator : AbstractValidator<GetParkingSlotByIdQuery>
{
    public GetParkingSlotByIdValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Id is required.");
    }
}
'@
Set-Content -Path "$appPath\Features\ParkingSlots\Queries\GetById\GetParkingSlotByIdValidator.cs" -Value $content

# GetParkingSlotByIdHandler
$content = @'
using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartParking.Application.Common.DTOs.ParkingSlot;
using SmartParking.Application.Common.Interfaces;

namespace SmartParking.Application.Features.ParkingSlots.Queries.GetById;

public class GetParkingSlotByIdHandler : IRequestHandler<GetParkingSlotByIdQuery, ParkingSlotDto>
{
    private readonly IApplicationDbContext _context;

    public GetParkingSlotByIdHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ParkingSlotDto> Handle(GetParkingSlotByIdQuery request, CancellationToken cancellationToken)
    {
        var parkingSlot = await _context.ParkingSlots
            .Where(ps => ps.Id == request.Id && !ps.IsDeleted)
            .Select(ps => new ParkingSlotDto
            {
                Id = ps.Id,
                ZoneId = ps.ZoneId,
                SlotNumber = ps.SlotNumber,
                VehicleType = ps.VehicleType.ToString(),
                CurrentStatus = ps.CurrentStatus.ToString(),
                LastStatusChange = ps.LastStatusChange,
                XCoordinate = ps.XCoordinate,
                YCoordinate = ps.YCoordinate,
                IsSensorEnabled = ps.IsSensorEnabled,
                CreatedAt = ps.CreatedAt,
                UpdatedAt = ps.UpdatedAt
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (parkingSlot == null)
        {
            throw new KeyNotFoundException($"Parking slot with ID {request.Id} not found.");
        }

        return parkingSlot;
    }
}
'@
Set-Content -Path "$appPath\Features\ParkingSlots\Queries\GetById\GetParkingSlotByIdHandler.cs" -Value $content

# GetParkingSlotsByZoneIdQuery
$content = @'
using MediatR;
using SmartParking.Application.Common.DTOs.ParkingSlot;

namespace SmartParking.Application.Features.ParkingSlots.Queries.GetByZoneId;

public class GetParkingSlotsByZoneIdQuery : IRequest<List<ParkingSlotDto>>
{
    public Guid ZoneId { get; set; }
}
'@
Set-Content -Path "$appPath\Features\ParkingSlots\Queries\GetByZoneId\GetParkingSlotsByZoneIdQuery.cs" -Value $content

# GetParkingSlotsByZoneIdValidator
$content = @'
using FluentValidation;

namespace SmartParking.Application.Features.ParkingSlots.Queries.GetByZoneId;

public class GetParkingSlotsByZoneIdValidator : AbstractValidator<GetParkingSlotsByZoneIdQuery>
{
    public GetParkingSlotsByZoneIdValidator()
    {
        RuleFor(x => x.ZoneId)
            .NotEmpty().WithMessage("Zone ID is required.");
    }
}
'@
Set-Content -Path "$appPath\Features\ParkingSlots\Queries\GetByZoneId\GetParkingSlotsByZoneIdValidator.cs" -Value $content

# GetParkingSlotsByZoneIdHandler
$content = @'
using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartParking.Application.Common.DTOs.ParkingSlot;
using SmartParking.Application.Common.Interfaces;

namespace SmartParking.Application.Features.ParkingSlots.Queries.GetByZoneId;

public class GetParkingSlotsByZoneIdHandler : IRequestHandler<GetParkingSlotsByZoneIdQuery, List<ParkingSlotDto>>
{
    private readonly IApplicationDbContext _context;

    public GetParkingSlotsByZoneIdHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ParkingSlotDto>> Handle(GetParkingSlotsByZoneIdQuery request, CancellationToken cancellationToken)
    {
        var parkingSlots = await _context.ParkingSlots
            .Where(ps => ps.ZoneId == request.ZoneId && !ps.IsDeleted)
            .OrderBy(ps => ps.SlotNumber)
            .Select(ps => new ParkingSlotDto
            {
                Id = ps.Id,
                ZoneId = ps.ZoneId,
                SlotNumber = ps.SlotNumber,
                VehicleType = ps.VehicleType.ToString(),
                CurrentStatus = ps.CurrentStatus.ToString(),
                LastStatusChange = ps.LastStatusChange,
                XCoordinate = ps.XCoordinate,
                YCoordinate = ps.YCoordinate,
                IsSensorEnabled = ps.IsSensorEnabled,
                CreatedAt = ps.CreatedAt,
                UpdatedAt = ps.UpdatedAt
            })
            .ToListAsync(cancellationToken);

        return parkingSlots;
    }
}
'@
Set-Content -Path "$appPath\Features\ParkingSlots\Queries\GetByZoneId\GetParkingSlotsByZoneIdHandler.cs" -Value $content

Write-Host "✓ ParkingSlot Queries created" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "All ParkingSlot files created successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Run generate_controllers.ps1 next to create the Controllers" -ForegroundColor Cyan

# Phase 3 File Generation Script
# This script creates all necessary files for Parking Management CRUD APIs

Write-Host "Creating Phase 3: Parking Management CRUD API files..." -ForegroundColor Green

# Create directory structure
$directories = @(
    "src\SmartParking.Application\Common\DTOs\Zone",
    "src\SmartParking.Application\Common\DTOs\ParkingSlot",
    "src\SmartParking.Application\Features\ParkingAreas\Commands\Create",
    "src\SmartParking.Application\Features\ParkingAreas\Commands\Update",
    "src\SmartParking.Application\Features\ParkingAreas\Commands\Delete",
    "src\SmartParking.Application\Features\ParkingAreas\Queries\GetAll",
    "src\SmartParking.Application\Features\ParkingAreas\Queries\GetById",
    "src\SmartParking.Application\Features\Zones\Commands\Create",
    "src\SmartParking.Application\Features\Zones\Commands\Update",
    "src\SmartParking.Application\Features\Zones\Commands\Delete",
    "src\SmartParking.Application\Features\Zones\Queries\GetAll",
    "src\SmartParking.Application\Features\Zones\Queries\GetById",
    "src\SmartParking.Application\Features\Zones\Queries\GetByParkingAreaId",
    "src\SmartParking.Application\Features\ParkingSlots\Commands\Create",
    "src\SmartParking.Application\Features\ParkingSlots\Commands\Update",
    "src\SmartParking.Application\Features\ParkingSlots\Commands\Delete",
    "src\SmartParking.Application\Features\ParkingSlots\Queries\GetAll",
    "src\SmartParking.Application\Features\ParkingSlots\Queries\GetById",
    "src\SmartParking.Application\Features\ParkingSlots\Queries\GetByZoneId",
    "src\SmartParking.Application\Common\Behaviors",
    "src\SmartParking.Presentation\Controllers"
)

foreach ($dir in $directories) {
    $fullPath = Join-Path $PSScriptRoot $dir
    if (!(Test-Path $fullPath)) {
        New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
        Write-Host "Created: $dir" -ForegroundColor Yellow
    }
}

Write-Host "All directories created successfully!" -ForegroundColor Green
Write-Host "Now create the C# files using the file creation tools..." -ForegroundColor Cyan

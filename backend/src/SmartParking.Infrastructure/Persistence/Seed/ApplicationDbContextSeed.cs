using Microsoft.EntityFrameworkCore;
using SmartParking.Domain.Entities;
using SmartParking.Domain.Enums;

namespace SmartParking.Infrastructure.Persistence.Seed;

public static class ApplicationDbContextSeed
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // Seed default SuperAdmin user
        if (!await context.Users.AnyAsync())
        {
            // Password: Admin@123
            var superAdmin = new User
            {
                Id = Guid.NewGuid(),
                Username = "superadmin",
                Email = "superadmin@ayalamalls.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                Role = UserRole.SuperAdmin,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            context.Users.Add(superAdmin);
            await context.SaveChangesAsync();
        }

        // Seed default parking area
        if (!await context.ParkingAreas.AnyAsync())
        {
            var parkingAreaId = Guid.NewGuid();
            var parkingArea = new ParkingArea
            {
                Id = parkingAreaId,
                Name = "Ayala Malls Abreeza Ground Floor",
                Address = "J.P. Laurel Ave, Bajada, Davao City, 8000 Davao del Sur, Philippines",
                Description = "Main ground floor parking facility",
                TotalCapacity = 0,
                CreatedAt = DateTime.UtcNow
            };

            context.ParkingAreas.Add(parkingArea);
            await context.SaveChangesAsync();

            // Seed zones
            var zoneAId = Guid.NewGuid();
            var zoneBId = Guid.NewGuid();
            var zoneCId = Guid.NewGuid();
            var zoneDId = Guid.NewGuid();

            var zones = new List<Zone>
            {
                new Zone
                {
                    Id = zoneAId,
                    ParkingAreaId = parkingAreaId,
                    Name = "Zone A",
                    Description = "Front section near main entrance",
                    MapColorHex = "#3B82F6",  // Blue
                    SortOrder = 1,
                    CreatedAt = DateTime.UtcNow
                },
                new Zone
                {
                    Id = zoneBId,
                    ParkingAreaId = parkingAreaId,
                    Name = "Zone B",
                    Description = "East section near cinema",
                    MapColorHex = "#10B981",  // Green
                    SortOrder = 2,
                    CreatedAt = DateTime.UtcNow
                },
                new Zone
                {
                    Id = zoneCId,
                    ParkingAreaId = parkingAreaId,
                    Name = "Zone C",
                    Description = "West section near supermarket",
                    MapColorHex = "#F59E0B",  // Amber
                    SortOrder = 3,
                    CreatedAt = DateTime.UtcNow
                },
                new Zone
                {
                    Id = zoneDId,
                    ParkingAreaId = parkingAreaId,
                    Name = "Zone D",
                    Description = "Rear section near service area",
                    MapColorHex = "#EF4444",  // Red
                    SortOrder = 4,
                    CreatedAt = DateTime.UtcNow
                }
            };

            context.Zones.AddRange(zones);
            await context.SaveChangesAsync();

            // Seed parking slots
            var parkingSlots = new List<ParkingSlot>();

            // Zone A: 20 car slots + 10 motorcycle slots
            for (int i = 1; i <= 20; i++)
            {
                parkingSlots.Add(new ParkingSlot
                {
                    Id = Guid.NewGuid(),
                    ZoneId = zoneAId,
                    SlotNumber = $"A-{i:D3}",
                    VehicleType = VehicleType.Car,
                    CurrentStatus = SlotStatus.Available,
                    LastStatusChange = DateTime.UtcNow,
                    XCoordinate = 100 + (i * 30),
                    YCoordinate = 100,
                    IsSensorEnabled = false,
                    CreatedAt = DateTime.UtcNow
                });
            }

            for (int i = 21; i <= 30; i++)
            {
                parkingSlots.Add(new ParkingSlot
                {
                    Id = Guid.NewGuid(),
                    ZoneId = zoneAId,
                    SlotNumber = $"A-{i:D3}",
                    VehicleType = VehicleType.Motorcycle,
                    CurrentStatus = SlotStatus.Available,
                    LastStatusChange = DateTime.UtcNow,
                    XCoordinate = 100 + ((i - 20) * 15),
                    YCoordinate = 200,
                    IsSensorEnabled = false,
                    CreatedAt = DateTime.UtcNow
                });
            }

            // Zone B: 25 car slots + 15 motorcycle slots
            for (int i = 1; i <= 25; i++)
            {
                parkingSlots.Add(new ParkingSlot
                {
                    Id = Guid.NewGuid(),
                    ZoneId = zoneBId,
                    SlotNumber = $"B-{i:D3}",
                    VehicleType = VehicleType.Car,
                    CurrentStatus = SlotStatus.Available,
                    LastStatusChange = DateTime.UtcNow,
                    XCoordinate = 100 + (i * 30),
                    YCoordinate = 300,
                    IsSensorEnabled = false,
                    CreatedAt = DateTime.UtcNow
                });
            }

            for (int i = 26; i <= 40; i++)
            {
                parkingSlots.Add(new ParkingSlot
                {
                    Id = Guid.NewGuid(),
                    ZoneId = zoneBId,
                    SlotNumber = $"B-{i:D3}",
                    VehicleType = VehicleType.Motorcycle,
                    CurrentStatus = SlotStatus.Available,
                    LastStatusChange = DateTime.UtcNow,
                    XCoordinate = 100 + ((i - 25) * 15),
                    YCoordinate = 400,
                    IsSensorEnabled = false,
                    CreatedAt = DateTime.UtcNow
                });
            }

            // Zone C: 20 car slots + 10 motorcycle slots
            for (int i = 1; i <= 20; i++)
            {
                parkingSlots.Add(new ParkingSlot
                {
                    Id = Guid.NewGuid(),
                    ZoneId = zoneCId,
                    SlotNumber = $"C-{i:D3}",
                    VehicleType = VehicleType.Car,
                    CurrentStatus = SlotStatus.Available,
                    LastStatusChange = DateTime.UtcNow,
                    XCoordinate = 100 + (i * 30),
                    YCoordinate = 500,
                    IsSensorEnabled = false,
                    CreatedAt = DateTime.UtcNow
                });
            }

            for (int i = 21; i <= 30; i++)
            {
                parkingSlots.Add(new ParkingSlot
                {
                    Id = Guid.NewGuid(),
                    ZoneId = zoneCId,
                    SlotNumber = $"C-{i:D3}",
                    VehicleType = VehicleType.Motorcycle,
                    CurrentStatus = SlotStatus.Available,
                    LastStatusChange = DateTime.UtcNow,
                    XCoordinate = 100 + ((i - 20) * 15),
                    YCoordinate = 600,
                    IsSensorEnabled = false,
                    CreatedAt = DateTime.UtcNow
                });
            }

            // Zone D: 15 car slots + 10 motorcycle slots
            for (int i = 1; i <= 15; i++)
            {
                parkingSlots.Add(new ParkingSlot
                {
                    Id = Guid.NewGuid(),
                    ZoneId = zoneDId,
                    SlotNumber = $"D-{i:D3}",
                    VehicleType = VehicleType.Car,
                    CurrentStatus = SlotStatus.Available,
                    LastStatusChange = DateTime.UtcNow,
                    XCoordinate = 100 + (i * 30),
                    YCoordinate = 700,
                    IsSensorEnabled = false,
                    CreatedAt = DateTime.UtcNow
                });
            }

            for (int i = 16; i <= 25; i++)
            {
                parkingSlots.Add(new ParkingSlot
                {
                    Id = Guid.NewGuid(),
                    ZoneId = zoneDId,
                    SlotNumber = $"D-{i:D3}",
                    VehicleType = VehicleType.Motorcycle,
                    CurrentStatus = SlotStatus.Available,
                    LastStatusChange = DateTime.UtcNow,
                    XCoordinate = 100 + ((i - 15) * 15),
                    YCoordinate = 800,
                    IsSensorEnabled = false,
                    CreatedAt = DateTime.UtcNow
                });
            }

            context.ParkingSlots.AddRange(parkingSlots);
            await context.SaveChangesAsync();

            // Update total capacity
            parkingArea.TotalCapacity = parkingSlots.Count;
            await context.SaveChangesAsync();
        }
    }
}

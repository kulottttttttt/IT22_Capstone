using Microsoft.AspNetCore.SignalR;
using SmartParking.Application.Common.DTOs.SignalR;
using SmartParking.Application.Common.Interfaces;
using SmartParking.Presentation.Hubs;

namespace SmartParking.Presentation.Services;

public class ParkingHubService : IParkingHubService
{
    private readonly IHubContext<ParkingHub, IParkingHubClient> _hubContext;

    public ParkingHubService(IHubContext<ParkingHub, IParkingHubClient> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task BroadcastSlotStatusChanged(SlotStatusChangedEvent eventData)
    {
        // Broadcast to zone group
        await _hubContext.Clients
            .Group($"Zone_{eventData.ZoneId}")
            .SlotStatusChanged(eventData);

        // Also broadcast to all clients for system-wide monitoring
        await _hubContext.Clients
            .Group("AllClients")
            .SlotStatusChanged(eventData);
    }

    public async Task BroadcastZoneOccupancyUpdated(ZoneOccupancyUpdatedEvent eventData)
    {
        // Broadcast to zone group
        await _hubContext.Clients
            .Group($"Zone_{eventData.ZoneId}")
            .ZoneOccupancyUpdated(eventData);

        // Also broadcast to all clients
        await _hubContext.Clients
            .Group("AllClients")
            .ZoneOccupancyUpdated(eventData);
    }

    public async Task BroadcastParkingAreaUpdated(ParkingAreaUpdatedEvent eventData)
    {
        // Broadcast to parking area group
        await _hubContext.Clients
            .Group($"ParkingArea_{eventData.ParkingAreaId}")
            .ParkingAreaUpdated(eventData);

        // Also broadcast to all clients
        await _hubContext.Clients
            .Group("AllClients")
            .ParkingAreaUpdated(eventData);
    }
}

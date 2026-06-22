using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SmartParking.Application.Common.Interfaces;

namespace SmartParking.Presentation.Hubs;

/// <summary>
/// SignalR hub for real-time parking updates.
/// Handles client connections and group subscriptions.
/// </summary>
[Authorize] // Require authentication for connection
public class ParkingHub : Hub<IParkingHubClient>
{
    /// <summary>
    /// Joins a parking area group to receive updates for that area.
    /// </summary>
    /// <param name="parkingAreaId">The parking area ID to subscribe to.</param>
    public async Task JoinParkingAreaGroup(string parkingAreaId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"ParkingArea_{parkingAreaId}");
    }

    /// <summary>
    /// Leaves a parking area group to stop receiving updates for that area.
    /// </summary>
    /// <param name="parkingAreaId">The parking area ID to unsubscribe from.</param>
    public async Task LeaveParkingAreaGroup(string parkingAreaId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"ParkingArea_{parkingAreaId}");
    }

    /// <summary>
    /// Joins a zone group to receive updates for that zone.
    /// </summary>
    /// <param name="zoneId">The zone ID to subscribe to.</param>
    public async Task JoinZoneGroup(string zoneId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"Zone_{zoneId}");
    }

    /// <summary>
    /// Leaves a zone group to stop receiving updates for that zone.
    /// </summary>
    /// <param name="zoneId">The zone ID to unsubscribe from.</param>
    public async Task LeaveZoneGroup(string zoneId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"Zone_{zoneId}");
    }

    /// <summary>
    /// Called when a client connects to the hub.
    /// </summary>
    public override async Task OnConnectedAsync()
    {
        // Join a general "AllClients" group for system-wide broadcasts
        await Groups.AddToGroupAsync(Context.ConnectionId, "AllClients");
        await base.OnConnectedAsync();
    }

    /// <summary>
    /// Called when a client disconnects from the hub.
    /// </summary>
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, "AllClients");
        await base.OnDisconnectedAsync(exception);
    }
}

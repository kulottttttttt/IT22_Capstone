using SmartParking.Application.Common.DTOs.SignalR;

namespace SmartParking.Application.Common.Interfaces;

/// <summary>
/// Interface for client-side methods that the SignalR hub can call.
/// </summary>
public interface IParkingHubClient
{
    /// <summary>
    /// Receives slot status change notifications.
    /// </summary>
    Task SlotStatusChanged(SlotStatusChangedEvent eventData);

    /// <summary>
    /// Receives zone occupancy update notifications.
    /// </summary>
    Task ZoneOccupancyUpdated(ZoneOccupancyUpdatedEvent eventData);

    /// <summary>
    /// Receives parking area occupancy update notifications.
    /// </summary>
    Task ParkingAreaUpdated(ParkingAreaUpdatedEvent eventData);
}

using SmartParking.Application.Common.DTOs.SignalR;

namespace SmartParking.Application.Common.Interfaces;

public interface IParkingHubService
{
    Task BroadcastSlotStatusChanged(SlotStatusChangedEvent eventData);
    Task BroadcastZoneOccupancyUpdated(ZoneOccupancyUpdatedEvent eventData);
    Task BroadcastParkingAreaUpdated(ParkingAreaUpdatedEvent eventData);
}

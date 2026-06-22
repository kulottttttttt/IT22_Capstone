import * as signalR from '@microsoft/signalr';
import type { SlotStatusChangedEvent, ZoneOccupancyUpdatedEvent, ParkingAreaUpdatedEvent } from '../types';

const HUB_URL = import.meta.env.VITE_SIGNALR_HUB_URL || 'http://localhost:5257/hubs/parking';

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private isConnecting = false;

  async start(token?: string): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected || this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    const builder = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => token || '',
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information);

    this.connection = builder.build();

    try {
      await this.connection.start();
      console.log('SignalR Connected');
    } catch (error) {
      console.error('SignalR Connection Error:', error);
    } finally {
      this.isConnecting = false;
    }
  }

  async stop(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
    }
  }

  // Event Listeners
  onSlotStatusChanged(callback: (event: SlotStatusChangedEvent) => void): void {
    this.connection?.on('SlotStatusChanged', callback);
  }

  onZoneOccupancyUpdated(callback: (event: ZoneOccupancyUpdatedEvent) => void): void {
    this.connection?.on('ZoneOccupancyUpdated', callback);
  }

  onParkingAreaUpdated(callback: (event: ParkingAreaUpdatedEvent) => void): void {
    this.connection?.on('ParkingAreaUpdated', callback);
  }

  // Group Management
  async joinParkingAreaGroup(parkingAreaId: string): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke('JoinParkingAreaGroup', parkingAreaId);
      } catch (error) {
        console.error('Error joining parking area group:', error);
      }
    }
  }

  async leaveParkingAreaGroup(parkingAreaId: string): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke('LeaveParkingAreaGroup', parkingAreaId);
      } catch (error) {
        console.error('Error leaving parking area group:', error);
      }
    }
  }

  async joinZoneGroup(zoneId: string): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke('JoinZoneGroup', zoneId);
      } catch (error) {
        console.error('Error joining zone group:', error);
      }
    }
  }

  async leaveZoneGroup(zoneId: string): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke('LeaveZoneGroup', zoneId);
      } catch (error) {
        console.error('Error leaving zone group:', error);
      }
    }
  }

  getConnectionState(): signalR.HubConnectionState | null {
    return this.connection?.state || null;
  }
}

export const signalRService = new SignalRService();

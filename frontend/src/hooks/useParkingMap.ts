import { useState, useEffect, useCallback } from 'react';
import { slotService } from '../services/slotService';
import { signalRService } from '../services/signalRService';
import { dashboardService } from '../services/dashboardService';
import type { ParkingSlot, Zone, SlotStatusChangedEvent, ZoneOccupancyUpdatedEvent } from '../types';

interface ZoneWithSlots extends Zone {
  slots: ParkingSlot[];
  availableCount: number;
  occupiedCount: number;
  maintenanceCount: number;
}

interface UseParkingMapReturn {
  zones: ZoneWithSlots[];
  selectedSlot: ParkingSlot | null;
  totalSlots: number;
  availableSlots: number;
  occupiedSlots: number;
  maintenanceSlots: number;
  loading: boolean;
  error: string | null;
  signalRConnected: boolean;
  setSelectedSlot: (slot: ParkingSlot | null) => void;
  refresh: () => Promise<void>;
  updateSlotStatus: (slotId: string, newStatus: string, reason?: string) => Promise<void>;
}

export const useParkingMap = (): UseParkingMapReturn => {
  const [zones, setZones] = useState<ZoneWithSlots[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signalRConnected, setSignalRConnected] = useState(false);

  // Calculate totals
  const totalSlots = zones.reduce((sum, zone) => sum + zone.slots.length, 0);
  const availableSlots = zones.reduce((sum, zone) => sum + zone.availableCount, 0);
  const occupiedSlots = zones.reduce((sum, zone) => sum + zone.occupiedCount, 0);
  const maintenanceSlots = zones.reduce((sum, zone) => sum + zone.maintenanceCount, 0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [zonesData, slotsData] = await Promise.all([
        dashboardService.getZones(),
        slotService.getAllSlots()
      ]);

      // Group slots by zone
      const zonesWithSlots: ZoneWithSlots[] = zonesData.map(zone => {
        const zoneSlots = slotsData.filter(slot => slot.zoneId === zone.id);
        const availableCount = zoneSlots.filter(s => s.currentStatus === 'Available').length;
        const occupiedCount = zoneSlots.filter(s => s.currentStatus === 'Occupied').length;
        const maintenanceCount = zoneSlots.filter(s => s.currentStatus === 'Maintenance').length;

        return {
          ...zone,
          slots: zoneSlots,
          availableCount,
          occupiedCount,
          maintenanceCount,
        };
      });

      setZones(zonesWithSlots);
    } catch (err: any) {
      console.error('Error fetching parking map data:', err);
      setError(err.response?.data?.message || 'Failed to load parking map data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const updateSlotStatus = useCallback(async (slotId: string, newStatus: string, reason?: string) => {
    try {
      await slotService.updateSlotStatus(slotId, {
        newStatus: newStatus as any,
        reason
      });

      // Refresh data after update
      await fetchData();
    } catch (err: any) {
      console.error('Error updating slot status:', err);
      throw new Error(err.response?.data?.message || 'Failed to update slot status');
    }
  }, [fetchData]);

  // Setup SignalR
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    const setupSignalR = async () => {
      try {
        await signalRService.start(token || undefined);
        setSignalRConnected(true);

        // Listen for slot status changes
        signalRService.onSlotStatusChanged((event: SlotStatusChangedEvent) => {
          console.log('Slot status changed:', event);
          
          setZones(prevZones => {
            return prevZones.map(zone => {
              const slotIndex = zone.slots.findIndex(s => s.id === event.slotId);
              
              if (slotIndex !== -1) {
                const updatedSlots = [...zone.slots];
                updatedSlots[slotIndex] = {
                  ...updatedSlots[slotIndex],
                  currentStatus: event.newStatus as any,
                  lastStatusChange: event.changedAt
                };

                // Update selected slot if it matches
                if (selectedSlot?.id === event.slotId) {
                  setSelectedSlot(updatedSlots[slotIndex]);
                }

                const availableCount = updatedSlots.filter(s => s.currentStatus === 'Available').length;
                const occupiedCount = updatedSlots.filter(s => s.currentStatus === 'Occupied').length;
                const maintenanceCount = updatedSlots.filter(s => s.currentStatus === 'Maintenance').length;

                return {
                  ...zone,
                  slots: updatedSlots,
                  availableCount,
                  occupiedCount,
                  maintenanceCount,
                };
              }
              
              return zone;
            });
          });
        });

        // Listen for zone occupancy updates
        signalRService.onZoneOccupancyUpdated((event: ZoneOccupancyUpdatedEvent) => {
          console.log('Zone occupancy updated:', event);
          
          setZones(prevZones => {
            return prevZones.map(zone => {
              if (zone.id === event.zoneId) {
                return {
                  ...zone,
                  availableCount: event.availableSlots,
                  occupiedCount: event.occupiedSlots,
                  maintenanceCount: event.maintenanceSlots,
                };
              }
              return zone;
            });
          });
        });

      } catch (error) {
        console.error('SignalR setup error:', error);
        setSignalRConnected(false);
      }
    };

    setupSignalR();

    return () => {
      signalRService.stop();
    };
  }, [selectedSlot]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    zones,
    selectedSlot,
    totalSlots,
    availableSlots,
    occupiedSlots,
    maintenanceSlots,
    loading,
    error,
    signalRConnected,
    setSelectedSlot,
    refresh,
    updateSlotStatus,
  };
};

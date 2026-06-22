import api from './api';
import type { 
  ParkingArea, 
  Zone, 
  ParkingSlot, 
  DashboardPrediction 
} from '../types';

export interface DashboardStats {
  totalSlots: number;
  availableSlots: number;
  occupiedSlots: number;
  maintenanceSlots: number;
}

export interface ZoneWithOccupancy extends Zone {
  totalSlots: number;
  availableSlots: number;
  occupiedSlots: number;
  maintenanceSlots: number;
}

export const dashboardService = {
  // Get all parking areas
  async getParkingAreas(): Promise<ParkingArea[]> {
    const response = await api.get<ParkingArea[]>('/api/parking-areas');
    return response.data;
  },

  // Get all zones
  async getZones(): Promise<Zone[]> {
    const response = await api.get<Zone[]>('/api/zones');
    return response.data;
  },

  // Get all parking slots
  async getParkingSlots(): Promise<ParkingSlot[]> {
    const response = await api.get<ParkingSlot[]>('/api/parking-slots');
    return response.data;
  },

  // Get dashboard predictions
  async getDashboardPredictions(): Promise<DashboardPrediction> {
    const response = await api.get<DashboardPrediction>('/api/predictions/dashboard');
    return response.data;
  },

  // Calculate dashboard stats from parking slots
  calculateStats(slots: ParkingSlot[]): DashboardStats {
    const totalSlots = slots.length;
    const availableSlots = slots.filter(s => s.currentStatus === 'Available').length;
    const occupiedSlots = slots.filter(s => s.currentStatus === 'Occupied').length;
    const maintenanceSlots = slots.filter(s => s.currentStatus === 'Maintenance').length;

    return {
      totalSlots,
      availableSlots,
      occupiedSlots,
      maintenanceSlots,
    };
  },

  // Get zones with occupancy data
  async getZonesWithOccupancy(): Promise<ZoneWithOccupancy[]> {
    const [zones, slots] = await Promise.all([
      this.getZones(),
      this.getParkingSlots()
    ]);

    return zones.map(zone => {
      const zoneSlots = slots.filter(s => s.zoneId === zone.id);
      const totalSlots = zoneSlots.length;
      const availableSlots = zoneSlots.filter(s => s.currentStatus === 'Available').length;
      const occupiedSlots = zoneSlots.filter(s => s.currentStatus === 'Occupied').length;
      const maintenanceSlots = zoneSlots.filter(s => s.currentStatus === 'Maintenance').length;

      return {
        ...zone,
        totalSlots,
        availableSlots,
        occupiedSlots,
        maintenanceSlots,
      };
    });
  },

  // Get all dashboard data at once
  async getDashboardData() {
    const [parkingAreas, zones, slots, predictions] = await Promise.all([
      this.getParkingAreas(),
      this.getZones(),
      this.getParkingSlots(),
      this.getDashboardPredictions().catch(() => null), // Predictions might not be available
    ]);

    const stats = this.calculateStats(slots);
    
    // Calculate zone occupancy
    const zonesWithOccupancy = zones.map(zone => {
      const zoneSlots = slots.filter(s => s.zoneId === zone.id);
      const totalSlots = zoneSlots.length;
      const availableSlots = zoneSlots.filter(s => s.currentStatus === 'Available').length;
      const occupiedSlots = zoneSlots.filter(s => s.currentStatus === 'Occupied').length;
      const maintenanceSlots = zoneSlots.filter(s => s.currentStatus === 'Maintenance').length;

      return {
        ...zone,
        totalSlots,
        availableSlots,
        occupiedSlots,
        maintenanceSlots,
      };
    });

    return {
      stats,
      parkingAreas,
      zones: zonesWithOccupancy,
      predictions,
    };
  },
};

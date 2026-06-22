import api from './api';
import type { ParkingSlot, SlotStatus } from '../types';

export interface UpdateSlotStatusRequest {
  newStatus: SlotStatus;
  reason?: string;
}

export const slotService = {
  // Get all parking slots
  async getAllSlots(): Promise<ParkingSlot[]> {
    const response = await api.get<ParkingSlot[]>('/api/parking-slots');
    return response.data;
  },

  // Get slot by ID
  async getSlotById(id: string): Promise<ParkingSlot> {
    const response = await api.get<ParkingSlot>(`/api/parking-slots/${id}`);
    return response.data;
  },

  // Update slot status
  async updateSlotStatus(id: string, request: UpdateSlotStatusRequest): Promise<void> {
    await api.post(`/api/parking-slots/${id}/status`, request);
  },
};

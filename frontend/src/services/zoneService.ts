import api from './api';

export interface Zone {
  id: string;
  parkingAreaId: string;
  name: string;
  description?: string;
  mapColorHex?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateZoneDto {
  parkingAreaId: string;
  name: string;
  description?: string;
  mapColorHex?: string;
  sortOrder: number;
}

export interface UpdateZoneDto {
  parkingAreaId: string;
  name: string;
  description?: string;
  mapColorHex?: string;
  sortOrder: number;
}

class ZoneService {
  async getAll(): Promise<Zone[]> {
    const response = await api.get<Zone[]>('/zones');
    return response.data;
  }

  async getById(id: string): Promise<Zone> {
    const response = await api.get<Zone>(`/zones/${id}`);
    return response.data;
  }

  async getByParkingAreaId(parkingAreaId: string): Promise<Zone[]> {
    const response = await api.get<Zone[]>(`/zones/parking-area/${parkingAreaId}`);
    return response.data;
  }

  async create(data: CreateZoneDto): Promise<Zone> {
    const response = await api.post<Zone>('/zones', data);
    return response.data;
  }

  async update(id: string, data: UpdateZoneDto): Promise<Zone> {
    const response = await api.put<Zone>(`/zones/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/zones/${id}`);
  }
}

export const zoneService = new ZoneService();

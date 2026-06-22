import api from './api';

export interface ParkingArea {
  id: string;
  name: string;
  address?: string;
  description?: string;
  totalCapacity: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateParkingAreaDto {
  name: string;
  address?: string;
  description?: string;
}

export interface UpdateParkingAreaDto {
  name: string;
  address?: string;
  description?: string;
}

class ParkingAreaService {
  async getAll(): Promise<ParkingArea[]> {
    const response = await api.get<ParkingArea[]>('/parking-areas');
    return response.data;
  }

  async getById(id: string): Promise<ParkingArea> {
    const response = await api.get<ParkingArea>(`/parking-areas/${id}`);
    return response.data;
  }

  async create(data: CreateParkingAreaDto): Promise<ParkingArea> {
    const response = await api.post<ParkingArea>('/parking-areas', data);
    return response.data;
  }

  async update(id: string, data: UpdateParkingAreaDto): Promise<ParkingArea> {
    const response = await api.put<ParkingArea>(`/parking-areas/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/parking-areas/${id}`);
  }
}

export const parkingAreaService = new ParkingAreaService();

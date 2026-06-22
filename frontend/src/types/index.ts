// User and Authentication Types
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export type UserRole = 'SuperAdmin' | 'Admin' | 'Staff';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Parking Types
export interface ParkingArea {
  id: string;
  name: string;
  location: string;
  totalCapacity: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Zone {
  id: string;
  parkingAreaId: string;
  parkingAreaName?: string;
  name: string;
  floorLevel: number;
  capacity: number;
  mapColor: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ParkingSlot {
  id: string;
  zoneId: string;
  zoneName?: string;
  parkingAreaName?: string;
  slotNumber: string;
  currentStatus: SlotStatus;
  vehicleType: VehicleType;
  lastStatusChange?: string;
  xCoordinate: number;
  yCoordinate: number;
  isSensorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SlotStatus = 'Available' | 'Occupied' | 'Maintenance';
export type VehicleType = 'Car' | 'Motorcycle' | 'SUV' | 'Truck';

// Prediction Types
export interface PredictionWindow {
  forecastTime: string;
  predictedOccupiedSlots: number;
  predictedAvailableSlots: number;
  predictedOccupancyPercentage: number;
  confidenceLevel: string;
  confidenceScore: number;
}

export interface ZonePrediction {
  zoneId: string;
  zoneName: string;
  parkingAreaName: string;
  totalSlots: number;
  currentOccupiedSlots: number;
  currentOccupancyPercentage: number;
  historicalAverageOccupancy: number;
  peakHourOccupancy: number;
  predictions: PredictionWindow[];
  generatedAt: string;
}

export interface ParkingAreaPrediction {
  parkingAreaId: string;
  parkingAreaName: string;
  totalSlots: number;
  currentOccupiedSlots: number;
  currentOccupancyPercentage: number;
  historicalAverageOccupancy: number;
  peakHourOccupancy: number;
  predictions: PredictionWindow[];
  zoneBreakdowns: ZonePrediction[];
  generatedAt: string;
}

export interface DashboardPrediction {
  totalSlots: number;
  currentOccupiedSlots: number;
  currentOccupancyPercentage: number;
  historicalAverageOccupancy: number;
  predictions: PredictionWindow[];
  parkingAreaBreakdowns: ParkingAreaPrediction[];
  generatedAt: string;
}

// SignalR Event Types
export interface SlotStatusChangedEvent {
  slotId: string;
  slotNumber: string;
  zoneId: string;
  previousStatus: string;
  newStatus: string;
  changedAt: string;
  changedBy?: string;
}

export interface ZoneOccupancyUpdatedEvent {
  zoneId: string;
  totalSlots: number;
  availableSlots: number;
  occupiedSlots: number;
  maintenanceSlots: number;
  occupancyPercentage: number;
}

export interface ParkingAreaUpdatedEvent {
  parkingAreaId: string;
  totalSlots: number;
  availableSlots: number;
  occupiedSlots: number;
  maintenanceSlots: number;
}

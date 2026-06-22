// Incident Types
export type IncidentType = 
  | 'DamagedSlot' 
  | 'IllegalParking' 
  | 'SensorFailure' 
  | 'VehicleObstruction' 
  | 'MaintenanceRequest' 
  | 'Other';

export type IncidentPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type IncidentStatus = 'Open' | 'InProgress' | 'Resolved' | 'Closed';

export interface Incident {
  id: string;
  title: string;
  description: string;
  incidentType: IncidentType;
  priority: IncidentPriority;
  status: IncidentStatus;
  parkingAreaId: string;
  parkingAreaName?: string;
  zoneId?: string;
  zoneName?: string;
  parkingSlotId?: string;
  slotNumber?: string;
  reportedBy?: string;
  assignedTo?: string;
  assignedToName?: string;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
}

export interface CreateIncidentRequest {
  title: string;
  description: string;
  incidentType: IncidentType;
  priority: IncidentPriority;
  parkingAreaId: string;
  zoneId?: string;
  parkingSlotId?: string;
}

export interface UpdateIncidentStatusRequest {
  status: IncidentStatus;
  resolutionNotes?: string;
  assignedTo?: string;
}

export interface IncidentTimeline {
  id: string;
  incidentId: string;
  action: string;
  description: string;
  performedBy: string;
  performedByName?: string;
  createdAt: string;
}

export interface IncidentDashboardStats {
  totalIncidents: number;
  openIncidents: number;
  inProgressIncidents: number;
  resolvedIncidents: number;
  closedIncidents: number;
  criticalIncidents: number;
  resolvedToday: number;
}

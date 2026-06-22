import api from './api';
import type { 
  Incident, 
  CreateIncidentRequest, 
  UpdateIncidentStatusRequest,
  IncidentTimeline,
  IncidentDashboardStats,
  IncidentStatus
} from '../types/incident';

export const incidentService = {
  // Get all incidents with optional filters
  async getIncidents(status?: IncidentStatus, search?: string): Promise<Incident[]> {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (search) params.append('search', search);
      
      const response = await api.get<Incident[]>(`/api/incidents?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Incidents API not available, using mock data');
      return this.getMockIncidents(status);
    }
  },

  // Get incident by ID
  async getIncidentById(id: string): Promise<Incident> {
    try {
      const response = await api.get<Incident>(`/api/incidents/${id}`);
      return response.data;
    } catch (error) {
      console.error('Incident API not available, using mock data');
      return this.getMockIncidentById(id);
    }
  },

  // Create new incident
  async createIncident(request: CreateIncidentRequest): Promise<Incident> {
    try {
      const response = await api.post<Incident>('/api/incidents', request);
      return response.data;
    } catch (error) {
      console.error('Create incident API not available, using mock data');
      return this.createMockIncident(request);
    }
  },

  // Update incident status
  async updateIncidentStatus(id: string, request: UpdateIncidentStatusRequest): Promise<void> {
    try {
      await api.patch(`/api/incidents/${id}/status`, request);
    } catch (error) {
      console.error('Update incident API not available, simulating update');
    }
  },

  // Assign incident
  async assignIncident(id: string, userId: string): Promise<void> {
    try {
      await api.patch(`/api/incidents/${id}/assign`, { userId });
    } catch (error) {
      console.error('Assign incident API not available, simulating assignment');
    }
  },

  // Get incident timeline
  async getIncidentTimeline(id: string): Promise<IncidentTimeline[]> {
    try {
      const response = await api.get<IncidentTimeline[]>(`/api/incidents/${id}/timeline`);
      return response.data;
    } catch (error) {
      console.error('Timeline API not available, using mock data');
      return this.getMockTimeline(id);
    }
  },

  // Get dashboard stats
  async getDashboardStats(): Promise<IncidentDashboardStats> {
    try {
      const response = await api.get<IncidentDashboardStats>('/api/incidents/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Stats API not available, using mock data');
      return this.getMockStats();
    }
  },

  // Mock data methods
  getMockIncidents(status?: IncidentStatus): Incident[] {
    const allIncidents: Incident[] = [
      {
        id: '1',
        title: 'Damaged Parking Slot A-15',
        description: 'Physical damage to parking slot barrier',
        incidentType: 'DamagedSlot',
        priority: 'High',
        status: 'Open',
        parkingAreaId: '1',
        parkingAreaName: 'Ayala Malls Abreeza',
        zoneId: '1',
        zoneName: 'Zone A',
        parkingSlotId: '15',
        slotNumber: 'A-15',
        reportedBy: 'staff-001',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Illegal Parking in Fire Lane',
        description: 'Vehicle parked in emergency access area',
        incidentType: 'IllegalParking',
        priority: 'Critical',
        status: 'InProgress',
        parkingAreaId: '1',
        parkingAreaName: 'Ayala Malls Abreeza',
        zoneId: '2',
        zoneName: 'Zone B',
        reportedBy: 'staff-002',
        assignedTo: 'staff-003',
        assignedToName: 'John Doe',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 1800000).toISOString(),
      },
      {
        id: '3',
        title: 'Sensor Malfunction C-23',
        description: 'Parking sensor not detecting vehicle presence',
        incidentType: 'SensorFailure',
        priority: 'Medium',
        status: 'Resolved',
        parkingAreaId: '1',
        parkingAreaName: 'Ayala Malls Abreeza',
        zoneId: '3',
        zoneName: 'Zone C',
        parkingSlotId: '23',
        slotNumber: 'C-23',
        reportedBy: 'staff-001',
        assignedTo: 'tech-001',
        assignedToName: 'Jane Smith',
        resolutionNotes: 'Sensor replaced and recalibrated',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 7200000).toISOString(),
        resolvedAt: new Date(Date.now() - 7200000).toISOString(),
      },
    ];

    if (status) {
      return allIncidents.filter(i => i.status === status);
    }
    return allIncidents;
  },

  getMockIncidentById(id: string): Incident {
    const incidents = this.getMockIncidents();
    return incidents.find(i => i.id === id) || incidents[0];
  },

  createMockIncident(request: CreateIncidentRequest): Incident {
    return {
      id: Date.now().toString(),
      ...request,
      status: 'Open',
      reportedBy: 'current-user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  getMockTimeline(incidentId: string): IncidentTimeline[] {
    return [
      {
        id: '1',
        incidentId,
        action: 'Created',
        description: 'Incident created',
        performedBy: 'staff-001',
        performedByName: 'Staff User',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: '2',
        incidentId,
        action: 'Status Changed',
        description: 'Status changed from Open to In Progress',
        performedBy: 'admin-001',
        performedByName: 'Admin User',
        createdAt: new Date(Date.now() - 1800000).toISOString(),
      },
    ];
  },

  getMockStats(): IncidentDashboardStats {
    return {
      totalIncidents: 15,
      openIncidents: 3,
      inProgressIncidents: 5,
      resolvedIncidents: 6,
      closedIncidents: 1,
      criticalIncidents: 2,
      resolvedToday: 4,
    };
  },
};

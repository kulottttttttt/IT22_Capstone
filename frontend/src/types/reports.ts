export type ReportType = 
  | 'DailyOccupancy'
  | 'WeeklyOccupancy'
  | 'MonthlyOccupancy'
  | 'Incident'
  | 'ParkingUtilization';

export interface ReportFilters {
  startDate: string;
  endDate: string;
  parkingAreaId?: string;
  zoneId?: string;
  incidentStatus?: string;
  incidentType?: string;
}

export interface ReportData {
  reportType: ReportType;
  generatedAt: string;
  filters: ReportFilters;
  summary: ReportSummary;
  occupancyData: OccupancyRecord[];
  incidentData: IncidentRecord[];
  utilizationData: UtilizationRecord[];
  predictionData: PredictionRecord[];
}

export interface ReportSummary {
  totalSlots: number;
  averageOccupancy: number;
  peakOccupancy: number;
  peakOccupancyTime: string;
  availableSlots: number;
  totalIncidents: number;
  resolvedIncidents: number;
  pendingIncidents: number;
}

export interface OccupancyRecord {
  date: string;
  hour?: number;
  totalSlots: number;
  occupiedSlots: number;
  availableSlots: number;
  maintenanceSlots: number;
  occupancyRate: number;
}

export interface IncidentRecord {
  id: string;
  title: string;
  type: string;
  priority: string;
  status: string;
  zone: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface UtilizationRecord {
  zoneName: string;
  totalSlots: number;
  averageOccupancy: number;
  peakOccupancy: number;
  utilizationRate: number;
}

export interface PredictionRecord {
  time: string;
  predictedOccupancy: number;
  actualOccupancy?: number;
  accuracy?: number;
}

export interface ReportCard {
  type: ReportType;
  title: string;
  description: string;
  icon: string;
  color: string;
}

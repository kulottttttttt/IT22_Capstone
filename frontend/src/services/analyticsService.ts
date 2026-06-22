import api from './api';
import type { DashboardPrediction, ParkingSlot, Zone } from '../types';

export interface OccupancyTrendData {
  hour: string;
  available: number;
  occupied: number;
  maintenance: number;
}

export interface ZonePerformanceData {
  zoneName: string;
  occupancyRate: number;
  availableSlots: number;
  utilizationPercentage: number;
  color: string;
}

export interface PredictionInsights {
  highestDemandPeriod: string;
  lowestDemandPeriod: string;
  peakOccupancyForecast: number;
  recommendations: string[];
}

export const analyticsService = {
  // Get predictions
  async getPredictions(): Promise<DashboardPrediction> {
    const response = await api.get<DashboardPrediction>('/api/predictions/dashboard');
    return response.data;
  },

  // Get occupancy trend (simulated hourly data for today)
  async getOccupancyTrend(slots: ParkingSlot[]): Promise<OccupancyTrendData[]> {
    const now = new Date();
    const currentHour = now.getHours();
    
    const trendData: OccupancyTrendData[] = [];
    
    // Generate data for past 24 hours
    for (let i = 23; i >= 0; i--) {
      const hour = (currentHour - i + 24) % 24;
      const hourStr = `${hour.toString().padStart(2, '0')}:00`;
      
      // Simulate trend based on typical parking patterns
      let occupancyFactor = 0.5; // Base 50% occupancy
      
      // Peak hours (8-10 AM, 5-7 PM)
      if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19)) {
        occupancyFactor = 0.85;
      }
      // Lunch hours (12-2 PM)
      else if (hour >= 12 && hour <= 14) {
        occupancyFactor = 0.70;
      }
      // Evening (8 PM - midnight)
      else if (hour >= 20) {
        occupancyFactor = 0.40;
      }
      // Early morning (1-6 AM)
      else if (hour >= 1 && hour <= 6) {
        occupancyFactor = 0.20;
      }
      
      // For current hour, use actual data
      if (i === 0) {
        const availableCount = slots.filter(s => s.currentStatus === 'Available').length;
        const occupiedCount = slots.filter(s => s.currentStatus === 'Occupied').length;
        const maintenanceCount = slots.filter(s => s.currentStatus === 'Maintenance').length;
        
        trendData.push({
          hour: hourStr,
          available: availableCount,
          occupied: occupiedCount,
          maintenance: maintenanceCount,
        });
      } else {
        // Simulated historical data
        const occupiedCount = Math.round(slots.length * occupancyFactor);
        const maintenanceCount = Math.round(slots.length * 0.05); // 5% maintenance
        const availableCount = slots.length - occupiedCount - maintenanceCount;
        
        trendData.push({
          hour: hourStr,
          available: Math.max(0, availableCount),
          occupied: occupiedCount,
          maintenance: maintenanceCount,
        });
      }
    }
    
    return trendData;
  },

  // Get zone performance data
  async getZonePerformance(zones: Zone[], slots: ParkingSlot[]): Promise<ZonePerformanceData[]> {
    return zones.map(zone => {
      const zoneSlots = slots.filter(s => s.zoneId === zone.id);
      const occupiedCount = zoneSlots.filter(s => s.currentStatus === 'Occupied').length;
      const availableCount = zoneSlots.filter(s => s.currentStatus === 'Available').length;
      const totalCount = zoneSlots.length;
      
      const occupancyRate = totalCount > 0 ? (occupiedCount / totalCount) * 100 : 0;
      const utilizationPercentage = totalCount > 0 ? ((occupiedCount / zone.capacity) * 100) : 0;
      
      return {
        zoneName: zone.name,
        occupancyRate: Math.round(occupancyRate * 10) / 10,
        availableSlots: availableCount,
        utilizationPercentage: Math.round(utilizationPercentage * 10) / 10,
        color: zone.mapColor,
      };
    });
  },

  // Generate prediction insights
  getPredictionInsights(prediction: DashboardPrediction): PredictionInsights {
    const predictions = prediction.predictions || [];
    
    if (predictions.length === 0) {
      return {
        highestDemandPeriod: 'N/A',
        lowestDemandPeriod: 'N/A',
        peakOccupancyForecast: 0,
        recommendations: ['Insufficient data for insights'],
      };
    }
    
    // Find highest and lowest demand periods
    const sortedByOccupancy = [...predictions].sort(
      (a, b) => b.predictedOccupancyPercentage - a.predictedOccupancyPercentage
    );
    
    const highest = sortedByOccupancy[0];
    const lowest = sortedByOccupancy[sortedByOccupancy.length - 1];
    
    // Format time
    const formatTime = (isoString: string) => {
      const date = new Date(isoString);
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };
    
    // Generate recommendations
    const recommendations: string[] = [];
    
    if (highest.predictedOccupancyPercentage > 90) {
      recommendations.push('⚠️ Near capacity expected. Consider directing visitors to alternative areas.');
    }
    
    if (highest.predictedOccupancyPercentage > 80) {
      recommendations.push('📢 High demand period ahead. Increase staff availability.');
    }
    
    if (lowest.predictedOccupancyPercentage < 30) {
      recommendations.push('✅ Low demand period. Good time for maintenance activities.');
    }
    
    if (highest.confidenceLevel === 'High') {
      recommendations.push('🎯 High confidence predictions. Data is reliable for planning.');
    } else if (highest.confidenceLevel === 'Low') {
      recommendations.push('⚡ Low confidence predictions. Collect more historical data.');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('✓ Normal occupancy expected. No special actions required.');
    }
    
    return {
      highestDemandPeriod: formatTime(highest.forecastTime),
      lowestDemandPeriod: formatTime(lowest.forecastTime),
      peakOccupancyForecast: Math.round(highest.predictedOccupancyPercentage),
      recommendations,
    };
  },
};

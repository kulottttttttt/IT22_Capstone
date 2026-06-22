import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '../services/analyticsService';
import { dashboardService } from '../services/dashboardService';
import { slotService } from '../services/slotService';
import type { DashboardPrediction } from '../types';
import type { OccupancyTrendData, ZonePerformanceData, PredictionInsights } from '../services/analyticsService';

export type AnalyticsFilter = 'today' | 'last7days' | 'last30days';

interface UseAnalyticsReturn {
  prediction: DashboardPrediction | null;
  occupancyTrend: OccupancyTrendData[];
  zonePerformance: ZonePerformanceData[];
  insights: PredictionInsights | null;
  loading: boolean;
  error: string | null;
  filter: AnalyticsFilter;
  setFilter: (filter: AnalyticsFilter) => void;
  refresh: () => Promise<void>;
}

export const useAnalytics = (): UseAnalyticsReturn => {
  const [prediction, setPrediction] = useState<DashboardPrediction | null>(null);
  const [occupancyTrend, setOccupancyTrend] = useState<OccupancyTrendData[]>([]);
  const [zonePerformance, setZonePerformance] = useState<ZonePerformanceData[]>([]);
  const [insights, setInsights] = useState<PredictionInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<AnalyticsFilter>('today');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all required data in parallel
      const [predictionData, zones, slots] = await Promise.all([
        analyticsService.getPredictions(),
        dashboardService.getZones(),
        slotService.getAllSlots(),
      ]);

      setPrediction(predictionData);

      // Generate analytics
      const trendData = await analyticsService.getOccupancyTrend(slots);
      setOccupancyTrend(trendData);

      const performanceData = await analyticsService.getZonePerformance(zones, slots);
      setZonePerformance(performanceData);

      const insightsData = analyticsService.getPredictionInsights(predictionData);
      setInsights(insightsData);

    } catch (err: any) {
      console.error('Error fetching analytics data:', err);
      setError(err.response?.data?.message || 'Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData, filter]);

  return {
    prediction,
    occupancyTrend,
    zonePerformance,
    insights,
    loading,
    error,
    filter,
    setFilter,
    refresh,
  };
};

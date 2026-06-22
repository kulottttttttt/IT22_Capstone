import { useState, useEffect, useCallback } from 'react';
import { dashboardService, type DashboardStats, type ZoneWithOccupancy } from '../services/dashboardService';
import type { ParkingArea, DashboardPrediction } from '../types';

interface DashboardData {
  stats: DashboardStats | null;
  parkingAreas: ParkingArea[];
  zones: ZoneWithOccupancy[];
  predictions: DashboardPrediction | null;
}

interface UseDashboardDataReturn {
  data: DashboardData;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useDashboardData = (): UseDashboardDataReturn => {
  const [data, setData] = useState<DashboardData>({
    stats: null,
    parkingAreas: [],
    zones: [],
    predictions: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const dashboardData = await dashboardService.getDashboardData();

      setData({
        stats: dashboardData.stats,
        parkingAreas: dashboardData.parkingAreas,
        zones: dashboardData.zones,
        predictions: dashboardData.predictions,
      });
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh };
};

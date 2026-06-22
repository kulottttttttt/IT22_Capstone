import { useState, useEffect, useCallback } from 'react';
import { incidentService } from '../services/incidentService';
import type { Incident, IncidentStatus, IncidentDashboardStats } from '../types/incident';

interface UseIncidentsReturn {
  incidents: Incident[];
  stats: IncidentDashboardStats | null;
  loading: boolean;
  error: string | null;
  statusFilter: IncidentStatus | 'All';
  searchQuery: string;
  setStatusFilter: (status: IncidentStatus | 'All') => void;
  setSearchQuery: (query: string) => void;
  refresh: () => Promise<void>;
}

export const useIncidents = (): UseIncidentsReturn => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [stats, setStats] = useState<IncidentDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const statusParam = statusFilter === 'All' ? undefined : statusFilter;
      const [incidentsData, statsData] = await Promise.all([
        incidentService.getIncidents(statusParam, searchQuery || undefined),
        incidentService.getDashboardStats(),
      ]);

      setIncidents(incidentsData);
      setStats(statsData);
    } catch (err: any) {
      console.error('Error fetching incidents:', err);
      setError(err.response?.data?.message || 'Failed to load incidents. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery]);

  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    incidents,
    stats,
    loading,
    error,
    statusFilter,
    searchQuery,
    setStatusFilter,
    setSearchQuery,
    refresh,
  };
};

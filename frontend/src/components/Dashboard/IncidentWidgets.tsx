import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from './StatCard';
import { incidentService } from '../../services/incidentService';
import type { IncidentDashboardStats } from '../../types/incident';

export const IncidentWidgets: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<IncidentDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await incidentService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load incident stats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading || !stats) {
    return null;
  }

  return (
    <>
      <div onClick={() => navigate('/incidents?status=Open')}>
        <StatCard
          title="Open Incidents"
          value={stats.openIncidents}
          icon="🚨"
          color="red"
          subtitle="Requires attention"
        />
      </div>
      
      <div onClick={() => navigate('/incidents?status=Critical')}>
        <StatCard
          title="Critical Incidents"
          value={stats.criticalIncidents}
          icon="⚠️"
          color="orange"
          subtitle="High priority"
        />
      </div>
      
      <div onClick={() => navigate('/incidents?status=Resolved')}>
        <StatCard
          title="Resolved Today"
          value={stats.resolvedToday}
          icon="✓"
          color="green"
          subtitle="Completed incidents"
        />
      </div>
    </>
  );
};

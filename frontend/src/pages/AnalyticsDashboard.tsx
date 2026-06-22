import React from 'react';
import { PageHeader } from '../components/Layout/PageHeader';
import { StatCard } from '../components/Dashboard/StatCard';
import { LoadingState } from '../components/Dashboard/LoadingState';
import { ErrorState } from '../components/Dashboard/ErrorState';
import { EmptyState } from '../components/Dashboard/EmptyState';
import { OccupancyTrendChart } from '../components/Analytics/OccupancyTrendChart';
import { PredictionForecastChart } from '../components/Analytics/PredictionForecastChart';
import { ZonePerformanceChart } from '../components/Analytics/ZonePerformanceChart';
import { ParkingAreaSummary } from '../components/Analytics/ParkingAreaSummary';
import { PredictionInsightsPanel } from '../components/Analytics/PredictionInsightsPanel';
import { useAnalytics } from '../hooks/useAnalytics';

export const AnalyticsDashboard: React.FC = () => {
  const {
    prediction,
    occupancyTrend,
    zonePerformance,
    insights,
    loading,
    error,
    filter,
    setFilter,
    refresh,
  } = useAnalytics();

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Analytics & Predictions"
          subtitle="Data-driven insights and occupancy forecasts"
        />
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader
          title="Analytics & Predictions"
          subtitle="Data-driven insights and occupancy forecasts"
        />
        <ErrorState message={error} onRetry={refresh} />
      </div>
    );
  }

  if (!prediction) {
    return (
      <div>
        <PageHeader
          title="Analytics & Predictions"
          subtitle="Data-driven insights and occupancy forecasts"
        />
        <EmptyState
          icon="📊"
          title="No Analytics Data"
          message="No prediction data available at this time"
        />
      </div>
    );
  }

  const currentOccupancy = prediction.currentOccupancyPercentage || 0;
  const nextPrediction = prediction.predictions?.[0];
  const predictedOccupancy = nextPrediction?.predictedOccupancyPercentage || 0;
  const availableSlots = prediction.totalSlots - prediction.currentOccupiedSlots;
  
  const peakPrediction = prediction.predictions?.reduce((max, p) => 
    p.predictedOccupancyPercentage > max.predictedOccupancyPercentage ? p : max
  , prediction.predictions[0]);
  
  const formatTime = (isoString?: string) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <PageHeader
        title="Analytics & Predictions"
        subtitle="Data-driven insights and occupancy forecasts"
      />

      {/* Filter Tabs & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-lg shadow-md px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 mr-2">Time Period:</span>
          <button
            onClick={() => setFilter('today')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'today'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setFilter('last7days')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'last7days'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setFilter('last30days')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'last30days'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Last 30 Days
          </button>
        </div>
        
        <button
          onClick={refresh}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current Occupancy"
          value={`${currentOccupancy.toFixed(1)}%`}
          icon="📊"
          color="blue"
          subtitle={`${prediction.currentOccupiedSlots} occupied`}
        />
        <StatCard
          title="Predicted Occupancy"
          value={`${predictedOccupancy.toFixed(1)}%`}
          icon="🔮"
          color="purple"
          subtitle={`in 30 minutes`}
        />
        <StatCard
          title="Available Slots"
          value={availableSlots}
          icon="✓"
          color="green"
          subtitle={`out of ${prediction.totalSlots} total`}
        />
        <StatCard
          title="Peak Hour Forecast"
          value={formatTime(peakPrediction?.forecastTime)}
          icon="⚠"
          color="orange"
          subtitle={`${peakPrediction?.predictedOccupancyPercentage.toFixed(1)}% expected`}
        />
      </div>

      {/* Main Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OccupancyTrendChart data={occupancyTrend} />
        <PredictionForecastChart predictions={prediction.predictions || []} />
      </div>

      {/* Main Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ZonePerformanceChart data={zonePerformance} />
        </div>
        <div>
          <ParkingAreaSummary prediction={prediction} />
        </div>
      </div>

      {/* Insights Panel */}
      {insights && (
        <PredictionInsightsPanel insights={insights} />
      )}

      {/* Last Updated */}
      <div className="text-center text-sm text-gray-500">
        Last updated: {new Date(prediction.generatedAt).toLocaleString()}
      </div>
    </div>
  );
};

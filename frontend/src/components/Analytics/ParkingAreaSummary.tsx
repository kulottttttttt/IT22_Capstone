import React from 'react';
import type { DashboardPrediction } from '../../types';

interface ParkingAreaSummaryProps {
  prediction: DashboardPrediction;
}

export const ParkingAreaSummary: React.FC<ParkingAreaSummaryProps> = ({ prediction }) => {
  const currentOccupancy = prediction.currentOccupancyPercentage || 0;
  
  // Get next prediction (30 min)
  const nextPrediction = prediction.predictions?.[0];
  const predictedOccupancy = nextPrediction?.predictedOccupancyPercentage || 0;
  
  // Determine peak hour (highest occupancy in predictions)
  const peakPrediction = prediction.predictions?.reduce((max, p) => 
    p.predictedOccupancyPercentage > max.predictedOccupancyPercentage ? p : max
  , prediction.predictions[0]);
  
  const formatTime = (isoString?: string) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg p-6 text-white">
      <div className="mb-4">
        <h3 className="text-xl font-bold">Parking Area Summary</h3>
        <p className="text-sm text-blue-100">Overall capacity and predictions</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Total Capacity */}
        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
          <div className="text-3xl font-bold mb-1">{prediction.totalSlots}</div>
          <div className="text-sm text-blue-100">Total Capacity</div>
        </div>

        {/* Current Occupancy */}
        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
          <div className="text-3xl font-bold mb-1">{prediction.currentOccupiedSlots}</div>
          <div className="text-sm text-blue-100">Currently Occupied</div>
          <div className="text-xs text-blue-200 mt-1">{currentOccupancy.toFixed(1)}%</div>
        </div>

        {/* Predicted Occupancy */}
        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
          <div className="text-3xl font-bold mb-1">
            {nextPrediction?.predictedOccupiedSlots || 0}
          </div>
          <div className="text-sm text-blue-100">Predicted (30 min)</div>
          <div className="text-xs text-blue-200 mt-1">{predictedOccupancy.toFixed(1)}%</div>
        </div>

        {/* Peak Hour */}
        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
          <div className="text-3xl font-bold mb-1">
            {formatTime(peakPrediction?.forecastTime)}
          </div>
          <div className="text-sm text-blue-100">Peak Hour Forecast</div>
          <div className="text-xs text-blue-200 mt-1">
            {peakPrediction?.predictedOccupancyPercentage.toFixed(1)}% occupancy
          </div>
        </div>
      </div>

      {/* Occupancy Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-xs text-blue-100 mb-2">
          <span>Current Occupancy</span>
          <span>{currentOccupancy.toFixed(1)}%</span>
        </div>
        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-400 to-yellow-400 transition-all duration-500"
            style={{ width: `${Math.min(100, currentOccupancy)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

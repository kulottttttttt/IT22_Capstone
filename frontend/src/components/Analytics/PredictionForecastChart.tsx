import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import type { PredictionWindow } from '../../types';

interface PredictionForecastChartProps {
  predictions: PredictionWindow[];
}

export const PredictionForecastChart: React.FC<PredictionForecastChartProps> = ({ predictions }) => {
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const chartData = predictions.map(p => ({
    time: formatTime(p.forecastTime),
    occupancy: Math.round(p.predictedOccupancyPercentage),
    confidence: p.confidenceScore,
    confidenceLevel: p.confidenceLevel,
  }));

  const getBarColor = (occupancy: number) => {
    if (occupancy >= 90) return '#ef4444'; // Red - Very High
    if (occupancy >= 75) return '#f59e0b'; // Orange - High
    if (occupancy >= 50) return '#3b82f6'; // Blue - Medium
    return '#10b981'; // Green - Low
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900">Prediction Forecast</h3>
        <p className="text-sm text-gray-600">30min, 1hr, 2hr predictions with confidence levels</p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="time" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            domain={[0, 100]}
            label={{ value: 'Occupancy %', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px'
            }}
            formatter={(value: any, name: any) => {
              if (name === 'occupancy') return [`${value}%`, 'Occupancy'];
              if (name === 'confidence') return [`${Math.round(value * 100)}%`, 'Confidence'];
              return [value, name];
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
          />
          <Bar 
            dataKey="occupancy" 
            name="Predicted Occupancy %"
            radius={[8, 8, 0, 0]}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.occupancy)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Confidence Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-600">
        {chartData.map((entry, index) => (
          <div key={index} className="flex items-center gap-1">
            <div 
              className="w-3 h-3 rounded" 
              style={{ backgroundColor: getBarColor(entry.occupancy) }}
            />
            <span>{entry.time}: {entry.confidenceLevel}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { OccupancyTrendData } from '../../services/analyticsService';

interface OccupancyTrendChartProps {
  data: OccupancyTrendData[];
}

export const OccupancyTrendChart: React.FC<OccupancyTrendChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900">Occupancy Trend</h3>
        <p className="text-sm text-gray-600">Available vs Occupied slots - Last 24 hours</p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="hour" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px'
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
          />
          <Line 
            type="monotone" 
            dataKey="available" 
            stroke="#10b981" 
            strokeWidth={2}
            name="Available"
            dot={{ fill: '#10b981', r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line 
            type="monotone" 
            dataKey="occupied" 
            stroke="#ef4444" 
            strokeWidth={2}
            name="Occupied"
            dot={{ fill: '#ef4444', r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line 
            type="monotone" 
            dataKey="maintenance" 
            stroke="#f59e0b" 
            strokeWidth={2}
            name="Maintenance"
            dot={{ fill: '#f59e0b', r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

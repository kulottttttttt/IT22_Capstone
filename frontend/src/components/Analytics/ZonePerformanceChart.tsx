import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import type { ZonePerformanceData } from '../../services/analyticsService';

interface ZonePerformanceChartProps {
  data: ZonePerformanceData[];
}

export const ZonePerformanceChart: React.FC<ZonePerformanceChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900">Zone Performance</h3>
        <p className="text-sm text-gray-600">Occupancy rate and utilization by zone</p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="zoneName" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            domain={[0, 100]}
            label={{ value: 'Percentage %', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px'
            }}
            formatter={(value: any) => [`${value}%`]}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
          />
          <Bar 
            dataKey="occupancyRate" 
            name="Occupancy Rate"
            radius={[8, 8, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
          <Bar 
            dataKey="utilizationPercentage" 
            name="Utilization"
            fill="#94a3b8"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Zone Details Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Zone</th>
              <th className="px-4 py-2 text-right font-semibold text-gray-700">Occupancy</th>
              <th className="px-4 py-2 text-right font-semibold text-gray-700">Available</th>
              <th className="px-4 py-2 text-right font-semibold text-gray-700">Utilization</th>
            </tr>
          </thead>
          <tbody>
            {data.map((zone, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded" 
                      style={{ backgroundColor: zone.color }}
                    />
                    <span className="font-medium text-gray-900">{zone.zoneName}</span>
                  </div>
                </td>
                <td className="px-4 py-2 text-right text-gray-700">
                  {zone.occupancyRate}%
                </td>
                <td className="px-4 py-2 text-right text-gray-700">
                  {zone.availableSlots}
                </td>
                <td className="px-4 py-2 text-right text-gray-700">
                  {zone.utilizationPercentage}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import React from 'react';
import type { PredictionInsights } from '../../services/analyticsService';

interface PredictionInsightsPanelProps {
  insights: PredictionInsights;
}

export const PredictionInsightsPanel: React.FC<PredictionInsightsPanelProps> = ({ insights }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900">Prediction Insights</h3>
        <p className="text-sm text-gray-600">AI-powered recommendations and forecasts</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="text-xs text-green-700 font-semibold mb-1">LOWEST DEMAND</div>
          <div className="text-2xl font-bold text-green-900">{insights.lowestDemandPeriod}</div>
          <div className="text-xs text-green-600 mt-1">Best time for maintenance</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <div className="text-xs text-orange-700 font-semibold mb-1">HIGHEST DEMAND</div>
          <div className="text-2xl font-bold text-orange-900">{insights.highestDemandPeriod}</div>
          <div className="text-xs text-orange-600 mt-1">Peak occupancy expected</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <div className="text-xs text-red-700 font-semibold mb-1">PEAK OCCUPANCY</div>
          <div className="text-2xl font-bold text-red-900">{insights.peakOccupancyForecast}%</div>
          <div className="text-xs text-red-600 mt-1">Maximum forecast</div>
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-3">📋 Recommendations</h4>
        <div className="space-y-2">
          {insights.recommendations.map((recommendation, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 bg-gray-50 rounded-lg p-3 border border-gray-200"
            >
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {index + 1}
              </div>
              <div className="flex-1 text-sm text-gray-700">
                {recommendation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3">
        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
          Export Report
        </button>
        <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors">
          Share Insights
        </button>
      </div>
    </div>
  );
};

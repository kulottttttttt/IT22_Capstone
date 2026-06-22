import React, { useState } from 'react';
import { PageHeader } from '../components/Layout/PageHeader';
import { reportService } from '../services/reportService';
import { dashboardService } from '../services/dashboardService';
import type { ReportType, ReportFilters, ReportData, ReportCard } from '../types/reports';
import type { ParkingArea, Zone } from '../types';

const reportCards: ReportCard[] = [
  {
    type: 'DailyOccupancy',
    title: 'Daily Occupancy Report',
    description: 'Hourly occupancy breakdown for today',
    icon: '📅',
    color: 'from-blue-500 to-blue-600',
  },
  {
    type: 'WeeklyOccupancy',
    title: 'Weekly Occupancy Report',
    description: 'Daily occupancy summary for the past 7 days',
    icon: '📊',
    color: 'from-green-500 to-green-600',
  },
  {
    type: 'MonthlyOccupancy',
    title: 'Monthly Occupancy Report',
    description: 'Monthly trends and statistics',
    icon: '📈',
    color: 'from-purple-500 to-purple-600',
  },
  {
    type: 'Incident',
    title: 'Incident Report',
    description: 'Comprehensive incident tracking and analysis',
    icon: '🚨',
    color: 'from-red-500 to-red-600',
  },
  {
    type: 'ParkingUtilization',
    title: 'Parking Utilization Report',
    description: 'Zone performance and utilization metrics',
    icon: '🅿️',
    color: 'from-orange-500 to-orange-600',
  },
];

export const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  // Filters
  const [startDate, setStartDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [parkingAreaId, setParkingAreaId] = useState('');
  const [zoneId, setZoneId] = useState('');

  // Data for dropdowns
  const [parkingAreas, setParkingAreas] = useState<ParkingArea[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [filteredZones, setFilteredZones] = useState<Zone[]>([]);

  React.useEffect(() => {
    loadFilterData();
  }, []);

  React.useEffect(() => {
    if (parkingAreaId) {
      const filtered = zones.filter(z => z.parkingAreaId === parkingAreaId);
      setFilteredZones(filtered);
    } else {
      setFilteredZones([]);
    }
    setZoneId('');
  }, [parkingAreaId, zones]);

  const loadFilterData = async () => {
    try {
      const [areasData, zonesData] = await Promise.all([
        dashboardService.getParkingAreas(),
        dashboardService.getZones(),
      ]);
      setParkingAreas(areasData);
      setZones(zonesData);
    } catch (err) {
      console.error('Error loading filter data:', err);
    }
  };

  const handleSelectReport = (type: ReportType) => {
    setSelectedReport(type);
    setReportData(null);
    setError(null);
  };

  const handleGenerateReport = async () => {
    if (!selectedReport) return;

    try {
      setGenerating(true);
      setError(null);

      const filters: ReportFilters = {
        startDate,
        endDate,
        parkingAreaId: parkingAreaId || undefined,
        zoneId: zoneId || undefined,
      };

      const data = await reportService.generateReportData(selectedReport, filters);
      setReportData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const handleExportPDF = () => {
    if (!reportData || !selectedReport) return;
    const reportCard = reportCards.find(r => r.type === selectedReport);
    reportService.exportToPDF(reportData, reportCard?.title || 'Report');
  };

  const handleExportExcel = () => {
    if (!reportData || !selectedReport) return;
    const reportCard = reportCards.find(r => r.type === selectedReport);
    reportService.exportToExcel(reportData, reportCard?.title || 'Report');
  };

  const handlePrintReport = () => {
    reportService.printReport();
  };

  const selectedReportCard = selectedReport ? reportCards.find(r => r.type === selectedReport) : null;

  return (
    <div className="space-y-6 pb-6">
      <PageHeader
        title="Reports & Export"
        subtitle="Generate comprehensive parking reports and export data"
      />

      {/* Report Selection */}
      {!selectedReport && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportCards.map((card) => (
            <button
              key={card.type}
              onClick={() => handleSelectReport(card.type)}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 text-left group"
            >
              <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                {card.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-sm text-gray-600">{card.description}</p>
              <div className="mt-4 text-blue-600 font-medium text-sm flex items-center gap-2">
                Generate Report
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Report Configuration */}
      {selectedReport && !reportData && (
        <div className="space-y-6">
          {/* Selected Report Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${selectedReportCard?.color} flex items-center justify-center text-3xl`}>
                  {selectedReportCard?.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedReportCard?.title}</h2>
                  <p className="text-sm text-gray-600">{selectedReportCard?.description}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedReport(null);
                  setReportData(null);
                }}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Report Filters</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Range */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Parking Area */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Parking Area (Optional)
                </label>
                <select
                  value={parkingAreaId}
                  onChange={(e) => setParkingAreaId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Areas</option>
                  {parkingAreas.map(area => (
                    <option key={area.id} value={area.id}>{area.name}</option>
                  ))}
                </select>
              </div>

              {/* Zone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Zone (Optional)
                </label>
                <select
                  value={zoneId}
                  onChange={(e) => setZoneId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!parkingAreaId}
                >
                  <option value="">All Zones</option>
                  {filteredZones.map(zone => (
                    <option key={zone.id} value={zone.id}>{zone.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={handleGenerateReport}
                disabled={generating}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {generating ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating Report...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Generate Report
                  </>
                )}
              </button>
              <button
                onClick={() => setSelectedReport(null)}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Results */}
      {reportData && selectedReportCard && (
        <div className="space-y-6 print:space-y-4" id="report-content">
          {/* Export Actions (hidden in print) */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 print:hidden">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Report Generated Successfully</h3>
                <p className="text-sm text-gray-600">Export or print your report below</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export PDF
                </button>
                <button
                  onClick={handleExportExcel}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export Excel
                </button>
                <button
                  onClick={handlePrintReport}
                  className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print
                </button>
                <button
                  onClick={() => {
                    setSelectedReport(null);
                    setReportData(null);
                  }}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  New Report
                </button>
              </div>
            </div>
          </div>

          {/* Report Header (visible in print) */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 print:shadow-none print:border-0">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{selectedReportCard.title}</h1>
                <p className="text-sm text-gray-600 mt-2">
                  Generated: {new Date(reportData.generatedAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  Period: {startDate} to {endDate}
                </p>
              </div>
              <div className="text-4xl">{selectedReportCard.icon}</div>
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <SummaryStat label="Total Slots" value={reportData.summary.totalSlots} />
              <SummaryStat label="Avg Occupancy" value={`${reportData.summary.averageOccupancy}%`} />
              <SummaryStat label="Peak Occupancy" value={`${reportData.summary.peakOccupancy}`} subValue={reportData.summary.peakOccupancyTime} />
              <SummaryStat label="Available Slots" value={reportData.summary.availableSlots} />
              <SummaryStat label="Total Incidents" value={reportData.summary.totalIncidents} />
              <SummaryStat label="Resolved" value={reportData.summary.resolvedIncidents} />
              <SummaryStat label="Pending" value={reportData.summary.pendingIncidents} />
            </div>
          </div>

          {/* Occupancy Data */}
          {reportData.occupancyData.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 print:break-inside-avoid">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Hourly Occupancy</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Hour</th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-700">Occupied</th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-700">Available</th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-700">Maintenance</th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-700">Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {reportData.occupancyData.slice(-12).map((record, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2">{record.hour}:00</td>
                        <td className="px-4 py-2 text-right">{record.occupiedSlots}</td>
                        <td className="px-4 py-2 text-right">{record.availableSlots}</td>
                        <td className="px-4 py-2 text-right">{record.maintenanceSlots}</td>
                        <td className="px-4 py-2 text-right font-medium">{record.occupancyRate.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Zone Performance */}
          {reportData.utilizationData.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 print:break-inside-avoid">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Zone Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Zone</th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-700">Total Slots</th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-700">Avg Occupancy</th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-700">Utilization</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {reportData.utilizationData.map((record, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium">{record.zoneName}</td>
                        <td className="px-4 py-2 text-right">{record.totalSlots}</td>
                        <td className="px-4 py-2 text-right">{record.averageOccupancy.toFixed(1)}%</td>
                        <td className="px-4 py-2 text-right font-medium">{record.utilizationRate.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Incidents */}
          {reportData.incidentData.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 print:break-inside-avoid">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Incidents</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Title</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Type</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Priority</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Status</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Zone</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {reportData.incidentData.slice(0, 10).map((record, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2">{record.title}</td>
                        <td className="px-4 py-2">{record.type}</td>
                        <td className="px-4 py-2">{record.priority}</td>
                        <td className="px-4 py-2">{record.status}</td>
                        <td className="px-4 py-2">{record.zone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SummaryStat: React.FC<{ label: string; value: string | number; subValue?: string }> = ({ label, value, subValue }) => (
  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</div>
    <div className="text-2xl font-bold text-gray-900">{value}</div>
    {subValue && <div className="text-xs text-gray-600 mt-1">{subValue}</div>}
  </div>
);

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/Layout/PageHeader';
import { LoadingState } from '../components/Dashboard/LoadingState';
import { ErrorState } from '../components/Dashboard/ErrorState';
import { EmptyState } from '../components/Dashboard/EmptyState';
import { IncidentStatusBadge, IncidentPriorityBadge } from '../components/Incidents/IncidentStatusBadge';
import { useIncidents } from '../hooks/useIncidents';
import { useAuthStore } from '../store/authStore';
import type { IncidentStatus } from '../types/incident';

export const Incidents: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    incidents,
    loading,
    error,
    statusFilter,
    searchQuery,
    setStatusFilter,
    setSearchQuery,
    refresh,
  } = useIncidents();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const canCreateIncident = user && ['Staff', 'Admin', 'SuperAdmin'].includes(user.role);

  // Pagination
  const totalPages = Math.ceil(incidents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedIncidents = incidents.slice(startIndex, endIndex);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getIncidentTypeIcon = (type: string) => {
    switch (type) {
      case 'DamagedSlot': return '🔨';
      case 'IllegalParking': return '🚫';
      case 'SensorFailure': return '📡';
      case 'VehicleObstruction': return '🚧';
      case 'MaintenanceRequest': return '🔧';
      default: return '📋';
    }
  };

  const formatIncidentType = (type: string) => {
    return type.replace(/([A-Z])/g, ' $1').trim();
  };

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Incident Management"
          subtitle="Track and manage parking incidents"
        />
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader
          title="Incident Management"
          subtitle="Track and manage parking incidents"
        />
        <ErrorState message={error} onRetry={refresh} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <PageHeader
        title="Incident Management"
        subtitle="Track and manage parking incidents"
      />

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search incidents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as IncidentStatus | 'All')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All</option>
              <option value="Open">Open</option>
              <option value="InProgress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Create Button */}
          {canCreateIncident && (
            <button
              onClick={() => navigate('/incidents/create')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Incident
            </button>
          )}
        </div>
      </div>

      {/* Incidents Table */}
      {paginatedIncidents.length === 0 ? (
        <EmptyState
          icon="🚨"
          title="No Incidents Found"
          message="No incidents match your current filters"
        />
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Incident
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedIncidents.map((incident) => (
                  <tr key={incident.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{getIncidentTypeIcon(incident.incidentType)}</div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{incident.title}</div>
                          <div className="text-xs text-gray-500 mt-1 line-clamp-2">{incident.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formatIncidentType(incident.incidentType)}
                    </td>
                    <td className="px-6 py-4">
                      <IncidentPriorityBadge priority={incident.priority} />
                    </td>
                    <td className="px-6 py-4">
                      <IncidentStatusBadge status={incident.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div>{incident.zoneName || 'N/A'}</div>
                      {incident.slotNumber && (
                        <div className="text-xs text-gray-500">Slot: {incident.slotNumber}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formatDate(incident.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => navigate(`/incidents/${incident.id}`)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {startIndex + 1} to {Math.min(endIndex, incidents.length)} of {incidents.length} incidents
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

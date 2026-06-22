import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/Layout/PageHeader';
import { LoadingState } from '../components/Dashboard/LoadingState';
import { ErrorState } from '../components/Dashboard/ErrorState';
import { IncidentStatusBadge, IncidentPriorityBadge } from '../components/Incidents/IncidentStatusBadge';
import { incidentService } from '../services/incidentService';
import { useAuthStore } from '../store/authStore';
import type { Incident, IncidentTimeline, IncidentStatus } from '../types/incident';

export const IncidentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [incident, setIncident] = useState<Incident | null>(null);
  const [timeline, setTimeline] = useState<IncidentTimeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newStatus, setNewStatus] = useState<IncidentStatus>('Open');
  const [resolutionNotes, setResolutionNotes] = useState('');

  const canUpdate = user && ['Admin', 'SuperAdmin'].includes(user.role);

  useEffect(() => {
    loadIncidentData();
  }, [id]);

  const loadIncidentData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const [incidentData, timelineData] = await Promise.all([
        incidentService.getIncidentById(id),
        incidentService.getIncidentTimeline(id),
      ]);

      setIncident(incidentData);
      setTimeline(timelineData);
      setNewStatus(incidentData.status);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load incident details');
    } finally {
      setLoading(false);
    }
  };

  const getValidNextStatuses = (currentStatus: IncidentStatus): IncidentStatus[] => {
    switch (currentStatus) {
      case 'Open':
        return ['InProgress', 'Closed'];
      case 'InProgress':
        return ['Resolved', 'Open'];
      case 'Resolved':
        return ['Closed', 'InProgress'];
      case 'Closed':
        return [];
      default:
        return [];
    }
  };

  const handleUpdateStatus = async () => {
    if (!incident || !id) return;

    if (newStatus === incident.status) {
      setError('Please select a different status');
      return;
    }

    if ((newStatus === 'Resolved' || newStatus === 'Closed') && !resolutionNotes.trim()) {
      setError('Resolution notes are required when resolving or closing an incident');
      return;
    }

    try {
      setUpdating(true);
      setError(null);

      await incidentService.updateIncidentStatus(id, {
        status: newStatus,
        resolutionNotes: resolutionNotes.trim() || undefined,
      });

      setShowUpdateModal(false);
      setResolutionNotes('');
      await loadIncidentData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
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
        <PageHeader title="Incident Details" subtitle="View incident information" />
        <LoadingState />
      </div>
    );
  }

  if (error && !incident) {
    return (
      <div>
        <PageHeader title="Incident Details" subtitle="View incident information" />
        <ErrorState message={error} onRetry={loadIncidentData} />
      </div>
    );
  }

  if (!incident) {
    return (
      <div>
        <PageHeader title="Incident Details" subtitle="View incident information" />
        <div className="text-center py-12 text-gray-500">Incident not found</div>
      </div>
    );
  }

  const validNextStatuses = getValidNextStatuses(incident.status);

  return (
    <div className="space-y-6 pb-6">
      <PageHeader title="Incident Details" subtitle={`Incident #${incident.id}`} />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Incident Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl">{getIncidentTypeIcon(incident.incidentType)}</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{incident.title}</h2>
              <div className="flex items-center gap-3 mt-2">
                <IncidentStatusBadge status={incident.status} />
                <IncidentPriorityBadge priority={incident.priority} />
                <span className="text-sm text-gray-600">
                  {formatIncidentType(incident.incidentType)}
                </span>
              </div>
            </div>
          </div>

          {canUpdate && validNextStatuses.length > 0 && (
            <button
              onClick={() => setShowUpdateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Update Status
            </button>
          )}
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailRow label="Description" value={incident.description} />
            <DetailRow label="Parking Area" value={incident.parkingAreaName || 'N/A'} />
            <DetailRow label="Zone" value={incident.zoneName || 'N/A'} />
            <DetailRow label="Parking Slot" value={incident.slotNumber || 'N/A'} />
            <DetailRow label="Reported By" value={incident.reportedBy || 'N/A'} />
            <DetailRow label="Assigned To" value={incident.assignedToName || 'Unassigned'} />
            <DetailRow label="Created" value={formatDate(incident.createdAt)} />
            <DetailRow label="Last Updated" value={formatDate(incident.updatedAt)} />
            {incident.resolvedAt && (
              <DetailRow label="Resolved At" value={formatDate(incident.resolvedAt)} />
            )}
            {incident.closedAt && (
              <DetailRow label="Closed At" value={formatDate(incident.closedAt)} />
            )}
          </div>

          {incident.resolutionNotes && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-sm font-semibold text-green-800 mb-2">Resolution Notes</div>
              <div className="text-sm text-green-700">{incident.resolutionNotes}</div>
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Timeline</h3>
        <div className="space-y-4">
          {timeline.map((event, index) => (
            <div key={event.id} className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full" />
                </div>
                {index < timeline.length - 1 && (
                  <div className="w-0.5 h-12 bg-gray-200 mx-auto mt-2" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-gray-900">{event.action}</div>
                  <div className="text-xs text-gray-500">{formatDate(event.createdAt)}</div>
                </div>
                <div className="text-sm text-gray-600 mt-1">{event.description}</div>
                <div className="text-xs text-gray-500 mt-1">
                  By: {event.performedByName || event.performedBy}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Update Status Modal */}
      {showUpdateModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowUpdateModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Update Status</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Status *
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as IncidentStatus)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    disabled={updating}
                  >
                    <option value={incident.status}>{incident.status} (Current)</option>
                    {validNextStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                {(newStatus === 'Resolved' || newStatus === 'Closed') && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Resolution Notes *
                    </label>
                    <textarea
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      rows={4}
                      placeholder="Describe how the incident was resolved..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={updating}
                    />
                  </div>
                )}

                <div className="flex items-center gap-3 pt-4">
                  <button
                    onClick={handleUpdateStatus}
                    disabled={updating}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    {updating ? 'Updating...' : 'Update'}
                  </button>
                  <button
                    onClick={() => {
                      setShowUpdateModal(false);
                      setResolutionNotes('');
                      setNewStatus(incident.status);
                    }}
                    disabled={updating}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Back Button */}
      <div>
        <button
          onClick={() => navigate('/incidents')}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Incidents
        </button>
      </div>
    </div>
  );
};

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
      {label}
    </div>
    <div className="text-sm text-gray-900">{value}</div>
  </div>
);

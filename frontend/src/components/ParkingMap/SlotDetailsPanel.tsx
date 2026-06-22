import React, { useState } from 'react';
import type { ParkingSlot } from '../../types';
import { useAuthStore } from '../../store/authStore';

interface SlotDetailsPanelProps {
  slot: ParkingSlot | null;
  onClose: () => void;
  onUpdateStatus?: (slotId: string, newStatus: string, reason?: string) => Promise<void>;
}

export const SlotDetailsPanel: React.FC<SlotDetailsPanelProps> = ({ 
  slot, 
  onClose,
  onUpdateStatus 
}) => {
  const { user } = useAuthStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [reason, setReason] = useState('');
  const [updateError, setUpdateError] = useState<string | null>(null);

  const canUpdate = user && ['Staff', 'Admin', 'SuperAdmin'].includes(user.role);

  if (!slot) return null;

  const getStatusColor = () => {
    switch (slot.currentStatus) {
      case 'Available':
        return 'bg-green-500';
      case 'Occupied':
        return 'bg-red-500';
      case 'Maintenance':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (slot.currentStatus) {
      case 'Available':
        return '✓';
      case 'Occupied':
        return '✕';
      case 'Maintenance':
        return '⚠';
      default:
        return '?';
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedStatus || !onUpdateStatus) return;

    if (selectedStatus === slot.currentStatus) {
      setUpdateError('Please select a different status');
      return;
    }

    if (!reason.trim()) {
      setUpdateError('Reason is required');
      return;
    }

    try {
      setIsUpdating(true);
      setUpdateError(null);
      await onUpdateStatus(slot.id, selectedStatus, reason);
      
      // Reset form
      setShowUpdateForm(false);
      setSelectedStatus('');
      setReason('');
    } catch (error: any) {
      setUpdateError(error.message || 'Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-50 overflow-y-auto">
      {/* Header */}
      <div className={`${getStatusColor()} text-white p-6`}>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">{slot.slotNumber}</h2>
            <div className="flex items-center gap-2">
              <span className="text-3xl">{getStatusIcon()}</span>
              <span className="text-lg font-medium">{slot.currentStatus}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Slot Information</h3>
          <div className="space-y-3">
            <DetailRow label="Slot Number" value={slot.slotNumber} />
            <DetailRow label="Status" value={slot.currentStatus} />
            <DetailRow label="Vehicle Type" value={slot.vehicleType} />
            <DetailRow label="Zone" value={slot.zoneName || 'N/A'} />
            <DetailRow label="Parking Area" value={slot.parkingAreaName || 'N/A'} />
          </div>
        </div>

        {/* Technical Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Technical Details</h3>
          <div className="space-y-3">
            <DetailRow 
              label="Sensor Status" 
              value={slot.isSensorEnabled ? 'Enabled 🟢' : 'Disabled ⚫'} 
            />
            <DetailRow label="Coordinates" value={`X: ${slot.xCoordinate}, Y: ${slot.yCoordinate}`} />
            <DetailRow label="Last Updated" value={formatDate(slot.lastStatusChange)} />
            <DetailRow label="Created At" value={formatDate(slot.createdAt)} />
          </div>
        </div>

        {/* Update Status Form */}
        {canUpdate && !showUpdateForm && (
          <button
            onClick={() => setShowUpdateForm(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Update Status
          </button>
        )}

        {canUpdate && showUpdateForm && (
          <div className="border border-gray-200 rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Update Status</h3>
            
            {/* Status Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Status *
              </label>
              <div className="space-y-2">
                {['Available', 'Occupied', 'Maintenance'].map(status => (
                  <label key={status} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={selectedStatus === status}
                      onChange={(e) => {
                        setSelectedStatus(e.target.value);
                        setUpdateError(null);
                      }}
                      disabled={status === slot.currentStatus}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className={status === slot.currentStatus ? 'text-gray-400' : 'text-gray-700'}>
                      {status} {status === slot.currentStatus ? '(current)' : ''}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reason Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason *
              </label>
              <textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setUpdateError(null);
                }}
                placeholder="Enter reason for status change..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Error Message */}
            {updateError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {updateError}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleUpdateStatus}
                disabled={isUpdating}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {isUpdating ? 'Updating...' : 'Update'}
              </button>
              <button
                onClick={() => {
                  setShowUpdateForm(false);
                  setSelectedStatus('');
                  setReason('');
                  setUpdateError(null);
                }}
                disabled={isUpdating}
                className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100">
    <span className="text-sm text-gray-600">{label}</span>
    <span className="text-sm font-medium text-gray-900">{value}</span>
  </div>
);

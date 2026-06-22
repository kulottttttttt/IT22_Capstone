import { useState } from 'react';
import type { ParkingSlot, SlotStatus } from '../../types';

interface UpdateSlotModalProps {
  slot: ParkingSlot;
  onClose: () => void;
  onUpdate: (slotId: string, newStatus: SlotStatus, reason: string) => Promise<void>;
}

export const UpdateSlotModal: React.FC<UpdateSlotModalProps> = ({ slot, onClose, onUpdate }) => {
  const [newStatus, setNewStatus] = useState<SlotStatus>(slot.currentStatus);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newStatus === slot.currentStatus) {
      setError('Please select a different status');
      return;
    }

    if (!reason.trim()) {
      setError('Please provide a reason for the status change');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onUpdate(slot.id, newStatus, reason);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update slot status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: SlotStatus) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Occupied':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Update Slot Status</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Slot: <span className="font-semibold">{slot.slotNumber}</span>
          </p>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Current Status */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Status
            </label>
            <div className={`px-4 py-2 rounded-lg border-2 ${getStatusColor(slot.currentStatus)}`}>
              <span className="font-semibold">{slot.currentStatus}</span>
            </div>
          </div>

          {/* New Status */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Status <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {(['Available', 'Occupied', 'Maintenance'] as SlotStatus[]).map((status) => (
                <label
                  key={status}
                  className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    newStatus === status
                      ? getStatusColor(status) + ' border-current'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={newStatus === status}
                    onChange={(e) => setNewStatus(e.target.value as SlotStatus)}
                    className="mr-3"
                  />
                  <span className="font-medium">{status}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Enter the reason for this status change..."
              required
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || newStatus === slot.currentStatus}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium"
            >
              {isSubmitting ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

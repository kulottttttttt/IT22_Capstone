import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { PageHeader } from '../components/Layout/PageHeader';
import { useLiveMonitoring } from '../hooks/useLiveMonitoring';
import { SlotCard } from '../components/LiveMonitoring/SlotCard';
import { UpdateSlotModal } from '../components/LiveMonitoring/UpdateSlotModal';
import { LoadingState } from '../components/Dashboard/LoadingState';
import { ErrorState } from '../components/Dashboard/ErrorState';
import { EmptyState } from '../components/Dashboard/EmptyState';
import type { ParkingSlot } from '../types';

export const LiveMonitoring: React.FC = () => {
  const { user } = useAuthStore();
  const {
    zones,
    totalSlots,
    availableSlots,
    occupiedSlots,
    maintenanceSlots,
    loading,
    error,
    signalRConnected,
    refresh,
    updateSlotStatus,
  } = useLiveMonitoring();

  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'SuperAdmin': return '/superadmin';
      case 'Admin': return '/admin';
      case 'Staff': return '/staff';
      default: return '/';
    }
  };

  const breadcrumbs = [
    { label: 'Dashboard', path: getDashboardPath() },
    { label: 'Live Monitoring' }
  ];

  // Check if user can update slots (StaffOrHigher)
  const canUpdateSlots = user && ['Staff', 'Admin', 'SuperAdmin'].includes(user.role);

  const handleSlotClick = (slot: ParkingSlot) => {
    if (canUpdateSlots) {
      setSelectedSlot(slot);
    }
  };

  const handleUpdateSlot = async (slotId: string, newStatus: string, reason: string) => {
    await updateSlotStatus(slotId, newStatus, reason);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader 
          title="Live Monitoring" 
          subtitle="Real-time parking occupancy monitoring"
          breadcrumbs={breadcrumbs}
          showBackToDashboard={true}
        />
        <div className="p-8">
          <LoadingState />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Live Monitoring" 
        subtitle="Real-time parking occupancy monitoring"
        breadcrumbs={breadcrumbs}
        showBackToDashboard={true}
      />
      
      <div className="p-8 space-y-6">
        {/* Status Bar */}
        <div className="flex items-center justify-between bg-white rounded-xl shadow-lg p-4 border border-gray-100">
          <div className="flex items-center gap-4">
            {/* Connection Status */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${signalRConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium text-gray-700">
                {signalRConnected ? 'Live Updates Active' : 'Offline'}
              </span>
            </div>
            
            {canUpdateSlots && (
              <div className="text-sm text-gray-600 ml-4">
                💡 Click any slot to update its status
              </div>
            )}
          </div>

          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <span>{loading ? '🔄' : '↻'}</span>
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>

        {/* Error State */}
        {error && (
          <ErrorState message={error} onRetry={refresh} />
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Slots</p>
                <p className="text-3xl font-bold text-gray-900">{totalSlots}</p>
              </div>
              <div className="text-4xl">🅿️</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Available</p>
                <p className="text-3xl font-bold text-green-600">{availableSlots}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Occupied</p>
                <p className="text-3xl font-bold text-red-600">{occupiedSlots}</p>
              </div>
              <div className="text-4xl">🚗</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Maintenance</p>
                <p className="text-3xl font-bold text-yellow-600">{maintenanceSlots}</p>
              </div>
              <div className="text-4xl">🔧</div>
            </div>
          </div>
        </div>

        {/* Zones and Slots */}
        {zones.length === 0 ? (
          <EmptyState
            icon="🗺️"
            title="No Zones Available"
            message="No parking zones have been configured yet."
          />
        ) : (
          <div className="space-y-6">
            {zones.map((zone) => (
              <div key={zone.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                {/* Zone Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{zone.name}</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Floor {zone.floorLevel} • {zone.slots.length} slots
                    </p>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div className="text-center px-4 py-2 bg-green-50 rounded-lg">
                      <div className="font-bold text-green-700 text-xl">{zone.availableCount}</div>
                      <div className="text-gray-600">Available</div>
                    </div>
                    <div className="text-center px-4 py-2 bg-red-50 rounded-lg">
                      <div className="font-bold text-red-700 text-xl">{zone.occupiedCount}</div>
                      <div className="text-gray-600">Occupied</div>
                    </div>
                    <div className="text-center px-4 py-2 bg-yellow-50 rounded-lg">
                      <div className="font-bold text-yellow-700 text-xl">{zone.maintenanceCount}</div>
                      <div className="text-gray-600">Maintenance</div>
                    </div>
                  </div>
                </div>

                {/* Slots Grid */}
                {zone.slots.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No slots configured for this zone
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                    {zone.slots.map((slot) => (
                      <SlotCard
                        key={slot.id}
                        slot={slot}
                        onClick={() => handleSlotClick(slot)}
                        canUpdate={!!canUpdateSlots}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Legend */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Status Legend</h3>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-400 rounded"></div>
              <span className="text-sm text-gray-700">Available - Ready for parking</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-400 rounded"></div>
              <span className="text-sm text-gray-700">Occupied - Vehicle parked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded"></div>
              <span className="text-sm text-gray-700">Maintenance - Under repair</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Sensor enabled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Update Slot Modal */}
      {selectedSlot && (
        <UpdateSlotModal
          slot={selectedSlot}
          onClose={() => setSelectedSlot(null)}
          onUpdate={handleUpdateSlot}
        />
      )}
    </div>
  );
};

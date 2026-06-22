import React from 'react';
import { PageHeader } from '../components/Layout/PageHeader';
import { LoadingState } from '../components/Dashboard/LoadingState';
import { ErrorState } from '../components/Dashboard/ErrorState';
import { EmptyState } from '../components/Dashboard/EmptyState';
import { MapSlot } from '../components/ParkingMap/MapSlot';
import { SlotDetailsPanel } from '../components/ParkingMap/SlotDetailsPanel';
import { useParkingMap } from '../hooks/useParkingMap';
import { StatCard } from '../components/Dashboard/StatCard';

export const ParkingMap: React.FC = () => {
  const {
    zones,
    selectedSlot,
    totalSlots,
    availableSlots,
    occupiedSlots,
    maintenanceSlots,
    loading,
    error,
    signalRConnected,
    setSelectedSlot,
    refresh,
    updateSlotStatus,
  } = useParkingMap();

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Parking Map"
          subtitle="Interactive visual parking slot map with real-time updates"
        />
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader
          title="Parking Map"
          subtitle="Interactive visual parking slot map with real-time updates"
        />
        <ErrorState message={error} onRetry={refresh} />
      </div>
    );
  }

  if (zones.length === 0) {
    return (
      <div>
        <PageHeader
          title="Parking Map"
          subtitle="Interactive visual parking slot map with real-time updates"
        />
        <EmptyState
          icon="🗺️"
          title="No Parking Data"
          message="No parking zones or slots available to display"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <PageHeader
        title="Parking Map"
        subtitle="Interactive visual parking slot map with real-time updates"
      />

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Slots"
          value={totalSlots}
          icon="🅿️"
          color="blue"
        />
        <StatCard
          title="Available"
          value={availableSlots}
          icon="✓"
          color="green"
        />
        <StatCard
          title="Occupied"
          value={occupiedSlots}
          icon="✕"
          color="red"
        />
        <StatCard
          title="Maintenance"
          value={maintenanceSlots}
          icon="⚠"
          color="yellow"
        />
      </div>

      {/* Connection Status & Refresh */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow-md px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${signalRConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-sm font-medium text-gray-700">
              {signalRConnected ? 'Real-time connected' : 'Real-time offline'}
            </span>
          </div>
        </div>
        <button
          onClick={refresh}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow-md px-6 py-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Legend</h3>
        <div className="flex flex-wrap gap-4">
          <LegendItem color="bg-green-500" label="Available" />
          <LegendItem color="bg-red-500" label="Occupied" />
          <LegendItem color="bg-yellow-500" label="Maintenance" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full" />
            <span className="text-sm text-gray-700">Sensor Enabled</span>
          </div>
        </div>
      </div>

      {/* Parking Zones */}
      <div className="space-y-6">
        {zones.map(zone => (
          <div key={zone.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Zone Header */}
            <div
              className="px-6 py-4 text-white"
              style={{ backgroundColor: zone.mapColor }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{zone.name}</h3>
                  <p className="text-sm opacity-90">
                    Floor {zone.floorLevel} • {zone.slots.length} slots
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm opacity-90">Occupancy</div>
                  <div className="text-2xl font-bold">
                    {zone.capacity > 0 ? Math.round((zone.occupiedCount / zone.capacity) * 100) : 0}%
                  </div>
                </div>
              </div>
            </div>

            {/* Zone Stats */}
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-around text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{zone.availableCount}</div>
                  <div className="text-xs text-gray-600">Available</div>
                </div>
                <div className="w-px h-8 bg-gray-300" />
                <div>
                  <div className="text-2xl font-bold text-red-600">{zone.occupiedCount}</div>
                  <div className="text-xs text-gray-600">Occupied</div>
                </div>
                <div className="w-px h-8 bg-gray-300" />
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{zone.maintenanceCount}</div>
                  <div className="text-xs text-gray-600">Maintenance</div>
                </div>
              </div>
            </div>

            {/* Slots Grid */}
            <div className="p-6">
              {zone.slots.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                  {zone.slots.map(slot => (
                    <MapSlot
                      key={slot.id}
                      slot={slot}
                      onClick={setSelectedSlot}
                      isSelected={selectedSlot?.id === slot.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No slots in this zone
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Slot Details Panel */}
      {selectedSlot && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSelectedSlot(null)}
          />
          
          {/* Panel */}
          <SlotDetailsPanel
            slot={selectedSlot}
            onClose={() => setSelectedSlot(null)}
            onUpdateStatus={updateSlotStatus}
          />
        </>
      )}
    </div>
  );
};

const LegendItem: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className={`w-4 h-4 rounded ${color}`} />
    <span className="text-sm text-gray-700">{label}</span>
  </div>
);

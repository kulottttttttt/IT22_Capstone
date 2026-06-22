import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { PageHeader } from '../components/Layout/PageHeader';
import { zoneService, type Zone } from '../services/zoneService';
import { parkingAreaService, type ParkingArea } from '../services/parkingAreaService';
import { CreateZoneModal } from '../components/Zones/CreateZoneModal';
import { EditZoneModal } from '../components/Zones/EditZoneModal';
import { DeleteConfirmModal } from '../components/ParkingAreas/DeleteConfirmModal';
import { Toast } from '../components/Common/Toast';

export const Zones: React.FC = () => {
  const { user } = useAuthStore();
  const [zones, setZones] = useState<Zone[]>([]);
  const [parkingAreas, setParkingAreas] = useState<ParkingArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

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
    { label: 'Zones' }
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      const [zonesData, areasData] = await Promise.all([
        zoneService.getAll(),
        parkingAreaService.getAll(),
      ]);
      setZones(zonesData);
      setParkingAreas(areasData);
      setError(null);
    } catch (err) {
      setError('Failed to load zones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getParkingAreaName = (parkingAreaId: string): string => {
    const area = parkingAreas.find((a) => a.id === parkingAreaId);
    return area?.name || 'Unknown Area';
  };

  const handleCreateSuccess = () => {
    setToast({ message: 'Zone created successfully', type: 'success' });
    loadData();
  };

  const handleEditSuccess = () => {
    setToast({ message: 'Zone updated successfully', type: 'success' });
    loadData();
  };

  const handleDelete = async () => {
    if (!selectedZone) return;

    setDeleteLoading(true);
    try {
      await zoneService.delete(selectedZone.id);
      setToast({ message: 'Zone deleted successfully', type: 'success' });
      setShowDeleteModal(false);
      setSelectedZone(null);
      loadData();
    } catch (error: any) {
      setToast({ 
        message: error.response?.data?.message || 'Failed to delete zone. It may have associated parking slots.', 
        type: 'error' 
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleError = (message: string) => {
    setToast({ message, type: 'error' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Zones" 
        subtitle="Manage parking zones and their configurations"
        breadcrumbs={breadcrumbs}
        showBackToDashboard={true}
      />
      
      <div className="p-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          {/* Header with Add Button */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Zones</h2>
              <p className="text-sm text-gray-600 mt-1">{zones.length} zone(s) configured</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              Add New Zone
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading zones...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 text-5xl mb-4">⚠</div>
                <p className="text-red-600 font-medium">{error}</p>
                <button
                  onClick={loadData}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            ) : zones.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🗺️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Zones Yet</h3>
                <p className="text-gray-600 mb-6">Get started by creating your first zone.</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Create Zone
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {zones.map((zone) => (
                  <div key={zone.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className="w-8 h-8 rounded-full border-2 border-gray-200"
                            style={{ backgroundColor: zone.mapColorHex || '#3B82F6' }}
                          />
                          <h3 className="text-lg font-bold text-gray-900">{zone.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600">{getParkingAreaName(zone.parkingAreaId)}</p>
                      </div>
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                        #{zone.sortOrder}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {zone.description || 'No description'}
                    </p>

                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setSelectedZone(zone);
                          setShowEditModal(true);
                        }}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedZone(zone);
                          setShowDeleteModal(true);
                        }}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateZoneModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
        onError={handleError}
      />

      <EditZoneModal
        isOpen={showEditModal}
        zone={selectedZone}
        onClose={() => {
          setShowEditModal(false);
          setSelectedZone(null);
        }}
        onSuccess={handleEditSuccess}
        onError={handleError}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        title="Delete Zone"
        message={`Are you sure you want to delete "${selectedZone?.name}"? This action cannot be undone. If this zone has parking slots, they will also be affected.`}
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setSelectedZone(null);
        }}
        loading={deleteLoading}
      />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

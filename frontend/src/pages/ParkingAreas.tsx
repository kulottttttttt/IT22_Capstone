import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { PageHeader } from '../components/Layout/PageHeader';
import { parkingAreaService, type ParkingArea } from '../services/parkingAreaService';
import { CreateParkingAreaModal } from '../components/ParkingAreas/CreateParkingAreaModal';
import { EditParkingAreaModal } from '../components/ParkingAreas/EditParkingAreaModal';
import { DeleteConfirmModal } from '../components/ParkingAreas/DeleteConfirmModal';
import { Toast } from '../components/Common/Toast';

export const ParkingAreas: React.FC = () => {
  const { user } = useAuthStore();
  const [parkingAreas, setParkingAreas] = useState<ParkingArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedArea, setSelectedArea] = useState<ParkingArea | null>(null);
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
    { label: 'Parking Areas' }
  ];

  const loadParkingAreas = async () => {
    try {
      setLoading(true);
      const data = await parkingAreaService.getAll();
      setParkingAreas(data);
      setError(null);
    } catch (err) {
      setError('Failed to load parking areas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParkingAreas();
  }, []);

  const handleCreateSuccess = () => {
    setToast({ message: 'Parking area created successfully', type: 'success' });
    loadParkingAreas();
  };

  const handleEditSuccess = () => {
    setToast({ message: 'Parking area updated successfully', type: 'success' });
    loadParkingAreas();
  };

  const handleDelete = async () => {
    if (!selectedArea) return;

    setDeleteLoading(true);
    try {
      await parkingAreaService.delete(selectedArea.id);
      setToast({ message: 'Parking area deleted successfully', type: 'success' });
      setShowDeleteModal(false);
      setSelectedArea(null);
      loadParkingAreas();
    } catch (error: any) {
      setToast({ 
        message: error.response?.data?.message || 'Failed to delete parking area. It may have associated zones.', 
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
        title="Parking Areas" 
        subtitle="Manage parking area configurations"
        breadcrumbs={breadcrumbs}
        showBackToDashboard={true}
      />
      
      <div className="p-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          {/* Header with Add Button */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Parking Areas</h2>
              <p className="text-sm text-gray-600 mt-1">{parkingAreas.length} area(s) configured</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              Add New Parking Area
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading parking areas...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 text-5xl mb-4">⚠</div>
                <p className="text-red-600 font-medium">{error}</p>
                <button
                  onClick={loadParkingAreas}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            ) : parkingAreas.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🅿️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Parking Areas Yet</h3>
                <p className="text-gray-600 mb-6">Get started by creating your first parking area.</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Create Parking Area
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {parkingAreas.map((area) => (
                  <div key={area.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{area.name}</h3>
                        <p className="text-sm text-gray-600">{area.address || 'No address provided'}</p>
                      </div>
                      <div className="text-3xl">🅿️</div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {area.description || 'No description'}
                    </p>

                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                      <div>
                        <p className="text-sm text-gray-500">Capacity</p>
                        <p className="text-2xl font-bold text-blue-600">{area.totalCapacity}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedArea(area);
                          setShowEditModal(true);
                        }}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedArea(area);
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
      <CreateParkingAreaModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
        onError={handleError}
      />

      <EditParkingAreaModal
        isOpen={showEditModal}
        parkingArea={selectedArea}
        onClose={() => {
          setShowEditModal(false);
          setSelectedArea(null);
        }}
        onSuccess={handleEditSuccess}
        onError={handleError}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        title="Delete Parking Area"
        message={`Are you sure you want to delete "${selectedArea?.name}"? This action cannot be undone. If this area has zones or parking slots, they will also be affected.`}
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setSelectedArea(null);
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

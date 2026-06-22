import { useAuthStore } from '../store/authStore';
import { PageHeader } from '../components/Layout/PageHeader';

export const ParkingSlots: React.FC = () => {
  const { user } = useAuthStore();

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
    { label: 'Parking Slots' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Parking Slots" 
        subtitle="Manage individual parking slot configurations"
        breadcrumbs={breadcrumbs}
        showBackToDashboard={true}
      />
      
      <div className="p-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚗</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Parking Slots Management</h2>
            <p className="text-gray-600 mb-6">
              This page will display all parking slots with CRUD operations.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                Add New Parking Slot
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

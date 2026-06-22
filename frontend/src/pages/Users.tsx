import { useAuthStore } from '../store/authStore';
import { PageHeader } from '../components/Layout/PageHeader';

export const Users: React.FC = () => {
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
    { label: 'Users' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="User Management" 
        subtitle="Manage system users and permissions"
        breadcrumbs={breadcrumbs}
        showBackToDashboard={true}
      />
      
      <div className="p-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">User Management</h2>
            <p className="text-gray-600 mb-6">
              This page will display all users with role-based access management.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                Add New User
              </button>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">1</div>
                <div className="text-sm text-gray-600">SuperAdmin</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">3</div>
                <div className="text-sm text-gray-600">Admins</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">5</div>
                <div className="text-sm text-gray-600">Staff</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

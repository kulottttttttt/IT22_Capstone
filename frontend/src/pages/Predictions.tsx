import { useAuthStore } from '../store/authStore';
import { PageHeader } from '../components/Layout/PageHeader';

export const Predictions: React.FC = () => {
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
    { label: 'Predictions' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Occupancy Predictions" 
        subtitle="AI-powered parking occupancy forecasting"
        breadcrumbs={breadcrumbs}
        showBackToDashboard={true}
      />
      
      <div className="p-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔮</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Prediction Analytics</h2>
            <p className="text-gray-600 mb-6">
              This page will display predictive analytics for parking occupancy.
            </p>
            <div className="space-y-4 max-w-2xl mx-auto mt-8">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Next 30 minutes</p>
                  <p className="text-2xl font-bold text-gray-900">68%</p>
                </div>
                <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium">
                  Medium Confidence
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Next 1 hour</p>
                  <p className="text-2xl font-bold text-gray-900">75%</p>
                </div>
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                  High Confidence
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Next 2 hours</p>
                  <p className="text-2xl font-bold text-gray-900">82%</p>
                </div>
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                  High Confidence
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

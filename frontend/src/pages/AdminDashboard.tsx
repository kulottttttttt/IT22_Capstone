import { PageHeader } from '../components/Layout/PageHeader';
import { StatCard } from '../components/Dashboard/StatCard';
import { LoadingCard } from '../components/Dashboard/LoadingState';
import { ErrorState } from '../components/Dashboard/ErrorState';
import { useDashboardData } from '../hooks/useDashboardData';

export const AdminDashboard: React.FC = () => {
  const { data, loading, error, refresh } = useDashboardData();

  const breadcrumbs = [
    { label: 'Dashboard' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Admin Dashboard" 
        subtitle="Parking management and operations"
        breadcrumbs={breadcrumbs}
        showBackToDashboard={false}
      />
      
      <div className="p-8 space-y-6">
        {/* Refresh Button */}
        <div className="flex justify-end">
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <span>{loading ? '🔄' : '↻'}</span>
            <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
          </button>
        </div>

        {/* Error State */}
        {error && (
          <ErrorState message={error} onRetry={refresh} />
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading && !data.stats ? (
            <>
              <LoadingCard />
              <LoadingCard />
              <LoadingCard />
              <LoadingCard />
            </>
          ) : data.stats ? (
            <>
              <StatCard
                title="Total Slots"
                value={data.stats.totalSlots}
                icon="🅿️"
                color="blue"
              />
              <StatCard
                title="Available"
                value={data.stats.availableSlots}
                icon="✅"
                color="green"
              />
              <StatCard
                title="Occupied"
                value={data.stats.occupiedSlots}
                icon="🚗"
                color="red"
              />
              <StatCard
                title="Maintenance"
                value={data.stats.maintenanceSlots}
                icon="🔧"
                color="yellow"
              />
            </>
          ) : null}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Management Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Management</h2>
            <div className="space-y-3">
              <button className="w-full p-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-between">
                <span className="font-medium">Manage Parking Areas</span>
                <span className="text-2xl">🅿️</span>
              </button>
              <button className="w-full p-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-between">
                <span className="font-medium">Manage Zones</span>
                <span className="text-2xl">🗺️</span>
              </button>
              <button className="w-full p-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-between">
                <span className="font-medium">Manage Parking Slots</span>
                <span className="text-2xl">🚗</span>
              </button>
            </div>
          </div>

          {/* Analytics Preview */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Analytics & Predictions</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Average Occupancy Rate</p>
                <p className="text-3xl font-bold text-gray-900">68.5%</p>
                <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" style={{width: '68.5%'}}></div>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Peak Hour Prediction</p>
                <p className="text-3xl font-bold text-gray-900">2:00 PM</p>
                <p className="text-sm text-gray-600 mt-2">Expected: 85% occupancy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-3">
            {[
              { action: 'Zone A capacity updated', time: '5 minutes ago' },
              { action: 'New parking area created: Mall Entrance', time: '1 hour ago' },
              { action: 'Slot B-45 marked for maintenance', time: '2 hours ago' },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <p className="text-sm text-gray-900">{activity.action}</p>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

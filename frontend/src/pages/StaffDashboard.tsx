import { PageHeader } from '../components/Layout/PageHeader';
import { StatCard } from '../components/Dashboard/StatCard';
import { LoadingCard } from '../components/Dashboard/LoadingState';
import { ErrorState } from '../components/Dashboard/ErrorState';
import { useDashboardData } from '../hooks/useDashboardData';

export const StaffDashboard: React.FC = () => {
  const { data, loading, error, refresh } = useDashboardData();

  const breadcrumbs = [
    { label: 'Dashboard' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Staff Dashboard" 
        subtitle="Slot management and monitoring"
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

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
              <div className="text-4xl mb-3">🔄</div>
              <div className="font-semibold">Update Slot Status</div>
            </button>
            <button className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
              <div className="text-4xl mb-3">📋</div>
              <div className="font-semibold">View History</div>
            </button>
            <button className="p-6 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
              <div className="text-4xl mb-3">⚠️</div>
              <div className="font-semibold">Report Incident</div>
            </button>
          </div>
        </div>

        {/* Recent Updates */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Slot Updates</h2>
          <div className="space-y-3">
            {[
              { slot: 'A-123', status: 'Available', zone: 'Zone A', time: '2 min ago', type: 'success' },
              { slot: 'B-045', status: 'Occupied', zone: 'Zone B', time: '5 min ago', type: 'info' },
              { slot: 'C-078', status: 'Maintenance', zone: 'Zone C', time: '10 min ago', type: 'warning' },
              { slot: 'A-089', status: 'Available', zone: 'Zone A', time: '15 min ago', type: 'success' },
            ].map((update, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    update.type === 'success' ? 'bg-green-500' :
                    update.type === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}></div>
                  <div>
                    <p className="font-semibold text-gray-900">Slot {update.slot}</p>
                    <p className="text-sm text-gray-600">{update.zone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    update.status === 'Available' ? 'bg-green-100 text-green-700' :
                    update.status === 'Occupied' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {update.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{update.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

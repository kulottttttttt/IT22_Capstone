import { PageHeader } from '../components/Layout/PageHeader';
import { StatCard } from '../components/Dashboard/StatCard';
import { LoadingCard, LoadingRow } from '../components/Dashboard/LoadingState';
import { ErrorState } from '../components/Dashboard/ErrorState';
import { EmptyState } from '../components/Dashboard/EmptyState';
import { useDashboardData } from '../hooks/useDashboardData';

export const SuperAdminDashboard: React.FC = () => {
  const { data, loading, error, refresh } = useDashboardData();

  const breadcrumbs = [
    { label: 'Dashboard' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="SuperAdmin Dashboard" 
        subtitle="Complete system overview and management"
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Parking Area Overview */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Zone Overview</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All →
              </button>
            </div>
            
            {loading && !data.zones.length ? (
              <div className="space-y-4">
                <LoadingRow />
                <LoadingRow />
                <LoadingRow />
              </div>
            ) : data.zones.length > 0 ? (
              <div className="space-y-4">
                {data.zones.slice(0, 5).map((zone) => (
                  <div key={zone.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-xl">
                        🅿️
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{zone.name}</h3>
                        <p className="text-sm text-gray-600">Floor {zone.floorLevel}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{zone.totalSlots}</p>
                        <p className="text-xs text-gray-600">Total</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{zone.availableSlots}</p>
                        <p className="text-xs text-gray-600">Available</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">{zone.occupiedSlots}</p>
                        <p className="text-xs text-gray-600">Occupied</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon="🗺️"
                title="No Zones Found"
                message="No parking zones have been configured yet."
              />
            )}
          </div>

          {/* System Health */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">System Health</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Server</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">SignalR Hub</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">IoT Sensors</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                  85% Active
                </span>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">System Uptime</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">99.8%</p>
                <p className="text-xs text-blue-700 mt-1">Last 30 days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Predictions & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Prediction Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Occupancy Predictions</h2>
            {loading && !data.predictions ? (
              <div className="space-y-4">
                <div className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            ) : data.predictions && data.predictions.predictions.length > 0 ? (
              <div className="space-y-4">
                {data.predictions.predictions.slice(0, 3).map((prediction, idx) => {
                  const confidenceColor = prediction.confidenceLevel === 'High' ? 'green' : 
                                        prediction.confidenceLevel === 'Medium' ? 'yellow' : 'red';
                  const gradients = [
                    'from-purple-50 to-blue-50',
                    'from-blue-50 to-indigo-50',
                    'from-indigo-50 to-purple-50'
                  ];
                  
                  return (
                    <div key={idx} className={`flex items-center justify-between p-4 bg-gradient-to-r ${gradients[idx]} rounded-lg`}>
                      <div>
                        <p className="text-sm text-gray-600">
                          {new Date(prediction.forecastTime).toLocaleTimeString('en-US', { 
                            hour: 'numeric', 
                            minute: '2-digit' 
                          })}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {prediction.predictedOccupancyPercentage.toFixed(1)}%
                        </p>
                      </div>
                      <span className={`px-4 py-2 bg-${confidenceColor}-100 text-${confidenceColor}-700 rounded-lg text-sm font-medium`}>
                        {prediction.confidenceLevel} Confidence
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon="🔮"
                title="No Predictions Available"
                message="Prediction data will be available once historical data is collected."
              />
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                <div className="text-3xl mb-2">👥</div>
                <div className="text-sm font-medium">Manage Users</div>
              </button>
              <button className="p-4 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                <div className="text-3xl mb-2">🅿️</div>
                <div className="text-sm font-medium">Add Parking Area</div>
              </button>
              <button className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-sm font-medium">View Reports</div>
              </button>
              <button className="p-4 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                <div className="text-3xl mb-2">⚙️</div>
                <div className="text-sm font-medium">Settings</div>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-3">
            {[
              { action: 'Slot A-123 status changed to Available', user: 'Staff John', time: '2 minutes ago', type: 'success' },
              { action: 'Zone B maintenance scheduled', user: 'Admin Sarah', time: '15 minutes ago', type: 'warning' },
              { action: 'New user created: Mike Chen', user: 'SuperAdmin', time: '1 hour ago', type: 'info' },
              { action: 'System backup completed', user: 'System', time: '2 hours ago', type: 'success' },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-600">by {activity.user}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

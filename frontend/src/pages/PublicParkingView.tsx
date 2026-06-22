import { StatCard } from '../components/Dashboard/StatCard';

export const PublicParkingView: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Public Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-2xl">
                🅿️
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Smart Parking</h1>
                <p className="text-sm text-gray-600">Ayala Malls Abreeza</p>
              </div>
            </div>
            <a href="/login" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
              Staff Login
            </a>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-3">Real-Time Parking Availability</h2>
          <p className="text-blue-100 text-lg">Find available parking spots instantly</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Slots"
            value="240"
            icon="🅿️"
            color="blue"
          />
          <StatCard
            title="Available Now"
            value="87"
            icon="✅"
            color="green"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Currently Occupied"
            value="142"
            icon="🚗"
            color="red"
          />
          <StatCard
            title="Under Maintenance"
            value="11"
            icon="🔧"
            color="yellow"
          />
        </div>

        {/* Parking Areas */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Parking Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Zone A - Ground Floor', 'Zone B - 2nd Floor', 'Zone C - 3rd Floor'].map((zone, idx) => (
              <div key={zone} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-all duration-200 hover:shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{zone}</h3>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                    🅿️
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Slots</span>
                    <span className="font-bold text-gray-900">{80 - idx * 10}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Available</span>
                    <span className="font-bold text-green-600">{30 + idx * 5}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Occupied</span>
                    <span className="font-bold text-red-600">{50 - idx * 5}</span>
                  </div>
                  <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-blue-600 rounded-full" 
                      style={{width: `${((30 + idx * 5) / (80 - idx * 10)) * 100}%`}}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Predictions */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Occupancy Predictions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl">
              <p className="text-sm text-gray-600 mb-2">Next 30 Minutes</p>
              <p className="text-4xl font-bold text-gray-900 mb-2">68%</p>
              <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                Medium Confidence
              </span>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
              <p className="text-sm text-gray-600 mb-2">Next 1 Hour</p>
              <p className="text-4xl font-bold text-gray-900 mb-2">75%</p>
              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                High Confidence
              </span>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl">
              <p className="text-sm text-gray-600 mb-2">Next 2 Hours</p>
              <p className="text-4xl font-bold text-gray-900 mb-2">82%</p>
              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                High Confidence
              </span>
            </div>
          </div>
        </div>

        {/* Information */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="text-3xl">ℹ️</div>
            <div>
              <h3 className="text-lg font-bold text-blue-900 mb-2">Live Updates</h3>
              <p className="text-blue-800">
                This dashboard updates in real-time. Parking availability is refreshed automatically via SignalR.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2026 Smart Parking Management System - Ayala Malls Abreeza</p>
        </div>
      </footer>
    </div>
  );
};

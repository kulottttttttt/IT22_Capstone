export const LoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading dashboard data...</p>
      </div>
    </div>
  );
};

export const LoadingCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
};

export const LoadingRow: React.FC = () => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg animate-pulse">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-center">
          <div className="h-6 bg-gray-200 rounded w-12 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="text-center">
          <div className="h-6 bg-gray-200 rounded w-12 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="text-center">
          <div className="h-6 bg-gray-200 rounded w-12 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
};

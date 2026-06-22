interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Data</h3>
          <p className="text-red-700 mb-4">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const ErrorCard: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-red-200">
      <div className="text-center py-4">
        <div className="text-4xl mb-3">⚠️</div>
        <p className="text-red-600 text-sm mb-3">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

interface EmptyStateProps {
  icon?: string;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon = '📭', 
  title, 
  message, 
  action 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <div className="text-center py-8">
        <div className="text-6xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        {action && (
          <button
            onClick={action.onClick}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
};

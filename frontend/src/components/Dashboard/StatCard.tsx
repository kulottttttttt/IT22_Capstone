interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'indigo' | 'orange';
}

const colorStyles = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  red: 'from-red-500 to-red-600',
  yellow: 'from-yellow-500 to-yellow-600',
  purple: 'from-purple-500 to-purple-600',
  indigo: 'from-indigo-500 to-indigo-600',
  orange: 'from-orange-500 to-orange-600',
};

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, subtitle, color }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <p className={`text-sm mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span className="ml-1 font-medium">{Math.abs(trend.value)}%</span>
              <span className="ml-1 text-gray-500">vs last hour</span>
            </p>
          )}
        </div>
        <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${colorStyles[color]} flex items-center justify-center text-3xl shadow-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

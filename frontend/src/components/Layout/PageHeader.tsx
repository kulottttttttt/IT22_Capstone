import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface Breadcrumb {
  label: string;
  path?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  showBackToDashboard?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  breadcrumbs = [],
  showBackToDashboard = false 
}) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'SuperAdmin': return '/superadmin';
      case 'Admin': return '/admin';
      case 'Staff': return '/staff';
      default: return '/';
    }
  };

  const handleBackToDashboard = () => {
    navigate(getDashboardPath());
  };

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-40 shadow-sm">
      <div className="flex justify-between items-center">
        {/* Left Section - Title, Breadcrumbs, Back Button */}
        <div className="flex-1">
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <nav className="flex items-center gap-2 text-sm mb-2">
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center gap-2">
                  {crumb.path ? (
                    <button
                      onClick={() => navigate(crumb.path!)}
                      className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
                    >
                      {crumb.label}
                    </button>
                  ) : (
                    <span className="text-gray-500">{crumb.label}</span>
                  )}
                  {index < breadcrumbs.length - 1 && (
                    <span className="text-gray-400">/</span>
                  )}
                </div>
              ))}
            </nav>
          )}

          {/* Page Title with Back Button */}
          <div className="flex items-center gap-4">
            {showBackToDashboard && (
              <button
                onClick={handleBackToDashboard}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title="Back to Dashboard"
              >
                <span>←</span>
                <span>Dashboard</span>
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <span className="text-xl">🔔</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Info */}
          <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
              <span className="inline-block text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import type { UserRole } from '../../types';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: '📊', roles: ['SuperAdmin', 'Admin', 'Staff'] },
  { label: 'Parking Map', path: '/parking-map', icon: '🗺️', roles: ['SuperAdmin', 'Admin', 'Staff'] },
  { label: 'Analytics & Predictions', path: '/analytics', icon: '📈', roles: ['SuperAdmin', 'Admin'] },
  { label: 'Incident Management', path: '/incidents', icon: '🚨', roles: ['SuperAdmin', 'Admin', 'Staff'] },
  { label: 'Reports', path: '/reports', icon: '📄', roles: ['SuperAdmin', 'Admin'] },
  { label: 'Parking Areas', path: '/parking-areas', icon: '🅿️', roles: ['SuperAdmin', 'Admin'] },
  { label: 'Zones', path: '/zones', icon: '🏢', roles: ['SuperAdmin', 'Admin'] },
  { label: 'Parking Slots', path: '/parking-slots', icon: '🚗', roles: ['SuperAdmin', 'Admin'] },
  { label: 'Live Monitoring', path: '/live-monitoring', icon: '📡', roles: ['SuperAdmin', 'Admin', 'Staff'] },
  { label: 'Predictions', path: '/predictions', icon: '🔮', roles: ['SuperAdmin', 'Admin'] },
  { label: 'Users', path: '/users', icon: '👥', roles: ['SuperAdmin'] },
  { label: 'Audit Logs', path: '/audit-logs', icon: '📋', roles: ['SuperAdmin'] },
  { label: 'Settings', path: '/settings', icon: '⚙️', roles: ['SuperAdmin'] },
  { label: 'Slot Updates', path: '/slot-updates', icon: '🔄', roles: ['Staff'] },
  { label: 'Logout', path: '/logout', icon: '🚪', roles: ['SuperAdmin', 'Admin', 'Staff'] },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuthStore();

  const filteredNavItems = navItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'SuperAdmin': return '/superadmin';
      case 'Admin': return '/admin';
      case 'Staff': return '/staff';
      default: return '/';
    }
  };

  const dashboardPath = getDashboardPath();

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === dashboardPath;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl flex flex-col z-50">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-700">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-2xl">
            🅿️
          </div>
          <div>
            <h1 className="text-xl font-bold">Smart Parking</h1>
            <p className="text-xs text-gray-400">Abreeza Mall</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {filteredNavItems.map((item) => {
            const path = item.path === '/dashboard' ? dashboardPath : item.path;
            const active = isActive(item.path);
            
            // Special handling for Logout
            if (item.path === '/logout') {
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    useAuthStore.getState().logout();
                    window.location.href = '/login';
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            }
            
            return (
              <Link
                key={item.path}
                to={path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${active 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }
                `}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold">
            {user?.fullName?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.fullName}</p>
            <p className="text-xs text-gray-400">{user?.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

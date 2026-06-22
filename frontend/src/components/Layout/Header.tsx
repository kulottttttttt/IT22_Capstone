import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    
    switch (user.role) {
      case 'SuperAdmin':
        return '/superadmin';
      case 'Admin':
        return '/admin';
      case 'Staff':
        return '/staff';
      default:
        return '/';
    }
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Smart Parking - Abreeza Mall
          </Link>

          <nav className="flex items-center gap-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              Public View
            </Link>

            {isAuthenticated ? (
              <>
                <Link to={getDashboardLink()} className="text-gray-700 hover:text-blue-600">
                  Dashboard
                </Link>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {user?.fullName} ({user?.role})
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

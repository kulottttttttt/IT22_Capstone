import { useAuthStore } from '../store/authStore';
import { PageHeader } from '../components/Layout/PageHeader';

export const AuditLogs: React.FC = () => {
  const { user } = useAuthStore();

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'SuperAdmin': return '/superadmin';
      case 'Admin': return '/admin';
      case 'Staff': return '/staff';
      default: return '/';
    }
  };

  const breadcrumbs = [
    { label: 'Dashboard', path: getDashboardPath() },
    { label: 'Audit Logs' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Audit Logs" 
        subtitle="System activity and security audit trail"
        breadcrumbs={breadcrumbs}
        showBackToDashboard={true}
      />
      
      <div className="p-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Audit Logs</h2>
            <p className="text-gray-600 mb-6">
              This page will display comprehensive system audit logs.
            </p>
            <div className="space-y-3 max-w-3xl mx-auto mt-8 text-left">
              {[
                { action: 'User login: superadmin', time: '2 minutes ago', type: 'success' },
                { action: 'Slot status changed: A-123 to Available', time: '15 minutes ago', type: 'info' },
                { action: 'New user created: john.doe', time: '1 hour ago', type: 'success' },
                { action: 'Failed login attempt: unknown_user', time: '2 hours ago', type: 'warning' },
                { action: 'System backup completed', time: '3 hours ago', type: 'success' },
              ].map((log, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className={`w-2 h-2 rounded-full ${
                    log.type === 'success' ? 'bg-green-500' :
                    log.type === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{log.action}</p>
                  </div>
                  <span className="text-xs text-gray-500">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64 overflow-hidden flex flex-col">
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

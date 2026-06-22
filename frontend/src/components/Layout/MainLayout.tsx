import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 Smart Parking Management System - Ayala Malls Abreeza</p>
        </div>
      </footer>
    </div>
  );
};

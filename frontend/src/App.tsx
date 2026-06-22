import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { DashboardLayout } from './components/Layout/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { PublicParkingView } from './pages/PublicParkingView';
import { StaffDashboard } from './pages/StaffDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { SuperAdminDashboard } from './pages/SuperAdminDashboard';
import { Unauthorized } from './pages/Unauthorized';
import { ParkingAreas } from './pages/ParkingAreas';
import { Zones } from './pages/Zones';
import { ParkingSlots } from './pages/ParkingSlots';
import { LiveMonitoring } from './pages/LiveMonitoring';
import { ParkingMap } from './pages/ParkingMap';
import { Predictions } from './pages/Predictions';
import { AnalyticsDashboard } from './pages/AnalyticsDashboard';
import { Users } from './pages/Users';
import { AuditLogs } from './pages/AuditLogs';
import { Settings } from './pages/Settings';
import { Incidents } from './pages/Incidents';
import { CreateIncident } from './pages/CreateIncident';
import { IncidentDetails } from './pages/IncidentDetails';
import { Reports } from './pages/Reports';

function App() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicParkingView />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Protected Dashboard Routes */}
        <Route element={
          <ProtectedRoute allowedRoles={['Staff', 'Admin', 'SuperAdmin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          {/* Dashboard Routes */}
          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={['Staff', 'Admin', 'SuperAdmin']}>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/superadmin"
            element={
              <ProtectedRoute allowedRoles={['SuperAdmin']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Module Routes */}
          <Route
            path="/parking-areas"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
                <ParkingAreas />
              </ProtectedRoute>
            }
          />

          <Route
            path="/zones"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
                <Zones />
              </ProtectedRoute>
            }
          />

          <Route
            path="/parking-slots"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
                <ParkingSlots />
              </ProtectedRoute>
            }
          />

          <Route
            path="/live-monitoring"
            element={
              <ProtectedRoute allowedRoles={['Staff', 'Admin', 'SuperAdmin']}>
                <LiveMonitoring />
              </ProtectedRoute>
            }
          />

          <Route
            path="/parking-map"
            element={
              <ProtectedRoute allowedRoles={['Staff', 'Admin', 'SuperAdmin']}>
                <ParkingMap />
              </ProtectedRoute>
            }
          />

          <Route
            path="/predictions"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
                <Predictions />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
                <AnalyticsDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/incidents"
            element={
              <ProtectedRoute allowedRoles={['Staff', 'Admin', 'SuperAdmin']}>
                <Incidents />
              </ProtectedRoute>
            }
          />

          <Route
            path="/incidents/create"
            element={
              <ProtectedRoute allowedRoles={['Staff', 'Admin', 'SuperAdmin']}>
                <CreateIncident />
              </ProtectedRoute>
            }
          />

          <Route
            path="/incidents/:id"
            element={
              <ProtectedRoute allowedRoles={['Staff', 'Admin', 'SuperAdmin']}>
                <IncidentDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
                <Reports />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={['SuperAdmin']}>
                <Users />
              </ProtectedRoute>
            }
          />

          <Route
            path="/audit-logs"
            element={
              <ProtectedRoute allowedRoles={['SuperAdmin']}>
                <AuditLogs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={['SuperAdmin']}>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

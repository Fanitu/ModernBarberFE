import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoadingSpinner from './common/LoadingSpinner.jsx';
import PublicLayout from './layout/PublicLayout.jsx';
import Dashboard from './Dashboard/Dashboard.jsx'; // Add this
import AuthService from './service/authService.jsx';

// Lazy load ONLY the role-specific dashboards
const BarberDashboard = lazy(() => import('./Dashboard/BarberDashboard.jsx'));
const AdminDashboard = lazy(() => import('./Dashboard/AdminDashboard.jsx'));
const ClientDashboard = lazy(() => import('./Dashboard/ClienDashboard.jsx'));

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = AuthService.getUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    const loggedInUser = AuthService.login(userData, token);
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Router>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Routes>
          {/* Public routes */}
          <Route path="/*" element={
            <PublicLayout 
              user={user} 
              onLogin={handleLogin}
              onLogout={handleLogout}
            />
          } />
          
          {/* SINGLE Dashboard route - Redirects based on role */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Separate dashboard routes */}
          <Route path="/admin-dashboard/*" element={
            user?.role === 'admin' ? 
              <AdminDashboard user={user} onLogout={handleLogout} /> : 
              <Navigate to="/" replace />
          } />
          
          <Route path="/barber-dashboard/*" element={
            user?.role === 'barber' ? 
              <BarberDashboard user={user} onLogout={handleLogout} /> : 
              <Navigate to="/" replace />
          } />
          
          <Route path="/client-dashboard/*" element={
            user?.role === 'client' ? 
              <ClientDashboard user={user} onLogout={handleLogout} /> : 
              <Navigate to="/" replace />
          } />
          
          {/* Redirect old URLs to new ones */}
          <Route path="/dashboard/admin/*" element={<Navigate to="/admin-dashboard" replace />} />
          <Route path="/dashboard/barber/*" element={<Navigate to="/barber-dashboard" replace />} />
          <Route path="/dashboard/client/*" element={<Navigate to="/client-dashboard" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
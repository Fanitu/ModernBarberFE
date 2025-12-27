import React, { Suspense, lazy, useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoadingSpinner from './common/LoadingSpinner.jsx';
import PublicLayout from './layout/PublicLayout.jsx';
import AuthService from './service/authService.jsx';

// Lazy load
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
    
    // Hash-based navigation (ALWAYS WORKS)
    if (loggedInUser.role === 'admin') {
      window.location.hash = '#/admin';
    } else if (loggedInUser.role === 'barber') {
      window.location.hash = '#/barber';
    } else {
      window.location.hash = '#/client';
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    window.location.hash = '#/';
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Router>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Routes>
          {/* Public routes with hash */}
          <Route path="/*" element={
            <PublicLayout 
              user={user} 
              onLogin={handleLogin}
              onLogout={handleLogout}
            />
          } />
          
          {/* Simple hash routes */}
          <Route path="/admin/*" element={
            user?.role === 'admin' ? 
              <AdminDashboard user={user} onLogout={handleLogout} /> : 
              <Navigate to="/#/login" replace />
          } />
          
          <Route path="/barber/*" element={
            user?.role === 'barber' ? 
              <BarberDashboard user={user} onLogout={handleLogout} /> : 
              <Navigate to="/#/login" replace />
          } />
          
          <Route path="/client/*" element={
            user?.role === 'client' ? 
              <ClientDashboard user={user} onLogout={handleLogout} /> : 
              <Navigate to="/#/login" replace />
          } />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
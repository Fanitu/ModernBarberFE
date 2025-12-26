import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoadingSpinner from './common/LoadingSpinner.jsx';
import PublicLayout from './layout/PublicLayout.jsx';
import AuthService from './service/authService.jsx';
import config from './config/config.js';

// Lazy load dashboard components
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
    
    // Force immediate dashboard redirect for non-clients
    if (loggedInUser.role === 'barber' || loggedInUser.role === 'admin') {
      window.location.href = '/dashboard';
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    window.location.href = '/';
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Router>
      <Routes>
        {/* Public routes for everyone */}
        <Route path="/*" element={
          <PublicLayout 
            user={user} 
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
        } />
        
        {/* Protected dashboard routes */}
        <Route path="/dashboard/*" element={
          user ? (
            user.role === 'admin' ? <AdminDashboard user={user} onLogout={handleLogout} /> :
            user.role === 'barber' ? <BarberDashboard user={user} onLogout={handleLogout} /> :
            user.role === 'client' || null ? <ClientDashboard user={user} onLogout={handleLogout} /> :
            <Navigate to="/" replace />
          ) : (
            <Navigate to="/" replace />
          )
        } />
      </Routes>
    </Router>
  );
};

export default App;
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoadingSpinner from './common/LoadingSpinner.jsx';
import PublicLayout from './layout/PublicLayout.jsx';
import AuthService from './service/authService.jsx';

// FIX THE TYPO HERE:
const BarberDashboard = lazy(() => import('./Dashboard/BarberDashboard.jsx'));
const AdminDashboard = lazy(() => import('./Dashboard/AdminDashboard.jsx'));
const ClientDashboard = lazy(() => import('./Dashboard/ClienDashboard.jsx')); // Fixed!

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
    // Redirect after state update
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 100);
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
        {/* Public routes */}
        <Route path="/*" element={
          <PublicLayout 
            user={user} 
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
        } />
        
        {/* Dashboard - FIXED LOGIC */}
        <Route path="/dashboard" element={
          user ? (
            (() => {
              // Redirect based on role
              if (user.role === 'admin') {
                return <Navigate to="/dashboard/admin" replace />;
              } else if (user.role === 'barber') {
                return <Navigate to="/dashboard/barber" replace />;
              } else if (user.role === 'client') {
                return <Navigate to="/dashboard/client" replace />;
              } else {
                return <Navigate to="/" replace />;
              }
            })()
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        
        {/* Separate dashboard routes */}
        <Route path="/dashboard/admin/*" element={
          user?.role === 'admin' ? 
            <AdminDashboard user={user} onLogout={handleLogout} /> : 
            <Navigate to="/" replace />
        } />
        
        <Route path="/dashboard/barber/*" element={
          user?.role === 'barber' ? 
            <BarberDashboard user={user} onLogout={handleLogout} /> : 
            <Navigate to="/" replace />
        } />
        
        <Route path="/dashboard/client/*" element={
          user?.role === 'client' ? 
            <ClientDashboard user={user} onLogout={handleLogout} /> : 
            <Navigate to="/" replace />
        } />
      </Routes>
    </Router>
  );
};

export default App;
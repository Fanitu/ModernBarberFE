process.dot.env
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoadingSpinner from './common/LoadingSpinner.jsx';
import PublicLayout from './layout/PublicLayout.jsx';
import AuthService from './service/authService.jsx';

// Lazy load dashboard components
const BarberDashboard = lazy(() => import('./Dashboard/BarberDashboard.jsx'));
const AdminDashboard = lazy(() => import('./Dashboard/AdminDashboard.jsx'));
const ClientDashboard = lazy(() => import('./Dashboard/ClienDashboard.jsx'));

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 App mounting - checking auth...');
    console.log(`${process.env.REACT_APP_BACKEND_URL}`);
    
    const storedUser = AuthService.getUser();
    console.log('📦 Retrieved from AuthService:', storedUser);
    
    if (storedUser) {
      console.log('✅ User found, setting state:', {
        name: storedUser.name,
        role: storedUser.role,
        barberId: storedUser.barberId
      });
      setUser(storedUser);
    } else {
      console.log('❌ No user found in localStorage');
    }
    
    setLoading(false);
    
    // Log localStorage contents
    console.log('🏪 localStorage contents:', {
      user: localStorage.getItem('user'),
      token: localStorage.getItem('token') ? 'Exists' : 'Missing'
    });
  }, []);

  const handleLogin = (userData, token) => {
    console.log('🔐 handleLogin called with:', { userData, token });
    
    const loggedInUser = AuthService.login(userData, token);
    console.log('📝 After AuthService.login:', loggedInUser);
    
    setUser(loggedInUser);
    
    // Force immediate dashboard redirect for non-clients
    if (loggedInUser.role === 'barber' || loggedInUser.role === 'admin') {
      console.log('🚀 Redirecting to dashboard for role:', loggedInUser.role);
      window.location.href = '/dashboard';
    }
  };

  const handleLogout = () => {
    console.log('🚪 Logout initiated');
    AuthService.logout();
    setUser(null);
    window.location.href = '/';
  };

  if (loading) {
    console.log('⏳ App is loading...');
    return <LoadingSpinner fullScreen />;
  }

  console.log('🎯 App rendering with user:', user);
  console.log('🎯 User role:', user?.role);
  console.log('🎯 Should show dashboard?', user && user.role !== 'client');

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
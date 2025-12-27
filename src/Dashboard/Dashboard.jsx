import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';
import AuthService from '../service/authService';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = AuthService.getUser();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Redirect based on role
    switch(user.role) {
      case 'admin':
        navigate('/admin-dashboard');
        break;
      case 'barber':
        navigate('/barber-dashboard');
        break;
      case 'client':
        navigate('/client-dashboard');
        break;
      default:
        navigate('/');
    }
  }, [user, navigate]);

  return <LoadingSpinner message="Redirecting to your dashboard..." />;
};

export default Dashboard;
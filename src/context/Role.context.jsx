import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../apiServece/apiService.jsx';

const RoleContext = createContext();

export const useRole = () => useContext(RoleContext);

export const RoleProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const response = await authAPI.getProfile();
        setUser(response.data);
      } catch (error) {
        logout();
      }
    }
    setLoading(false);
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
    localStorage.setItem('user', JSON.stringify({ ...user, ...updatedData }));
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAdmin: user?.role === 'admin',
    isBarber: user?.role === 'barber',
    isClient: user?.role === 'client'
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
};
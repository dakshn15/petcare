import React, { createContext, useState, useEffect, useMemo } from 'react';
import * as authApi from '../api/authApi';
import PageLoader from '../components/UI/PageLoader';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await authApi.getProfile();
      setUser(res?.success ? res.data : null);
    } catch {
      setUser(null);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    const handleUnauthorized = () => setUser(null);
    window.addEventListener('unauthorized', handleUnauthorized);
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    const res = await authApi.loginUser({ email, password });
    if (res?.success) {
      setUser(res.user);
      window.dispatchEvent(new Event('authChange'));
      return res;
    }
    throw new Error(res?.message || 'Invalid credentials');
  };

  const register = async (name, email, phone, password) => {
    const res = await authApi.registerUser({ name, email, phone, password });
    if (res?.success) {
      setUser(res.user);
      window.dispatchEvent(new Event('authChange'));
      return res;
    }
    throw new Error(res?.message || 'Registration failed');
  };

  const logout = async () => {
    try {
      await authApi.logoutUser();
    } finally {
      setUser(null);
      window.dispatchEvent(new Event('authChange'));
    }
  };

  const updateProfile = async (name, phone) => {
    const res = await authApi.updateProfile({ name, phone });
    if (res?.success) setUser(res.data);
    return res;
  };

  const updateAvatar = async (formData) => {
    const res = await authApi.uploadAvatar(formData);
    if (res?.success) setUser(res.data);
    return res;
  };

  const value = useMemo(() => ({
    user,
    loading: initialLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
    updateAvatar,
    refreshUser: fetchProfile
  }), [user, initialLoading]);

  if (initialLoading) {
    return (
      <AuthContext.Provider value={value}>
        <PageLoader message="Preparing your experience…" />
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


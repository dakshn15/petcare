import React, { createContext, useState, useEffect } from 'react';
import * as authApi from '../api/authApi';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await authApi.getProfile();
      if (res?.success) {
        setUser(res.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();

    const handleUnauthorized = () => {
      setUser(null);
    };

    window.addEventListener('unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authApi.loginUser({ email, password });
      if (res?.success) {
        setUser(res.user);
        // Dispatch authChange event for components that might still listen to it
        window.dispatchEvent(new Event('authChange'));
        return res;
      } else {
        throw new Error(res?.message || 'Invalid credentials');
      }
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, phone, password) => {
    setLoading(true);
    try {
      const res = await authApi.registerUser({ name, email, phone, password });
      if (res?.success) {
        setUser(res.user);
        window.dispatchEvent(new Event('authChange'));
        return res;
      } else {
        throw new Error(res?.message || 'Registration failed');
      }
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authApi.logoutUser();
    } finally {
      setUser(null);
      setLoading(false);
      window.dispatchEvent(new Event('authChange'));
    }
  };

  const updateProfile = async (name, phone) => {
    const res = await authApi.updateProfile({ name, phone });
    if (res?.success) {
      setUser(res.data);
    }
    return res;
  };

  const updateAvatar = async (formData) => {
    const res = await authApi.uploadAvatar(formData);
    if (res?.success) {
      setUser(res.data);
    }
    return res;
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
    updateAvatar,
    refreshUser: fetchProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

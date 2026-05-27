import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await authAPI.getMe();
      setUser(data.data);
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await authAPI.register({ name, email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    authAPI.logout().catch(() => {});
  };

  const updateProfile = async (profileData) => {
    const { data } = await authAPI.updateProfile(profileData);
    setUser((prev) => ({ ...prev, ...data.data }));
    localStorage.setItem('user', JSON.stringify({ ...user, ...data.data }));
    return data;
  };

  const updatePassword = async (currentPassword, newPassword) => {
    return await authAPI.updatePassword({ currentPassword, newPassword });
  };

  return (
    <AuthContext.Provider value={{
      user, loading, login, register, logout, updateProfile, updatePassword, loadUser,
      isAdmin: user?.role === 'admin',
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

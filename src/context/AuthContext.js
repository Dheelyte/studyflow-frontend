'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '@/services/api';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data } = await auth.getMe();
      setUser(data);
    } catch (error) {
      // Not logged in or session expired
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    await auth.login(credentials);
    return checkUser();
  };

  const register = async (userData) => {
    return auth.register(userData);
  };

  const logout = async () => {
    try {
      await auth.logout();
    } catch(e) {
      console.error('Logout failed', e);
    }
    setUser(null);
    router.push('/login');
  };

  const requestPasswordReset = (email) => auth.requestPasswordReset(email);
  const verifyResetCode = (data) => auth.verifyResetCode(data);
  const resetPassword = (data) => auth.resetPassword(data);
  const changePassword = (data) => auth.changePassword(data);

  const updateUser = async (data) => {
      const response = await auth.updateProfile(data);
      // Backend returns updated user object in response.data or directly depending on implementation, 
      // but assuming it returns the updated user or we should re-fetch.
      // Ideally, the PUT response contains the updated user resource.
      // If handleResponse returns { data: user } or just user.
      // Based on api.js handleResponse, it returns the parsed JSON. 
      // Let's assume response.data is the user.
      const updatedUser = response.data || response; 
      setUser(prev => ({ ...prev, ...updatedUser }));
      return updatedUser; 
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    requestPasswordReset,
    verifyResetCode,
    resetPassword,
    changePassword,
    updateUser,
    checkUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

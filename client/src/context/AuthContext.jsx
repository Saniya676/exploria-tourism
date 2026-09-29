import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [guideProfile, setGuideProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  async function checkAuthStatus() {
    const token = localStorage.getItem('exploria_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await authService.getMe();
      if (res.success) {
        setUser(res.data.user);
        setGuideProfile(res.data.guideProfile || null);
      } else {
        logout();
      }
    } catch (err) {
      logout();
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const res = await authService.login({ email, password });
    if (res.success && res.data.token) {
      localStorage.setItem('exploria_token', res.data.token);
      setUser(res.data.user);
      await checkAuthStatus();
      return res;
    }
    throw new Error(res.message || 'Login failed');
  }

  async function register(userData) {
    const res = await authService.register(userData);
    if (res.success && res.data.token) {
      localStorage.setItem('exploria_token', res.data.token);
      setUser(res.data.user);
      await checkAuthStatus();
      return res;
    }
    throw new Error(res.message || 'Registration failed');
  }

  function logout() {
    localStorage.removeItem('exploria_token');
    setUser(null);
    setGuideProfile(null);
  }

  return (
    <AuthContext.Provider value={{ user, guideProfile, loading, login, register, logout, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

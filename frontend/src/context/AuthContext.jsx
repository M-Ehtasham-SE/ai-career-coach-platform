import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    setLoading(false);
  }, []);

  const persistSession = (apiResponse) => {
    const { token, user: userData } = apiResponse.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const apiResponse = await authService.login(email, password);
      if (apiResponse?.status === 'success' && apiResponse?.data?.token) {
        persistSession(apiResponse);
        return { success: true };
      }
      return { success: false, message: apiResponse?.message || 'Login failed.' };
    } catch (error) {
      console.error('Login error:', error);
      let message = 'Login failed. Please check your credentials.';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = `Error: ${error.message}`;
      }
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (fullName, email, password) => {
    setLoading(true);
    try {
      const apiResponse = await authService.register(fullName, email, password);
      if (apiResponse?.status === 'success' && apiResponse?.data?.token) {
        persistSession(apiResponse);
        return { success: true };
      }
      return { success: false, message: apiResponse?.message || 'Registration failed.' };
    } catch (error) {
      console.error('Registration error:', error);
      let message = 'Registration failed. Please try again.';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = `Error: ${error.message}`;
      }
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (_) {
      // ignore
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

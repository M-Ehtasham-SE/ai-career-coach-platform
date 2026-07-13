import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage on app start
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

  /**
   * Helper: persist token + user from a backend ApiResponse wrapper.
   * Backend shape: { status, message, data: { token, tokenType, expiresIn, user } }
   */
  const persistSession = (apiResponse) => {
    const { token, user: userData } = apiResponse.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      // authService.login returns the parsed JSON body (Axios unwraps .data automatically)
      const apiResponse = await authService.login(email, password);
      if (apiResponse?.status === 'success' && apiResponse?.data?.token) {
        persistSession(apiResponse);
        return { success: true };
      }
      return { success: false, message: apiResponse?.message || 'Login failed.' };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (fullName, email, password) => {
    setLoading(true);
    try {
      // Register also returns a JWT token directly — no need for a second login call
      const apiResponse = await authService.register(fullName, email, password);
      if (apiResponse?.status === 'success' && apiResponse?.data?.token) {
        persistSession(apiResponse);
        return { success: true };
      }
      return { success: false, message: apiResponse?.message || 'Registration failed.' };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (_) {
      // ignore server-side logout errors
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

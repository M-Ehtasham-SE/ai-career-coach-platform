import axios from 'axios';

/**
 * In development: VITE_API_URL is not set, so baseURL falls back to '/api/v1'
 * which is proxied to http://localhost:8081 via vite.config.js.
 *
 * In production (Render): VITE_API_URL is set to the full Render backend URL
 * e.g. https://ai-career-coach-backend.onrender.com/api/v1
 */
const baseURL = import.meta.env.VITE_API_URL || '/api/v1';

const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically attach JWT token if it exists
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized (expired/invalid token)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const requestUrl = error.config?.url || '';
      // Don't wipe the session if the 401 came from the logout endpoint itself
      const isLogoutCall = requestUrl.includes('/auth/logout');
      if (!isLogoutCall) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        const path = window.location.pathname;
        if (path !== '/login' && path !== '/register') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;

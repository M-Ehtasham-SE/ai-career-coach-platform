import axios from 'axios';

// Use relative URL so requests go through Vite proxy (avoids CORS in dev)
const axiosClient = axios.create({
  baseURL: '/api/v1',
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
      // (it was already publicly accessible, but just in case)
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


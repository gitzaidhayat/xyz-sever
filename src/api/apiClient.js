import axios from 'axios';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000';

const apiClient = axios.create({
  baseURL: API,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add Authorization header with token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalUrl = error.config?.url;
    
    // Don't redirect to login if checking auth status fails
    if (originalUrl === '/api/auth/profile' && error.response?.status === 401) {
      return Promise.reject(error);
    }
    
    // Don't redirect for public endpoints like cloth list
    if (originalUrl?.includes('/api/cloth') && error.response?.status === 401) {
      return Promise.reject(error);
    }
    
    // For other 401 errors, redirect to login
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default apiClient;

import apiClient from './apiClient';

const API = import.meta.env.VITE_BACKEND_URL;

export const authApi = {
  // Check if email exists
  verify: async (email) => {
    const response = await apiClient.post('/api/auth/verify', { email });
    return response.data;
  },

  register: async (userData) => {
    const response = await apiClient.post('/api/auth/user/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    // Convert identifier to email if needed
    const loginData = {
      email: credentials.identifier || credentials.email,
      password: credentials.password
    };
    const response = await apiClient.post('/api/auth/user/login', loginData);
    return response.data;
  },

  // Legacy aliases
  checkEmail: async (email) => {
    const response = await apiClient.post('/api/auth/verify', { email });
    return response.data;
  },

  // USER AUTH
  // Register new user (legacy alias)
  registerUser: async (userData) => {
    const response = await apiClient.post('/api/auth/user/register', userData);
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await apiClient.get('/api/auth/user/logout');
    return response.data;
  },

  // ADMIN AUTH
  adminLogin: async (credentials) => {
    const loginData = {
      email: credentials.identifier || credentials.email,
      password: credentials.password
    };
    const response = await apiClient.post('/api/auth/admin/login', loginData);
    return response.data;
  },

  adminRegister: async (adminData) => {
    const response = await apiClient.post('/api/auth/admin/register', adminData);
    return response.data;
  },

  adminLogout: async () => {
    const response = await apiClient.get('/api/auth/admin/logout');
    return response.data;
  },

  // CLOTH PARTNER AUTH
  // Register cloth partner
  clothPartnerRegister: async (partnerData) => {
    const response = await apiClient.post('/api/auth/clothpartner/register', partnerData);
    return response.data;
  },

  // Login cloth partner
  clothPartnerLogin: async (credentials) => {
    const response = await apiClient.post('/api/auth/clothpartner/login', credentials);
    return response.data;
  },

  // Logout cloth partner
  clothPartnerLogout: async () => {
    const response = await apiClient.get('/api/auth/clothpartner/logout');
    return response.data;
  },

  // Get current cloth partner
  getCurrentPartner: async () => {
    const response = await apiClient.get('/api/auth/clothpartner/profile');
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await apiClient.get('/api/auth/profile');
    return response.data;
  },

  // Refresh access token
  refreshToken: async (refreshToken) => {
    const response = await apiClient.post('/api/auth/refresh', { refreshToken });
    return response.data;
  },

  // Update profile
  updateProfile: async (userData) => {
    const response = await apiClient.put('/api/auth/profile', userData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await apiClient.put('/api/auth/password', passwordData);
    return response.data;
  },
};

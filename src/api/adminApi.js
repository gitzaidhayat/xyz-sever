import apiClient from './apiClient';

export const adminApi = {
  // Dashboard Statistics
  getDashboardStats: async () => {
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
  },

  // Cloth Management (using /cloth routes)
  getAllProducts: async (params = {}) => {
    const response = await apiClient.get('/api/cloth', { params });
    return response.data;
  },

  createProduct: async (formData) => {
    const response = await apiClient.post('/api/cloth', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await apiClient.put(`/api/cloth/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await apiClient.delete(`/api/cloth/del/${id}`);
    return response.data;
  },

  uploadProductImage: async (id, formData) => {
    const response = await apiClient.post(`/api/cloth/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Order Management
  getAllOrders: async (queryString = '') => {
    const url = queryString ? `/admin/orders?${queryString}` : '/admin/orders';
    const response = await apiClient.get(url);
    return response.data;
  },

  createOrder: async (orderData) => {
    const response = await apiClient.post('/admin/orders', orderData);
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await apiClient.put(`/admin/orders/${id}/status`, { status });
    return response.data;
  },

  deleteOrder: async (id) => {
    const response = await apiClient.delete(`/admin/orders/${id}`);
    return response.data;
  },

  // User Management
  getAllUsers: async (params = {}) => {
    const response = await apiClient.get('/admin/users', { params });
    return response.data;
  },

  getUserById: async (id) => {
    const response = await apiClient.get(`/admin/users/${id}`);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await apiClient.put(`/admin/users/${id}`, userData);
    return response.data;
  },

  updateUserStatus: async (id, isActive) => {
    const response = await apiClient.put(`/admin/users/${id}/status`, { isActive });
    return response.data;
  },

  updateUserRole: async (id, role) => {
    const response = await apiClient.put(`/admin/users/${id}/role`, { role });
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await apiClient.delete(`/admin/users/${id}`);
    return response.data;
  },

  // Coupon Management
  getAllCoupons: async () => {
    const response = await apiClient.get('/admin/coupons');
    return response.data;
  },

  createCoupon: async (couponData) => {
    const response = await apiClient.post('/admin/coupons', couponData);
    return response.data;
  },

  updateCoupon: async (id, couponData) => {
    const response = await apiClient.put(`/admin/coupons/${id}`, couponData);
    return response.data;
  },

  deleteCoupon: async (id) => {
    const response = await apiClient.delete(`/admin/coupons/${id}`);
    return response.data;
  },
  };

import apiClient from './apiClient';

export const orderApi = {
  // Create new order
  createOrder: async (orderData) => {
    const response = await apiClient.post('/api/orders', orderData);
    return response.data;
  },

  // Get user's orders
  getUserOrders: async (params = {}) => {
    const response = await apiClient.get('/api/orders', { params });
    return response.data;
  },

  // Get single order by ID
  getOrderById: async (id) => {
    const response = await apiClient.get(`/api/orders/${id}`);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id) => {
    const response = await apiClient.put(`/api/orders/${id}/cancel`);
    return response.data;
  },

  // Track order
  trackOrder: async (id) => {
    const response = await apiClient.get(`/api/orders/${id}/track`);
    return response.data;
  },
};

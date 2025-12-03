import apiClient from './apiClient';

export const productApi = {
  // CLOTH API
  
  // Get all cloth items
  getProducts: async (params = {}) => {
    const response = await apiClient.get('/api/cloth', { params });
    return response.data?.cloths || [];
  },

  // Get single cloth by ID
  getProductById: async (id) => {
    const response = await apiClient.get(`/api/cloth/${id}`);
    return response.data;
  },

  // Create new cloth (POST)
  createProduct: async (productData) => {
    const response = await apiClient.post('/api/cloth', productData);
    return response.data;
  },

  // Delete cloth by ID
  deleteProduct: async (id) => {
    const response = await apiClient.delete(`/api/cloth/del/${id}`);
    return response.data;
  },

  // Update cloth by ID
  updateProduct: async (id, productData) => {
    const response = await apiClient.put(`/api/cloth/${id}`, productData);
    return response.data;
  },

  // Get product reviews
  getProductReviews: async (id) => {
    const response = await apiClient.get(`/api/cloth/${id}/reviews`);
    return response.data;
  },

  // Add product review
  addReview: async (id, reviewData) => {
    const response = await apiClient.post(`/api/cloth/${id}/reviews`, reviewData);
    return response.data;
  },

  // Get categories
  getCategories: async () => {
    const response = await apiClient.get('/api/cloth/categories');
    return response.data;
  },

  // Search products
  searchProducts: async (query) => {
    const response = await apiClient.get(`/api/cloth/search?q=${query}`);
    return response.data;
  },
};

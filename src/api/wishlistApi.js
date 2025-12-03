import apiClient from './apiClient';

export const wishlistApi = {
  getWishlist: async () => {
    const res = await apiClient.get('/api/wishlist');
    return res.data;
  },
  addToWishlist: async (productId) => {
    const res = await apiClient.post('/api/wishlist', { productId });
    return res.data;
  },
  removeFromWishlist: async (productId) => {
    const res = await apiClient.delete(`/api/wishlist/${productId}`);
    return res.data;
  }
};

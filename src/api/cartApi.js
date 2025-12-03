import apiClient from './apiClient';

export const cartApi = {
  // Get user's cart
  getCart: async () => {
    const response = await apiClient.get('/cart');
    return response.data;
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1, variant = null) => {
    const response = await apiClient.post('/cart', {
      productId,
      quantity,
      variant,
    });
    return response.data;
  },

  // Update cart item quantity
  updateCartItem: async (itemId, quantity) => {
    const response = await apiClient.put(`/cart/${itemId}`, { quantity });
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (itemId) => {
    const response = await apiClient.delete(`/cart/${itemId}`);
    return response.data;
  },

  // Clear cart
  clearCart: async () => {
    const response = await apiClient.delete('/cart');
    return response.data;
  },

  // Apply coupon
  applyCoupon: async (code) => {
    const response = await apiClient.post('/cart/coupon', { code });
    return response.data;
  },

  // Remove coupon
  removeCoupon: async () => {
    const response = await apiClient.delete('/cart/coupon');
    return response.data;
  },
};

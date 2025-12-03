import apiClient from './apiClient';

export const addressApi = {
  // Get all addresses
  getAddresses: async () => {
    const response = await apiClient.get('/api/addresses');
    return response.data;
  },

  // Add new address
  addAddress: async (addressData) => {
    const response = await apiClient.post('/api/addresses', addressData);
    return response.data;
  },

  // Update address
  updateAddress: async (addressId, addressData) => {
    const response = await apiClient.put(`/api/addresses/${addressId}`, addressData);
    return response.data;
  },

  // Delete address
  deleteAddress: async (addressId) => {
    const response = await apiClient.delete(`/api/addresses/${addressId}`);
    return response.data;
  },

  // Set default address
  setDefaultAddress: async (addressId) => {
    const response = await apiClient.patch(`/api/addresses/${addressId}/default`);
    return response.data;
  },
};

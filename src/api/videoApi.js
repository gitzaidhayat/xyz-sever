import apiClient from './apiClient';

export const videoApi = {
  getVideos: async (params = {}) => {
    const response = await apiClient.get('/api/videos', { params });
    return response.data;
  },

  getVideoById: async (id) => {
    const response = await apiClient.get(`/api/videos/${id}`);
    return response.data;
  },

  createVideo: async (videoData) => {
    const formData = new FormData();
    
    // Append video file (required)
    if (videoData.videoFile) {
      formData.append('video', videoData.videoFile);
    }
    
    // Append text fields
    formData.append('title', videoData.title || '');
    formData.append('productName', videoData.productName || '');
    formData.append('category', videoData.category || 'featured');
    formData.append('isActive', videoData.isActive);
    
    if (videoData.productId) {
      formData.append('productId', videoData.productId);
    }
    if (videoData.price) {
      formData.append('price', videoData.price);
    }
    
    const response = await apiClient.post('/api/videos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateVideo: async (id, videoData) => {
    const formData = new FormData();
    
    // Append video file if provided (optional for update)
    if (videoData.videoFile) {
      formData.append('video', videoData.videoFile);
    }
    
    // Append text fields
    formData.append('title', videoData.title || '');
    formData.append('productName', videoData.productName || '');
    formData.append('category', videoData.category || 'featured');
    formData.append('isActive', videoData.isActive);
    
    if (videoData.productId) {
      formData.append('productId', videoData.productId);
    }
    if (videoData.price) {
      formData.append('price', videoData.price);
    }
    
    const response = await apiClient.put(`/api/videos/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteVideo: async (id) => {
    const response = await apiClient.delete(`/api/videos/${id}`);
    return response.data;
  },
};

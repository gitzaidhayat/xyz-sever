import apiClient from './apiClient';

export const subscribeEmail = async (email) => {
  const res = await apiClient.post('/api/subscribe', { email });
  return res.data; // { success, message }
};

export const sendNewsToSubscribers = async (subject, message) => {
  const res = await apiClient.post('/api/subscribe/send-news', { subject, message });
  return res.data;
};

export const getAllSubscribers = async () => {
  const res = await apiClient.get('/api/subscribe/all');
  return res.data;
};

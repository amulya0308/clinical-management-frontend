import apiClient from '../api/client';

export const authService = {
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data.data;
  },

  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data.data;
  },
};

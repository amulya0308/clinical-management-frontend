import apiClient from '../api/client';

export const departmentService = {
  getAll: async () => {
    const response = await apiClient.get('/departments');
    return response.data.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/departments/${id}`);
    return response.data.data;
  },

  create: async (departmentData) => {
    const response = await apiClient.post('/admin/departments', departmentData);
    return response.data.data;
  },

  update: async (id, departmentData) => {
    const response = await apiClient.put(`/admin/departments/${id}`, departmentData);
    return response.data.data;
  },

  delete: async (id) => {
    await apiClient.delete(`/admin/departments/${id}`);
  },
};

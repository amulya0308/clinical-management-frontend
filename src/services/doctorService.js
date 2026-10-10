import apiClient from '../api/client';

export const doctorService = {
  getDoctors: async (params = {}) => {
    const response = await apiClient.get('/doctors', { params });
    return response.data.data;
  },

  getAllDoctorsList: async () => {
    const response = await apiClient.get('/doctors/all');
    return response.data.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/doctors/${id}`);
    return response.data.data;
  },

  create: async (doctorData) => {
    const response = await apiClient.post('/admin/doctors', doctorData);
    return response.data.data;
  },

  update: async (id, doctorData) => {
    const response = await apiClient.put(`/admin/doctors/${id}`, doctorData);
    return response.data.data;
  },

  delete: async (id) => {
    await apiClient.delete(`/admin/doctors/${id}`);
  },
};

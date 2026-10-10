import apiClient from '../api/client';

export const adminService = {
  getAdminDashboard: async () => {
    const response = await apiClient.get('/admin/dashboard');
    return response.data.data;
  },

  getDoctorDashboard: async () => {
    const response = await apiClient.get('/doctor/dashboard');
    return response.data.data;
  },

  getPatientDashboard: async () => {
    const response = await apiClient.get('/patient/dashboard');
    return response.data.data;
  },
};

import apiClient from '../api/client';

export const patientService = {
  getCurrentProfile: async () => {
    const response = await apiClient.get('/patient/profile');
    return response.data.data;
  },

  updateCurrentProfile: async (profileData) => {
    const response = await apiClient.put('/patient/profile', profileData);
    return response.data.data;
  },

  getPatientForDoctor: async (id) => {
    const response = await apiClient.get(`/doctor/patients/${id}`);
    return response.data.data;
  },

  getPatients: async (params = {}) => {
    const response = await apiClient.get('/admin/patients', { params });
    return response.data.data;
  },

  getPatientById: async (id) => {
    const response = await apiClient.get(`/admin/patients/${id}`);
    return response.data.data;
  },

  updatePatient: async (id, patientData) => {
    const response = await apiClient.put(`/admin/patients/${id}`, patientData);
    return response.data.data;
  },

  deletePatient: async (id) => {
    await apiClient.delete(`/admin/patients/${id}`);
  },
};

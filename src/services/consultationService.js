import apiClient from '../api/client';

export const consultationService = {
  createConsultation: async (appointmentId, consultationData) => {
    const response = await apiClient.post(`/doctor/appointments/${appointmentId}/consultation`, consultationData);
    return response.data.data;
  },

  updateConsultation: async (id, consultationData) => {
    const response = await apiClient.put(`/doctor/consultations/${id}`, consultationData);
    return response.data.data;
  },

  getByAppointmentId: async (appointmentId) => {
    const response = await apiClient.get(`/appointments/${appointmentId}/consultation`);
    return response.data.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/consultations/${id}`);
    return response.data.data;
  },
};

import apiClient from '../api/client';

export const appointmentService = {
  // Patient actions
  bookAppointment: async (appointmentData) => {
    const response = await apiClient.post('/patient/appointments', appointmentData);
    return response.data.data;
  },

  getPatientAppointments: async (params = {}) => {
    const response = await apiClient.get('/patient/appointments', { params });
    return response.data.data;
  },

  cancelPatientAppointment: async (id) => {
    const response = await apiClient.put(`/patient/appointments/${id}/cancel`);
    return response.data.data;
  },

  // Doctor actions
  getDoctorAppointments: async (params = {}) => {
    const response = await apiClient.get('/doctor/appointments', { params });
    return response.data.data;
  },

  updateDoctorAppointmentStatus: async (id, status) => {
    const response = await apiClient.put(`/doctor/appointments/${id}/status`, { status });
    return response.data.data;
  },

  // Admin actions
  getAllAppointments: async (params = {}) => {
    const response = await apiClient.get('/admin/appointments', { params });
    return response.data.data;
  },

  adminUpdateStatus: async (id, status) => {
    const response = await apiClient.put(`/admin/appointments/${id}/status`, { status });
    return response.data.data;
  },

  // Common details
  getAppointmentById: async (id) => {
    const response = await apiClient.get(`/appointments/${id}`);
    return response.data.data;
  },
};

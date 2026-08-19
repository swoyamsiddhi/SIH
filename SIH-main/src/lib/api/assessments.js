import { apiClient } from './client';

export const AssessmentService = {
  syncOfflineAssessment: async (assessmentData) => {
    // Supports the flow: ESP32 + IMU -> Android Local Processing -> Sync
    const response = await apiClient.post('/assessments/sync', assessmentData);
    return response.data;
  },

  getAssessmentResult: async (id) => {
    const response = await apiClient.get(`/assessments/${id}/result`);
    return response.data;
  }
};

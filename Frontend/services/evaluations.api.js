import axiosInstance from '../helpers/axios-config';

export const evaluationsService = {
  async createTemplate(payload) {
    try {
      const response = await axiosInstance.post('/api/evaluations', payload);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error creating evaluation template');
    }
  },

  async getTemplate(id) {
    try {
      const response = await axiosInstance.get(`/api/evaluations/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error fetching evaluation');
    }
  },

  async listTemplates() {
    try {
      const response = await axiosInstance.get('/api/evaluations');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error fetching evaluations list');
    }
  },

  async submitEvaluation(id, answers) {
    try {
      const response = await axiosInstance.post(`/api/evaluations/${id}/submit`, { answers });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error submitting evaluation');
    }
  }
};

export default evaluationsService;

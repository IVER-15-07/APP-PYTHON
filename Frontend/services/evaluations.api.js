import axiosInstance from '../helpers/axios-config';

export const evaluationsService = {
  // Crear nueva plantilla de evaluación
  async createTemplate(payload) {
    try {
      const response = await axiosInstance.post('/api/evaluations', payload);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al crear plantilla de evaluación');
    }
  },

  // Obtener plantilla por ID
  async getTemplate(id) {
    try {
      const response = await axiosInstance.get(`/api/evaluations/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener evaluación');
    }
  },

  // Actualizar plantilla existente
  async updateTemplate(id, payload) {
    try {
      const response = await axiosInstance.put(`/api/evaluations/${id}`, payload);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar plantilla');
    }
  },

  // Listar evaluaciones de un tópico
  async getEvaluationsByTopic(topicoId) {
    try {
      const response = await axiosInstance.get(`/topics/${topicoId}/evaluations`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener evaluaciones');
    }
  },

  // Listar evaluaciones de un curso
  async getEvaluationsByCourse(cursoId) {
    try {
      const response = await axiosInstance.get(`/courses/${cursoId}/evaluations`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener evaluaciones del curso');
    }
  },

  // Responder/enviar evaluación (estudiante)
  async submitEvaluation(id, answers) {
    try {
      const response = await axiosInstance.post(`/api/evaluations/${id}/submit`, { answers });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al enviar evaluación');
    }
  },

  // Guardar respuestas como borrador (auto-guardado)
  async saveDraft(evaluacionId, usuarioId, answers) {
    try {
      const response = await axiosInstance.patch(`/api/evaluations/${evaluacionId}/drafts/${usuarioId}`, { answers });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al guardar borrador');
    }
  },

  // Obtener resultado de evaluación del estudiante
  async getSubmissionResult(evaluacionId, usuarioId) {
    try {
      const response = await axiosInstance.get(`/api/evaluations/${evaluacionId}/results/${usuarioId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener resultado');
    }
  },

  // Obtener todas las respuestas de un estudiante para una evaluación
  async getStudentSubmission(evaluacionId, usuarioId) {
    try {
      const response = await axiosInstance.get(`/api/evaluations/${evaluacionId}/submissions/${usuarioId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener respuestas del estudiante');
    }
  },

  // Listar todas las respuestas (para profesor)
  async getSubmissions(evaluacionId) {
    try {
      const response = await axiosInstance.get(`/api/evaluations/${evaluacionId}/submissions`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener respuestas');
    }
  },

  // Calificar respuesta manual (profesor)
  async gradeSubmission(evaluacionId, preguntaId, usuarioId, payload) {
    try {
      const response = await axiosInstance.post(
        `/api/evaluations/${evaluacionId}/questions/${preguntaId}/grade`,
        { usuarioId, ...payload }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al calificar');
    }
  },

  // Publicar/cambiar visibilidad de plantilla
  async publishTemplate(id, published) {
    try {
      const response = await axiosInstance.patch(`/api/evaluations/${id}`, { published });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al cambiar estado');
    }
  },

  // Eliminar plantilla
  async deleteTemplate(id) {
    try {
      const response = await axiosInstance.delete(`/api/evaluations/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al eliminar plantilla');
    }
  },

  // Obtener tipos de parámetros (question types)
  async getParameterTypes() {
    try {
        const response = await axiosInstance.get('/api/parameters');
        return response.data?.data || [];
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener tipos de preguntas');
    }
  }
};

export default evaluationsService;

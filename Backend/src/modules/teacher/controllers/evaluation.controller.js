import { evaluationService } from '../services/evaluation.service.js';

export const evaluationController = {
  crearPlantilla: async (req, res) => {
    try {
      const payload = req.body;
      const created = await evaluationService.createTemplate(payload);
      return res.status(201).json(created);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  },

  obtenerPlantilla: async (req, res) => {
    try {
      const { id } = req.params;
      const found = await evaluationService.getTemplateById(id);
      if (!found) return res.status(404).json({ message: 'Plantilla no encontrada' });
      return res.json(found);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  },

  listarPlantillas: async (req, res) => {
    try {
      const filters = {
        cursoId: req.query.cursoId,
        topicoId: req.query.topicoId,
        published: typeof req.query.published !== 'undefined' ? req.query.published === 'true' : undefined
      };
      const list = await evaluationService.listTemplates(filters);
      return res.status(200).json({ success: true, data: list });
    } catch (error) {
      console.error('Listar plantillas error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  responderEvaluacion: async (req, res) => {
    try {
      const { id } = req.params;
      const usuarioId = req.user?.id || req.body.usuarioId; // try token user first
      const answers = req.body.answers;
      if (!usuarioId) return res.status(400).json({ message: 'UsuarioId requerido' });
      const result = await evaluationService.submitAnswers(id, usuarioId, answers);
      return res.status(201).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }
};

export default evaluationController;

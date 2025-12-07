import { evaluationController } from '../../../src/modules/teacher/controllers/evaluation.controller.js';
import { evaluationService } from '../../../src/modules/teacher/services/evaluation.service.js';

jest.mock('../../../src/modules/teacher/services/evaluation.service.js');

describe('evaluationController', () => {
  let req, res;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    req = {
      params: {},
      body: {},
      user: { id: 1 }
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('crearPlantilla', () => {
    test('debería crear una plantilla exitosamente', async () => {
      const payload = {
        evaluacion: 'Test Eval',
        descripcion: 'Test',
        puntaje_evaluacion: 100,
        topicoId: 1,
        tipo_evaluacionId: 1,
        preguntas: []
      };

      req.body = payload;
      const mockResult = { id: 1, ...payload };

      evaluationService.createTemplate.mockResolvedValue(mockResult);

      await evaluationController.crearPlantilla(req, res);

      expect(evaluationService.createTemplate).toHaveBeenCalledWith(payload);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    test('debería retornar error 500 si hay excepción', async () => {
      req.body = { evaluacion: 'Test' };
      evaluationService.createTemplate.mockRejectedValue(new Error('DB Error'));

      await evaluationController.crearPlantilla(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'DB Error' });
    });
  });

  describe('obtenerPlantilla', () => {
    test('debería obtener una plantilla por ID', async () => {
      req.params.id = '1';
      const mockTemplate = { id: 1, evaluacion: 'Test' };

      evaluationService.getTemplateById.mockResolvedValue(mockTemplate);

      await evaluationController.obtenerPlantilla(req, res);

      expect(evaluationService.getTemplateById).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith(mockTemplate);
    });

    test('debería retornar 404 si plantilla no existe', async () => {
      req.params.id = '999';

      evaluationService.getTemplateById.mockResolvedValue(null);

      await evaluationController.obtenerPlantilla(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Plantilla no encontrada' });
    });

    test('debería retornar error 500 si hay excepción', async () => {
      req.params.id = '1';
      evaluationService.getTemplateById.mockRejectedValue(new Error('DB Error'));

      await evaluationController.obtenerPlantilla(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'DB Error' });
    });
  });

  describe('responderEvaluacion', () => {
    test('debería procesar respuestas correctamente', async () => {
      req.params.id = '1';
      req.user = { id: 1 };
      req.body = {
        answers: [
          { preguntaId: 1, respuestaId: 1 }
        ]
      };

      const mockResult = { totalPuntaje: 10, resultId: 1 };
      evaluationService.submitAnswers.mockResolvedValue(mockResult);

      await evaluationController.responderEvaluacion(req, res);

      expect(evaluationService.submitAnswers).toHaveBeenCalledWith('1', 1, req.body.answers);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    test('debería retornar error 400 si no hay usuarioId', async () => {
      req.params.id = '1';
      req.user = null;
      req.body = { answers: [] };

      await evaluationController.responderEvaluacion(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'UsuarioId requerido' });
    });

    test('debería usar usuarioId del body si no está en token', async () => {
      req.params.id = '1';
      req.user = null;
      req.body = {
        usuarioId: 5,
        answers: [{ preguntaId: 1, respuestaId: 1 }]
      };

      const mockResult = { totalPuntaje: 10, resultId: 1 };
      evaluationService.submitAnswers.mockResolvedValue(mockResult);

      await evaluationController.responderEvaluacion(req, res);

      expect(evaluationService.submitAnswers).toHaveBeenCalledWith('1', 5, req.body.answers);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test('debería retornar error 500 si hay excepción', async () => {
      req.params.id = '1';
      req.body = { answers: [] };

      evaluationService.submitAnswers.mockRejectedValue(new Error('Eval not found'));

      await evaluationController.responderEvaluacion(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Eval not found' });
    });
  });
});

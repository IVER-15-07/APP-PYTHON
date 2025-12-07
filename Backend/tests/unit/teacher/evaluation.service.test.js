import { evaluationService } from "../../../src/modules/teacher/services/evaluation.service.js";
import evaluationRepository from "../../../src/modules/teacher/repositories/evaluation.repository.js";

jest.mock("../../../src/modules/teacher/repositories/evaluation.repository.js");

describe("evaluationService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createTemplate", () => {
    test("debería crear una plantilla de evaluación correctamente", async () => {
      const payload = {
        evaluacion: "Evaluación Python Básico",
        descripcion: "Test de variables",
        puntaje_evaluacion: 100,
        topicoId: 1,
        tipo_evaluacionId: 1,
        fecha_ini: "2025-12-10T08:00:00Z",
        fecha_fin: "2025-12-15T18:00:00Z",
        preguntas: [
          {
            pregunta: "¿Qué es una variable?",
            parametroId: 1,
            valor: 10,
            respuestas: [
              { respuesta: "Contenedor de datos", puntaje: 10 },
              { respuesta: "Función", puntaje: 0 }
            ]
          }
        ]
      };

      const mockCreated = {
        id: 1,
        ...payload,
        evaluacion_pregunta: []
      };

      evaluationRepository.createEvaluation.mockResolvedValue(mockCreated);

      const result = await evaluationService.createTemplate(payload);

      expect(evaluationRepository.createEvaluation).toHaveBeenCalled();
      expect(result.id).toBe(1);
      expect(result.evaluacion).toBe("Evaluación Python Básico");
    });

    test("debería manejar payload sin preguntas", async () => {
      const payload = {
        evaluacion: "Evaluación vacía",
        descripcion: "Sin preguntas",
        puntaje_evaluacion: 0,
        topicoId: 1,
        tipo_evaluacionId: 1,
        preguntas: []
      };

      const mockCreated = { id: 2, ...payload, evaluacion_pregunta: [] };
      evaluationRepository.createEvaluation.mockResolvedValue(mockCreated);

      const result = await evaluationService.createTemplate(payload);

      expect(result.id).toBe(2);
      expect(result.evaluacion_pregunta).toEqual([]);
    });
  });

  describe("getTemplateById", () => {
    test("debería obtener una plantilla por ID", async () => {
      const mockTemplate = {
        id: 1,
        evaluacion: "Test",
        descripcion: "Descripción",
        evaluacion_pregunta: [
          {
            id: 1,
            preguntaId: 1,
            pregunta: {
              id: 1,
              pregunta: "¿Qué es?",
              parametroId: 1,
              valor: 5,
              respuesta: [
                { id: 1, respuesta: "Respuesta correcta", puntaje: 5 }
              ],
              parametro: { id: 1, nombre: "single" }
            }
          }
        ]
      };

      evaluationRepository.findEvaluationById.mockResolvedValue(mockTemplate);

      const result = await evaluationService.getTemplateById(1);

      expect(evaluationRepository.findEvaluationById).toHaveBeenCalledWith(1);
      expect(result.id).toBe(1);
      expect(result.evaluacion_pregunta.length).toBe(1);
    });

    test("debería retornar null si la evaluación no existe", async () => {
      evaluationRepository.findEvaluationById.mockResolvedValue(null);

      const result = await evaluationService.getTemplateById(999);

      expect(result).toBeNull();
    });
  });

  describe("submitAnswers", () => {
    test("debería procesar respuestas correctamente y calcular puntuación", async () => {
      const mockEvaluation = {
        id: 1,
        evaluacion_pregunta: [
          {
            id: 1,
            preguntaId: 1,
            pregunta: {
              id: 1,
              pregunta: "¿Qué es una variable?",
              parametroId: 1,
              valor: 10,
              respuesta: [
                { id: 1, respuesta: "Contenedor", puntaje: 10 },
                { id: 2, respuesta: "Función", puntaje: 0 }
              ],
              parametro: { nombre: "single" }
            }
          },
          {
            id: 2,
            preguntaId: 2,
            pregunta: {
              id: 2,
              pregunta: "¿Cuál es el resultado de 5+3?",
              parametroId: 2,
              valor: 5,
              respuesta: [
                { id: 3, respuesta: "8", puntaje: 5 },
                { id: 4, respuesta: "7", puntaje: 0 }
              ],
              parametro: { nombre: "numeric" }
            }
          }
        ]
      };

      evaluationRepository.findEvaluationById.mockResolvedValue(mockEvaluation);
      evaluationRepository.bulkCreateStudentResponses.mockResolvedValue([]);
      evaluationRepository.createEvaluationResult.mockResolvedValue({
        id: 1,
        usuarioId: 1,
        evaluacionId: 1,
        totalPuntos: 15,
        escala: 100
      });

      const answers = [
        { preguntaId: 1, respuestaId: 1 },
        { preguntaId: 2, respuestaId: 3 }
      ];

      const result = await evaluationService.submitAnswers(1, 1, answers);

      expect(evaluationRepository.bulkCreateStudentResponses).toHaveBeenCalled();
      expect(evaluationRepository.createEvaluationResult).toHaveBeenCalled();
      expect(result.totalPuntaje).toBe(15);
      expect(result.resultId).toBe(1);
    });

    test("debería marcar respuestas abiertas como pendientes", async () => {
      const mockEvaluation = {
        id: 1,
        evaluacion_pregunta: [
          {
            id: 1,
            preguntaId: 1,
            pregunta: {
              id: 1,
              pregunta: "¿Cuáles son tus conclusiones?",
              parametroId: 3,
              valor: 20,
              respuesta: [],
              parametro: { nombre: "open" }
            }
          }
        ]
      };

      evaluationRepository.findEvaluationById.mockResolvedValue(mockEvaluation);
      evaluationRepository.bulkCreateStudentResponses.mockResolvedValue([]);
      evaluationRepository.createEvaluationResult.mockResolvedValue({
        id: 2,
        usuarioId: 2,
        evaluacionId: 1,
        totalPuntos: 0,
        escala: 100
      });

      const answers = [
        { preguntaId: 1, respuestaTxt: "Mi respuesta abierta aquí" }
      ];

      const result = await evaluationService.submitAnswers(1, 2, answers);

      const createCall = evaluationRepository.bulkCreateStudentResponses.mock.calls[0][0];
      expect(createCall[0].estado).toBe("pendiente");
      expect(result.totalPuntaje).toBe(0);
    });

    test("debería lanzar error si la evaluación no existe", async () => {
      evaluationRepository.findEvaluationById.mockResolvedValue(null);

      await expect(evaluationService.submitAnswers(999, 1, []))
        .rejects
        .toThrow("Evaluacion no encontrada");
    });

    test("debería calcular múltiples respuestas correctas para multiple-choice", async () => {
      const mockEvaluation = {
        id: 1,
        evaluacion_pregunta: [
          {
            id: 1,
            preguntaId: 1,
            pregunta: {
              id: 1,
              pregunta: "Selecciona todas las válidas",
              parametroId: 4,
              valor: 15,
              respuesta: [
                { id: 1, respuesta: "Opción A", puntaje: 7 },
                { id: 2, respuesta: "Opción B", puntaje: 8 },
                { id: 3, respuesta: "Opción C", puntaje: 0 }
              ],
              parametro: { nombre: "multiple" }
            }
          }
        ]
      };

      evaluationRepository.findEvaluationById.mockResolvedValue(mockEvaluation);
      evaluationRepository.bulkCreateStudentResponses.mockResolvedValue([]);
      evaluationRepository.createEvaluationResult.mockResolvedValue({
        id: 3,
        usuarioId: 3,
        evaluacionId: 1,
        totalPuntos: 15,
        escala: 100
      });

      const answers = [
        { preguntaId: 1, respuestaIds: [1, 2] }
      ];

      const result = await evaluationService.submitAnswers(1, 3, answers);

      expect(result.totalPuntaje).toBe(15);
    });
  });
});

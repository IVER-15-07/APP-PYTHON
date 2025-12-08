import prisma from "../../../config/database.js";

export const evaluationRepository = {
  createEvaluation: (data) => prisma.evaluacion.create({ data }),

  findEvaluationById: (id) => prisma.evaluacion.findUnique({
    where: { id: Number(id) },
    include: {
      evaluacion_pregunta: {
        include: { pregunta: { include: { respuesta: true, parametro: true } } }
      }
    }
  }),

  findAllEvaluations: () => prisma.evaluacion.findMany({
    include: {
      evaluacion_pregunta: {
        include: { pregunta: { include: { respuesta: true, parametro: true } } }
      }
    },
    orderBy: { id: 'desc' }
  }),

  createStudentResponse: (data) => prisma.respuestaEstudiante.create({ data }),

  bulkCreateStudentResponses: (dataArray) => prisma.$transaction(
    dataArray.map((d) => prisma.respuestaEstudiante.create({ data: d }))
  ),

  createEvaluationResult: (data) => prisma.evaluacionResultado.create({ data }),

  getResultsForEvaluation: (evaluacionId) => prisma.evaluacionResultado.findMany({ where: { evaluacionId: Number(evaluacionId) } }),
};

export default evaluationRepository;

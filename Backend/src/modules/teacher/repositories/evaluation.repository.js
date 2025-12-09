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

  createStudentResponse: (data) => prisma.respuestaEstudiante.create({ data }),

  bulkCreateStudentResponses: (dataArray) => prisma.$transaction(
    dataArray.map((d) => prisma.respuestaEstudiante.create({ data: d }))
  ),

  createEvaluationResult: (data) => prisma.evaluacionResultado.create({ data }),

  getResultsForEvaluation: (evaluacionId) => prisma.evaluacionResultado.findMany({ where: { evaluacionId: Number(evaluacionId) } }),

  getParametros: () => prisma.parametro.findMany(),

  getParametroById: (id) => prisma.parametro.findUnique({ where: { id: Number(id) } }),
  listEvaluations: (filter = {}) => {
    const where = {};
    if (filter.cursoId) where.cursoId = Number(filter.cursoId);
    if (filter.topicoId) where.topicoId = Number(filter.topicoId);
    if (typeof filter.published !== 'undefined') where.published = Boolean(filter.published);
    return prisma.evaluacion.findMany({
      where,
      include: {
        curso: true,
        topico: true,
        evaluacion_pregunta: { include: { pregunta: { include: { respuesta: true, parametro: true } } } }
      },
      orderBy: { id: 'desc' }
    });
  },
};

export default evaluationRepository;

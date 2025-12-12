import evaluationRepository from '../repositories/evaluation.repository.js';

const calculateScoreForQuestion = (question, answerPayload) => {
  
  const tipo = question.pregunta.parametro?.nombre || '';

  if (tipo === 'open') {
    return { puntaje: 0, estado: 'pendiente' };
  }

  
  if (tipo === 'single' || tipo === 'vf' || tipo === 'numeric' || tipo === 'multiple') {
    const options = question.pregunta.respuesta || [];

    if (Array.isArray(answerPayload)) {
      
      const matched = options.filter((o) => answerPayload.includes(o.id));
      const puntaje = matched.reduce((s, o) => s + (o.puntaje || 0), 0);
      return { puntaje, estado: 'calificado' };
    } else if (typeof answerPayload === 'number') {
      const opt = options.find((o) => o.id === answerPayload);
      const puntaje = opt ? (opt.puntaje || 0) : 0;
      return { puntaje, estado: 'calificado' };
    } else if (typeof answerPayload === 'string') {
      
      const opt = options.find((o) => String(o.respuesta).trim() === answerPayload.trim());
      const puntaje = opt ? (opt.puntaje || 0) : 0;
      return { puntaje, estado: opt ? 'calificado' : 'pendiente' };
    }
  }

  return { puntaje: 0, estado: 'pendiente' };
};

export const evaluationService = {
  createTemplate: async (payload) => {
    // payload expected shape: { evaluacion, descripcion, fecha_ini, fecha_fin, topicoId, cursoId, preguntas: [{ pregunta, parametroId, valor, respuestas:[{respuesta,puntaje}] }], published }
    const { preguntas = [], published, ...rest } = payload;

    // Validar que todos los parametroId existan en la BD
    if (preguntas.length > 0) {
      const parametroIds = [...new Set(preguntas.map(q => q.parametroId))]; // IDs únicos
      const validParams = await evaluationRepository.getParametros();
      const validIds = validParams.map(p => p.id);
      
      const invalidIds = parametroIds.filter(id => !validIds.includes(id));
      if (invalidIds.length > 0) {
        throw new Error(`Parámetro(s) no válido(s): ${invalidIds.join(', ')}. Parámetros disponibles: ${validIds.join(', ')}`);
      }
    }

    // Build create data but only include `published` if explicitly provided.
    const base = {
      ...rest,
      tipo_evaluacionId: rest.tipo_evaluacionId || null,
      evaluacion_pregunta: {
        create: preguntas.map((q) => ({
          pregunta: {
            create: {
              pregunta: q.pregunta,
              parametroId: q.parametroId,
              valor: q.valor || 1,
              respuesta: { create: (q.respuestas || []).map((r) => ({ respuesta: r.respuesta, puntaje: r.puntaje })) }
            }
          }
        }))
      }
    };

    if (typeof published !== 'undefined') {
      base.published = published;
    }

    const created = await evaluationRepository.createEvaluation(base);
    return created;
  },

  getTemplateById: async (id) => {
    return evaluationRepository.findEvaluationById(id);
  },

  // List templates with optional filters
  listTemplates: async (filters = {}) => {
    return evaluationRepository.listEvaluations(filters);
  },

  submitAnswers: async (evaluacionId, usuarioId, answers) => {
    // answers: [{ preguntaId, respuestaId | respuestaTxt | respuestaIds[] }]
    const evaluation = await evaluationRepository.findEvaluationById(evaluacionId);
    if (!evaluation) throw new Error('Evaluacion no encontrada');

    const questions = evaluation.evaluacion_pregunta;

    const responseCreates = [];
    let totalPuntaje = 0;

    for (const qrel of questions) {
      const pregunta = qrel.pregunta;
      const ansPayload = (answers || []).find((a) => Number(a.preguntaId) === pregunta.id);
      const answerValue = ansPayload ? (ansPayload.respuestaIds ?? ansPayload.respuestaId ?? ansPayload.respuestaTxt) : null;

      const calc = calculateScoreForQuestion(qrel, answerValue);

      const createData = {
        usuarioId: Number(usuarioId),
        evaluacionId: Number(evaluacionId),
        preguntaId: pregunta.id,
        respuestaId: typeof answerValue === 'number' ? answerValue : null,
        respuestaTxt: typeof answerValue === 'string' ? answerValue : null,
        puntaje: calc.puntaje,
        estado: calc.estado
      };

      responseCreates.push(createData);
      totalPuntaje += calc.puntaje || 0;
    }

    // persist all respuestas estudiante in transaction
    await evaluationRepository.bulkCreateStudentResponses(responseCreates);

    // create evaluation result summary
    const result = await evaluationRepository.createEvaluationResult({ usuarioId: Number(usuarioId), evaluacionId: Number(evaluacionId), totalPuntos: totalPuntaje });

    return { totalPuntaje, resultId: result.id };
  }
};

export default evaluationService;

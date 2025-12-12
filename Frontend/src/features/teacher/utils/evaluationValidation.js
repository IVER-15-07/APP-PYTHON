/**
 * Validaciones para evaluaciones
 */

export const validateEvaluationTemplate = (form) => {
  const errors = [];

  if (!form.evaluacion?.trim()) {
    errors.push('El título es requerido');
  } else if (form.evaluacion.length < 3) {
    errors.push('El título debe tener al menos 3 caracteres');
  } else if (form.evaluacion.length > 255) {
    errors.push('El título no puede exceder 255 caracteres');
  }

  if (!form.cursoId) {
    errors.push('Selecciona un curso');
  }

  if (!form.preguntas || form.preguntas.length === 0) {
    errors.push('Agrega al menos una pregunta');
  } else {
    form.preguntas.forEach((q, idx) => {
     
      if (!q.pregunta?.trim()) {
        errors.push(`Pregunta ${idx + 1}: texto requerido`);
      }

     
      if (!q.parametroId) {
        errors.push(`Pregunta ${idx + 1}: tipo requerido`);
      }

    
      if (!q.valor || isNaN(q.valor) || q.valor <= 0) {
        errors.push(`Pregunta ${idx + 1}: valor debe ser un número mayor a 0`);
      }

      if ((q.parametroId === 1 || q.parametroId === 4)) {
        if (!q.respuestas || q.respuestas.length === 0) {
          errors.push(`Pregunta ${idx + 1}: agrega al menos una opción`);
        } else {
          
          q.respuestas.forEach((r, oi) => {
            if (!r.respuesta?.trim()) {
              errors.push(`Pregunta ${idx + 1}, Opción ${oi + 1}: texto requerido`);
            }
          });

          
          const hasCorrect = q.respuestas.some(r => r.esCorrecta);
          if (!hasCorrect) {
            errors.push(`Pregunta ${idx + 1}: marca al menos una opción como correcta`);
          }
        }
      }
    });
  }

  return errors;
};

/**
 * Calcular score total automático
 */
export const calculateAutoScore = (respuestas) => {
  let totalScore = 0;

  respuestas.forEach(resp => {
    if (resp.estado === 'calificado') {
      totalScore += resp.puntaje || 0;
    }
  });

  return totalScore;
};

/**
 * Validar respuesta de estudiante
 */
export const validateStudentAnswer = (pregunta, respuesta) => {
  if (!pregunta) return false;

  const tipo = pregunta.parametro?.nombre;

  switch (tipo) {
    case 'single':
    case 'vf':
    case 'numeric':
      return respuesta !== null && respuesta !== undefined && respuesta !== '';

    case 'multiple':
      return Array.isArray(respuesta) && respuesta.length > 0;

    case 'open':
      return typeof respuesta === 'string' && respuesta.trim().length > 0;

    default:
      return true;
  }
};

/**
 * Calcular puntos para una pregunta
 */
export const calculateQuestionScore = (pregunta, respuesta) => {
  if (!pregunta || respuesta === null || respuesta === undefined) return 0;

  const tipo = pregunta.parametro?.nombre;

  if (tipo === 'open') {
    
    return 0;
  }

  
  const options = pregunta.respuesta || [];
  const selectedOption = options.find(o => o.id === respuesta);

  if (selectedOption && selectedOption.puntaje > 0) {
    return selectedOption.puntaje;
  }

  return 0;
};

/**
 * Calcular puntos para múltiple choice
 */
export const calculateMultipleChoiceScore = (pregunta, respuestaIds, scoringPolicy = 'all') => {
  if (!pregunta || !Array.isArray(respuestaIds)) return 0;

  const options = pregunta.respuesta || [];
  const correctOptions = options.filter(o => o.puntaje > 0);

  if (scoringPolicy === 'all') {
   
    const selectedOptions = respuestaIds.map(id => options.find(o => o.id === id)).filter(Boolean);
    const isCorrect = selectedOptions.length === correctOptions.length &&
                      selectedOptions.every(o => correctOptions.some(co => co.id === o.id));
    return isCorrect ? pregunta.valor : 0;
  } else if (scoringPolicy === 'proportional') {
    
    const selectedCorrect = respuestaIds
      .map(id => options.find(o => o.id === id && o.puntaje > 0))
      .filter(Boolean);

    const selectedIncorrect = respuestaIds
      .map(id => options.find(o => o.id === id && o.puntaje === 0))
      .filter(Boolean);

    const earnedPoints = selectedCorrect.reduce((sum, o) => sum + (o.puntaje || 0), 0);
    const lostPoints = selectedIncorrect.length * (pregunta.valor / correctOptions.length);

    return Math.max(0, earnedPoints - lostPoints);
  }

  return 0;
};

/**
 * Validar que una evaluación se puede publicar
 */
export const canPublishTemplate = (form) => {
  const errors = validateEvaluationTemplate(form);
  return errors.length === 0;
};

/**
 * Normalizar puntuación a escala
 */
export const normalizeScore = (score, maxScore, scale = 100) => {
  if (maxScore === 0) return 0;
  return Math.round((score / maxScore) * scale);
};

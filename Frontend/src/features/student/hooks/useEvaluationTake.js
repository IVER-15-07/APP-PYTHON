import { useState } from 'react';

export const useEvaluationTake = () => {
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnswer = (preguntaId, value) => {
    setAnswers(prev => ({
      ...prev,
      [preguntaId]: value
    }));
  };

  const handleMultipleAnswer = (preguntaId, value, checked) => {
    setAnswers(prev => {
      const current = prev[preguntaId] || [];
      if (checked) {
        return {
          ...prev,
          [preguntaId]: [...current, value]
        };
      } else {
        return {
          ...prev,
          [preguntaId]: current.filter(v => v !== value)
        };
      }
    });
  };

  const getAnswerPayload = (preguntas) => {
    return preguntas.map(q => {
      const answer = answers[q.id];
      
      if (!answer) return null;

      if (typeof answer === 'number') {
        return { preguntaId: q.id, respuestaId: answer };
      }

      if (Array.isArray(answer)) {
        return { preguntaId: q.id, respuestaIds: answer };
      }

      if (typeof answer === 'string') {
        return { preguntaId: q.id, respuestaTxt: answer };
      }

      return null;
    }).filter(Boolean);
  };

  const resetAnswers = () => {
    setAnswers({});
    setError('');
  };

  return {
    answers,
    loading,
    error,
    setLoading,
    setError,
    handleAnswer,
    handleMultipleAnswer,
    getAnswerPayload,
    resetAnswers
  };
};

export default useEvaluationTake;

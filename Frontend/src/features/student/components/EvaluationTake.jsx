import React, { useState, useEffect } from 'react';
import { AlertCircle, Send, ChevronRight, ChevronLeft, Loader } from 'lucide-react';
import PropTypes from 'prop-types';
import useEvaluationTake from '../hooks/useEvaluationTake';
import evaluationsService from '../../../../services/evaluations.api';

const EvaluationTake = ({ evaluationId, onSuccess, onError }) => {
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [fetchError, setFetchError] = useState('');

  const { answers, handleAnswer, handleMultipleAnswer, getAnswerPayload } = useEvaluationTake();

  useEffect(() => {
    const loadEvaluation = async () => {
      try {
        const data = await evaluationsService.getTemplate(evaluationId);
        setEvaluation(data);
      } catch (error) {
        setFetchError(error.message);
        if (onError) onError(error);
      } finally {
        setLoading(false);
      }
    };

    loadEvaluation();
  }, [evaluationId, onError]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 max-w-md text-red-400 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-1" />
          <span>{fetchError}</span>
        </div>
      </div>
    );
  }

  if (!evaluation || !evaluation.evaluacion_pregunta) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400">No se pudo cargar la evaluación</p>
      </div>
    );
  }

  const preguntas = evaluation.evaluacion_pregunta.map(ep => ep.pregunta);
  const itemsPerPage = 1;
  const totalPages = Math.ceil(preguntas.length / itemsPerPage);
  const startIdx = currentPage * itemsPerPage;
  const currentQuestions = preguntas.slice(startIdx, startIdx + itemsPerPage);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = getAnswerPayload(preguntas);
      const result = await evaluationsService.submitEvaluation(evaluationId, payload);
      if (onSuccess) onSuccess(result);
    } catch (error) {
      setFetchError(error.message);
      if (onError) onError(error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question, index) => {
    const globalIndex = startIdx + index;
    const tipo = question.parametro?.nombre || '';
    const selectedAnswer = answers[question.id];

    return (
      <div key={question.id} className="bg-gray-800 rounded-lg p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-lg font-semibold text-white mb-2">
              Pregunta {globalIndex + 1} de {preguntas.length}
            </p>
            <p className="text-white text-base">{question.pregunta}</p>
            <p className="text-sm text-gray-400 mt-2">
              Valor: <span className="font-semibold text-green-400">{question.valor} puntos</span>
            </p>
          </div>
        </div>

        {/* Single choice */}
        {tipo === 'single' && (
          <div className="space-y-2 mt-4">
            {question.respuesta?.map(opt => (
              <label key={opt.id} className="flex items-center gap-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name={`question_${question.id}`}
                  value={opt.id}
                  checked={selectedAnswer === opt.id}
                  onChange={(e) => handleAnswer(question.id, parseInt(e.target.value))}
                  className="w-4 h-4"
                />
                <span className="text-white flex-1">{opt.respuesta}</span>
              </label>
            ))}
          </div>
        )}

        {/* Multiple choice */}
        {tipo === 'multiple' && (
          <div className="space-y-2 mt-4">
            {question.respuesta?.map(opt => (
              <label key={opt.id} className="flex items-center gap-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={Array.isArray(selectedAnswer) && selectedAnswer.includes(opt.id)}
                  onChange={(e) => handleMultipleAnswer(question.id, opt.id, e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-white flex-1">{opt.respuesta}</span>
              </label>
            ))}
          </div>
        )}

        {/* True/False */}
        {tipo === 'vf' && (
          <div className="flex gap-3 mt-4">
            {[true, false].map((val) => (
              <button
                key={val}
                onClick={() => handleAnswer(question.id, val ? 1 : 0)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                  selectedAnswer === (val ? 1 : 0)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {val ? 'Verdadero' : 'Falso'}
              </button>
            ))}
          </div>
        )}

        {/* Numeric */}
        {tipo === 'numeric' && (
          <input
            type="number"
            value={selectedAnswer || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            placeholder="Ingresa la respuesta numérica"
            className="mt-4 w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        )}

        {/* Text/Open */}
        {tipo === 'open' && (
          <textarea
            value={selectedAnswer || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            placeholder="Escribe tu respuesta..."
            rows={4}
            className="mt-4 w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{evaluation.evaluacion}</h1>
          <p className="text-gray-400">{evaluation.descripcion}</p>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Puntuación total: <span className="text-green-400 font-semibold">{evaluation.puntaje_evaluacion} puntos</span>
            </p>
            <p className="text-sm text-gray-400">
              Progreso: <span className="font-semibold">{currentPage + 1}/{totalPages}</span>
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-800 rounded-full h-2 mb-6">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
          />
        </div>

        {/* Questions */}
        <div className="mb-6">
          {currentQuestions.map((q, idx) => renderQuestion(q, idx))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 px-4 py-2 rounded-lg transition"
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>

          {currentPage < totalPages - 1 ? (
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition"
            >
              Siguiente <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 px-4 py-2 rounded-lg transition"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Enviando...' : 'Enviar evaluación'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

EvaluationTake.propTypes = {
  evaluationId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onSuccess: PropTypes.func,
  onError: PropTypes.func
};

export default EvaluationTake;

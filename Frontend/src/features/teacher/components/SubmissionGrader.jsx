import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Save, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import PropTypes from 'prop-types';
import evaluationsService from '../../../../services/evaluations.api';

const SubmissionGrader = ({ evaluacionId, onClose, onSuccess }) => {
  const [submissions, setSubmissions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [grading, setGrading] = useState(false);
  const [grades, setGrades] = useState({});

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        const data = await evaluationsService.getSubmissions(evaluacionId);
        const pending = data.filter(s => s.respuestas?.some(r => r.estado === 'pendiente'));
        setSubmissions(pending);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadSubmissions();
  }, [evaluacionId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <Loader className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-white">Cargando respuestas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <div className="flex items-start gap-3 text-red-400 mb-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-1" />
            <p>{error}</p>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full text-center">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">¡Listo!</h3>
          <p className="text-gray-400 mb-4">No hay respuestas pendientes de calificación.</p>
          <button
            onClick={onClose}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  const currentSubmission = submissions[currentIndex];
  const pendingAnswers = currentSubmission.respuestas?.filter(r => r.estado === 'pendiente') || [];

  const handleGradeChange = (preguntaId, value) => {
    setGrades(prev => ({
      ...prev,
      [preguntaId]: value
    }));
  };

  const handleSaveGrade = async (preguntaId) => {
    setGrading(true);
    try {
      const score = parseInt(grades[preguntaId]) || 0;
      await evaluationsService.gradeSubmission(
        evaluacionId,
        preguntaId,
        currentSubmission.usuarioId,
        { manual_score: score, comentario: '' }
      );

      // Recargar y mover a siguiente
      if (currentIndex < submissions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        if (onSuccess) onSuccess();
      }
      setGrades({});
    } catch (err) {
      setError(err.message);
    } finally {
      setGrading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-white mb-2">Calificar Respuestas</h2>
          <p className="text-gray-400">
            Respuesta {currentIndex + 1} de {submissions.length} - Estudiante: {currentSubmission?.usuario?.nombre}
          </p>
        </div>

        {/* Progress */}
        <div className="px-6 pt-6">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / submissions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {pendingAnswers.length === 0 ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-green-400 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>Todas las respuestas de este estudiante ya están calificadas.</span>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingAnswers.map((answer, idx) => (
                <div key={idx} className="bg-gray-700 rounded-lg p-4 space-y-3">
                  <div>
                    <h4 className="font-semibold text-white mb-2">
                      Pregunta: {answer.pregunta?.pregunta}
                    </h4>
                    <p className="text-sm text-gray-300 bg-gray-800 rounded p-3">
                      <strong>Respuesta del estudiante:</strong> {answer.respuestaTxt}
                    </p>
                  </div>

                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-300 mb-2">
                        Puntuación (máx: {answer.pregunta?.valor})
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={answer.pregunta?.valor}
                        value={grades[answer.pregunta?.id] || 0}
                        onChange={(e) => handleGradeChange(answer.pregunta?.id, e.target.value)}
                        className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                      />
                    </div>
                    <button
                      onClick={() => handleSaveGrade(answer.pregunta?.id)}
                      disabled={grading}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition"
                    >
                      <Save className="w-4 h-4" />
                      Guardar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="sticky bottom-0 bg-gray-900 border-t border-gray-700 p-6 flex items-center justify-between gap-3">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition"
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>

          <div className="text-sm text-gray-400">
            {currentIndex + 1} / {submissions.length}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
            >
              Cerrar
            </button>
            <button
              onClick={() => setCurrentIndex(Math.min(submissions.length - 1, currentIndex + 1))}
              disabled={currentIndex === submissions.length - 1}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition"
            >
              Siguiente <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

SubmissionGrader.propTypes = {
  evaluacionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func
};

export default SubmissionGrader;

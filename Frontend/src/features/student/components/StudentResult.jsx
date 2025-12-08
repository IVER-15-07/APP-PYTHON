import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Loader, Download } from 'lucide-react';
import PropTypes from 'prop-types';
import evaluationsService from '../../../../services/evaluations.api';

const StudentResult = ({ evaluacionId, usuarioId, onClose }) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadResult = async () => {
      try {
        const data = await evaluationsService.getSubmissionResult(evaluacionId, usuarioId);
        setResult(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadResult();
  }, [evaluacionId, usuarioId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <Loader className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-white">Cargando resultados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <div className="flex items-start gap-3 text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-2">Error</h3>
              <p className="text-sm">{error}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const porcentaje = Math.round((result.totalPuntos / result.puntajeTotal) * 100);
  const isPassed = porcentaje >= 60; // Asumiendo 60% como mínimo
  const hasPendingGrades = result.respuestas?.some(r => r.estado === 'pendiente');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-white mb-2">Tus Resultados</h2>
          <p className="text-gray-400">{result.evaluacion}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Score summary */}
          <div className={`rounded-lg p-6 ${isPassed ? 'bg-green-500/10 border border-green-500/30' : 'bg-yellow-500/10 border border-yellow-500/30'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Puntuación</h3>
              {isPassed ? (
                <CheckCircle className="w-6 h-6 text-green-400" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
              )}
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-white mb-2">
                {result.totalPuntos} / {result.puntajeTotal}
              </p>
              <p className="text-xl font-semibold" style={{ color: isPassed ? '#10b981' : '#f59e0b' }}>
                {porcentaje}%
              </p>
            </div>
          </div>

          {/* Pending grades warning */}
          {hasPendingGrades && (
            <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-blue-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Calificación incompleta</p>
                <p className="text-sm">Esta evaluación tiene preguntas pendientes de calificación manual. Te notificaremos cuando esté completa.</p>
              </div>
            </div>
          )}

          {/* Desglose por pregunta */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Desglose por pregunta</h3>
            <div className="space-y-3">
              {result.respuestas?.map((resp, idx) => (
                <div key={idx} className="bg-gray-700 rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <p className="font-medium text-white">
                      Pregunta {idx + 1}: {resp.pregunta?.pregunta}
                    </p>
                    <span className={`px-3 py-1 rounded text-sm font-medium ${
                      resp.estado === 'calificado' 
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {resp.estado === 'calificado' ? 'Calificado' : 'Pendiente'}
                    </span>
                  </div>

                  <div className="text-sm text-gray-300">
                    <p><strong>Tu respuesta:</strong> {resp.respuestaTxt || `Opción ${resp.respuestaId}`}</p>
                    {resp.respuestaCorrecta && (
                      <p><strong>Respuesta correcta:</strong> {resp.respuestaCorrecta}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-600">
                    <span className="text-gray-400 text-sm">Valor: {resp.pregunta?.valor} pts</span>
                    <span className="font-semibold">
                      <span className={resp.puntaje > 0 ? 'text-green-400' : 'text-red-400'}>
                        {resp.puntaje || 0} pts
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
            >
              Cerrar
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              <Download className="w-4 h-4" />
              Descargar PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

StudentResult.propTypes = {
  evaluacionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  usuarioId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onClose: PropTypes.func
};

export default StudentResult;

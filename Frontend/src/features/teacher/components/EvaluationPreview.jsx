import React from 'react';
import PropTypes from 'prop-types';

const EvaluationPreview = ({ evaluation }) => {
  if (!evaluation) return <div>No hay datos para mostrar.</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold">{evaluation.evaluacion}</h2>
      <p className="text-sm text-gray-400 mt-2">{evaluation.descripcion || 'Sin descripción'}</p>

      <div className="mt-3 text-sm text-gray-400 grid grid-cols-1 md:grid-cols-2 gap-2">
        <div><strong>Curso:</strong> {evaluation.curso?.nombre || '—'}</div>
        <div><strong>Tópico:</strong> {evaluation.topico?.nombre || '—'}</div>
        <div><strong>Fecha inicio:</strong> {evaluation.fecha_ini ? new Date(evaluation.fecha_ini).toLocaleString() : '—'}</div>
        <div><strong>Fecha fin:</strong> {evaluation.fecha_fin ? new Date(evaluation.fecha_fin).toLocaleString() : '—'}</div>
        <div><strong>Puntaje total:</strong> {evaluation.puntaje_evaluacion}</div>
        <div><strong>Publicado:</strong> {evaluation.published ? 'Sí' : 'No'}</div>
      </div>

      <div className="mt-6 space-y-4">
        {(evaluation.evaluacion_pregunta || []).map((rel, idx) => {
          const q = rel.pregunta;
          return (
            <div key={idx} className="bg-gray-900 border border-gray-700 rounded p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{idx + 1}. {q?.pregunta || 'Pregunta sin texto'}</div>
                  <div className="text-xs text-gray-400">Tipo: {q?.parametro?.nombre || '—'}</div>
                </div>
                <div className="text-sm text-green-300">{q?.valor || 0} pts</div>
              </div>

              {q?.respuesta && q.respuesta.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {q.respuesta.map((opt, oi) => (
                    <li key={oi} className="flex items-center gap-3 text-sm">
                      <span className={"inline-block w-3 h-3 rounded-full " + (opt.puntaje > 0 ? 'bg-green-400' : 'bg-gray-600')} />
                      <span className="flex-1 text-gray-200">{opt.respuesta}</span>
                      <span className="text-xs text-gray-400">{opt.puntaje} pts</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

EvaluationPreview.propTypes = {
  evaluation: PropTypes.object
};

export default EvaluationPreview;

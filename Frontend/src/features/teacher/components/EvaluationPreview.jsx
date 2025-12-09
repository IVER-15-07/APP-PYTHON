import React from 'react';
import PropTypes from 'prop-types';
import { BookOpen, Calendar, Clock, Award, CheckCircle2, Circle } from 'lucide-react';

const EvaluationPreview = ({ evaluation }) => {
  if (!evaluation) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-400">No hay datos para mostrar.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <h2 className="text-3xl font-bold text-white">{evaluation.evaluacion}</h2>
        <p className="text-slate-400">{evaluation.descripcion || 'Sin descripción'}</p>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <BookOpen className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Curso</p>
              <p className="font-medium text-white">{evaluation.curso?.nombre || '—'}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <BookOpen className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Tópico</p>
              <p className="font-medium text-white">{evaluation.topico?.nombre || '—'}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Calendar className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Fecha inicio</p>
              <p className="font-medium text-white">
                {evaluation.fecha_ini ? new Date(evaluation.fecha_ini).toLocaleString('es-ES') : '—'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <Clock className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Fecha fin</p>
              <p className="font-medium text-white">
                {evaluation.fecha_fin ? new Date(evaluation.fecha_fin).toLocaleString('es-ES') : '—'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Award className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Puntaje total</p>
              <p className="font-medium text-white">{evaluation.puntaje_evaluacion} puntos</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${evaluation.published ? 'bg-green-500/10' : 'bg-slate-500/10'}`}>
              <CheckCircle2 className={`w-5 h-5 ${evaluation.published ? 'text-green-400' : 'text-slate-400'}`} />
            </div>
            <div>
              <p className="text-xs text-slate-400">Estado</p>
              <p className="font-medium text-white">{evaluation.published ? 'Publicado' : 'Borrador'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-green-400" />
          Preguntas ({evaluation.evaluacion_pregunta?.length || 0})
        </h3>

        <div className="space-y-3">
          {(evaluation.evaluacion_pregunta || []).map((rel, idx) => {
            const q = rel.pregunta;
            return (
              <div 
                key={idx} 
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 hover:border-slate-600/50 transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-green-500/10 text-green-400 text-sm font-semibold">
                        {idx + 1}
                      </span>
                      <h4 className="font-medium text-white">{q?.pregunta || 'Pregunta sin texto'}</h4>
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {q?.parametro?.nombre || 'Sin tipo'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
                    <Award className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-semibold text-green-400">{q?.valor || 0} pts</span>
                  </div>
                </div>

                {q?.respuesta && q.respuesta.length > 0 && (
                  <div className="space-y-2 pl-9">
                    {q.respuesta.map((opt, oi) => (
                      <div 
                        key={oi} 
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                          opt.puntaje > 0 
                            ? 'bg-green-500/5 border border-green-500/20' 
                            : 'bg-slate-700/20 border border-slate-700/50'
                        }`}
                      >
                        {opt.puntaje > 0 ? (
                          <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        )}
                        <span className="flex-1 text-slate-200">{opt.respuesta}</span>
                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                          opt.puntaje > 0 ? 'bg-green-500/10 text-green-400' : 'text-slate-500'
                        }`}>
                          {opt.puntaje} pts
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

EvaluationPreview.propTypes = {
  evaluation: PropTypes.object
};

export default EvaluationPreview;

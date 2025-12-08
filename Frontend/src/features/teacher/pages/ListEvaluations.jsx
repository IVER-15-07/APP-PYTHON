import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Eye, Edit } from 'lucide-react';
import { evaluationsService } from '../../../services';

export default function ListEvaluations() {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        setLoading(true);

        try {
          const res = await evaluationsService.listTemplates();

          const transformed = (Array.isArray(res) ? res : []).map((e) => ({
            id: e.id,
            evaluacion: e.evaluacion,
            descripcion: e.descripcion,
            fecha_ini: e.fecha_ini,
            fecha_fin: e.fecha_fin,
            preguntas: e.evaluacion_pregunta || [],
            puntaje_evaluacion: e.puntaje_evaluacion || 0
          }));

          setEvaluations(transformed);
        } catch (apiErr) {
          const stored = localStorage.getItem('evaluations');
          if (stored) setEvaluations(JSON.parse(stored));
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching evaluations:', err);
        setError('No se pudieron cargar las evaluaciones');
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/30 shadow-lg shadow-emerald-500/20">
                <Plus className="w-5 h-5" />
              </div>
              <h1 className="text-3xl font-bold text-white">Evaluaciones</h1>
            </div>
            <p className="text-slate-400 mt-1">Gestiona tus evaluaciones y plantillas</p>
          </div>
          <Link
            to="/profesor/evaluaciones/crear"
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            <Plus className="w-5 h-5" />
            Nueva Evaluación
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/60 border border-red-700 text-red-200 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : evaluations.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Eye className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Sin evaluaciones
            </h3>
            <p className="text-gray-600 mb-6">
              Aún no has creado ninguna evaluación. ¡Crea una nueva para comenzar!
            </p>
            <Link
              to="/profesor/evaluaciones/crear"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4" />
              Crear Primera Evaluación
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {evaluations.map((evaluation) => (
              <div key={evaluation.id} className="bg-slate-900/80 rounded-2xl shadow hover:shadow-lg transition p-6 border border-slate-700/50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white mb-2">{evaluation.evaluacion}</h2>
                    <p className="text-slate-400 mb-4">{evaluation.descripcion || 'Sin descripción'}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Fecha Inicio</p>
                        <p className="font-semibold text-white">{formatDate(evaluation.fecha_ini)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Fecha Fin</p>
                        <p className="font-semibold text-white">{formatDate(evaluation.fecha_fin)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Preguntas</p>
                        <p className="font-semibold text-white">{evaluation.preguntas?.length || 0}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Puntuación Total</p>
                        <p className="font-semibold text-white">{evaluation.puntaje_evaluacion || 0} pts</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Link to={`/profesor/evaluaciones/${evaluation.id}/ver`} className="p-2 text-blue-400 hover:bg-blue-900/30 rounded-lg transition" title="Ver detalles">
                      <Eye className="w-5 h-5" />
                    </Link>
                    <Link to={`/profesor/evaluaciones/${evaluation.id}/editar`} className="p-2 text-emerald-400 hover:bg-emerald-900/30 rounded-lg transition" title="Editar">
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button onClick={() => handleDelete(evaluation.id)} className="p-2 text-rose-400 hover:bg-rose-900/30 rounded-lg transition" title="Eliminar">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

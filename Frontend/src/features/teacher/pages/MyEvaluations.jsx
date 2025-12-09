import { useEffect, useState } from 'react';
import evaluationsService from '../../../../services/evaluations.api.js';
import EvaluationEditor from '../components/EvaluationEditor';
import EvaluationPreview from '../components/EvaluationPreview';
import { Modal, CreateButton } from '../../../components/ui';
import { FileText } from 'lucide-react';

const MyEvaluations = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedEval, setSelectedEval] = useState(null);

  const fetchEvaluations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await evaluationsService.getMyEvaluations();
      setEvaluations(data || []);
    } catch (err) {
      setError(err.message || 'Error al cargar evaluaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const handleCreated = async () => {
    setCreateOpen(false);
    await fetchEvaluations();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Mis Evaluaciones</h1>
              <p className="text-slate-400">Administra las plantillas de evaluación que has creado</p>
            </div>
            <CreateButton onClick={() => setCreateOpen(true)}>
              Nueva evaluación
            </CreateButton>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Lista de evaluaciones - Ocupa 3 columnas */}
          <section className="lg:col-span-3 space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Evaluaciones creadas</h2>

            {loading && (
              <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center shadow-2xl">
                <div className="text-slate-400">Cargando...</div>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-center shadow-2xl">
                <div className="text-red-400">{error}</div>
              </div>
            )}

            {!loading && evaluations.length === 0 && (
              <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center shadow-2xl">
                <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-300 mb-2">Aún no tienes evaluaciones</h3>
                <p className="text-slate-500 text-sm">Crea tu primera evaluación usando el botón de arriba.</p>
              </div>
            )}

            {!loading && evaluations.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {evaluations.map(ev => (
                  <article 
                    key={ev.id} 
                    className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 hover:border-green-500/30 transition-all duration-200 shadow-xl hover:shadow-2xl group"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white mb-2 truncate group-hover:text-green-400 transition-colors">
                          {ev.evaluacion}
                        </h3>
                        <p className="text-slate-400 text-sm line-clamp-2">{ev.descripcion}</p>
                      </div>
                      <span className="inline-flex px-3 py-1 bg-green-500/10 text-green-400 text-sm font-semibold rounded-full border border-green-500/30 shrink-0">
                        {ev.puntaje_evaluacion} pts
                      </span>
                    </div>

                    {/* Info del curso y tópico */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-medium">Curso:</span>
                        <span className="inline-flex px-2 py-1 bg-slate-800 text-slate-300 rounded-full border border-slate-700/50">
                          {ev.curso?.nombre || '—'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-medium">Tópico:</span>
                        <span className="inline-flex px-2 py-1 bg-slate-800 text-slate-300 rounded-full border border-slate-700/50">
                          {ev.topico?.nombre || '—'}
                        </span>
                      </div>
                    </div>

                    {/* Número de preguntas */}
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Total de preguntas</span>
                        <span className="text-lg font-bold text-blue-400">{ev.evaluacion_pregunta?.length || 0}</span>
                      </div>
                    </div>

                    {/* Botón de acción */}
                    <button
                      onClick={() => { setSelectedEval(ev); setViewOpen(true); }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30 transition-all duration-200 text-sm font-medium"
                    >
                      Ver detalles
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Sidebar resumen - Ocupa 1 columna */}
          <aside className="lg:col-span-1">
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl sticky top-6">
              <h3 className="text-xl font-bold text-white mb-6">Resumen</h3>
              
              <div className="space-y-4">
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                  <div className="text-sm text-slate-400 mb-1">Total de evaluaciones</div>
                  <div className="text-3xl font-bold text-white">{evaluations.length}</div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Modal para crear evaluación */}
        {createOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <EvaluationEditor onSuccess={handleCreated} onCancel={() => setCreateOpen(false)} />
              </div>
            </div>
          </div>
        )}

        {/* Modal para ver evaluación */}
        <Modal open={viewOpen} onClose={() => { setViewOpen(false); setSelectedEval(null); }} title="Vista de evaluación" size="lg">
          <div className="p-4">
            <EvaluationPreview evaluation={selectedEval} />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default MyEvaluations;

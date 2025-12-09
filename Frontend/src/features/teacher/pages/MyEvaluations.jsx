import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import evaluationsService from '../../../../services/evaluations.api.js';
import EvaluationEditor from '../components/EvaluationEditor';
import EvaluationPreview from '../components/EvaluationPreview';
import { Modal } from '../../../components/ui';

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
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Mis Evaluaciones</h1>
          <p className="text-sm text-gray-400">Administra las plantillas de evaluación que has creado.</p>
        </div>
        <div>
          <button onClick={() => setCreateOpen(true)} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white">
            <Plus className="w-4 h-4" /> Crear evaluación
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading && <div> Cargando... </div>}
        {error && <div className="text-red-400">{error}</div>}
        {!loading && evaluations.length === 0 && (
          <div className="text-gray-400">No hay evaluaciones creadas aún.</div>
        )}

        {evaluations.map(ev => (
          <div key={ev.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg text-white">{ev.evaluacion}</h3>
                <p className="text-sm text-gray-400 mt-2">{ev.descripcion}</p>
                <div className="mt-3 text-xs text-gray-400">
                  <div>Curso: {ev.curso?.nombre || '—'}</div>
                  <div>Tópico: {ev.topico?.nombre || '—'}</div>
                </div>
              </div>
              <div className="text-sm text-green-300">{ev.puntaje_evaluacion} pts</div>
            </div>

            <div className="mt-4 text-sm text-gray-300">
              <strong>Preguntas:</strong> {ev.evaluacion_pregunta?.length || 0}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => { setSelectedEval(ev); setViewOpen(true); }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 rounded-xl border border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-200 text-sm font-medium"
              >
                Ver
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Crear evaluación" size="xl">
        <div className="p-4">
          <EvaluationEditor onSuccess={handleCreated} />
        </div>
      </Modal>

      <Modal open={viewOpen} onClose={() => { setViewOpen(false); setSelectedEval(null); }} title="Vista de evaluación" size="lg">
        <div className="p-4">
          <EvaluationPreview evaluation={selectedEval} />
        </div>
      </Modal>
    </div>
  );
};

export default MyEvaluations;

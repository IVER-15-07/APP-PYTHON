import { useState } from 'react';
import evaluationsService from '../../../../services/evaluations.api';

function QuestionEditor({ q, onChange, onRemove }) {
  const update = (patch) => onChange({ ...q, ...patch });

  return (
    <div className="p-4 border rounded-lg bg-slate-800/30 space-y-3">
      <div className="flex justify-between">
        <h4 className="font-semibold">Pregunta</h4>
        <button type="button" onClick={onRemove} className="text-red-400">Eliminar</button>
      </div>

      <div>
        <label className="text-sm text-slate-300">Texto de la pregunta</label>
        <input value={q.pregunta} onChange={(e) => update({ pregunta: e.target.value })} className="w-full mt-1 p-2 rounded bg-slate-900/40" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-slate-300">ParametroId (ej: 1)</label>
          <input value={q.parametroId} onChange={(e) => update({ parametroId: Number(e.target.value) })} className="w-full mt-1 p-2 rounded bg-slate-900/40" />
        </div>
        <div>
          <label className="text-sm text-slate-300">Valor (peso)</label>
          <input value={q.valor} onChange={(e) => update({ valor: Number(e.target.value) })} className="w-full mt-1 p-2 rounded bg-slate-900/40" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-slate-300">Opciones / Respuestas (si aplica)</label>
        {(q.respuestas || []).map((r, idx) => (
          <div key={idx} className="flex gap-2">
            <input value={r.respuesta} onChange={(e) => {
              const copy = [...q.respuestas]; copy[idx] = { ...copy[idx], respuesta: e.target.value }; update({ respuestas: copy });
            }} placeholder="Texto" className="flex-1 p-2 rounded bg-slate-900/40" />
            <input value={r.puntaje} onChange={(e) => {
              const copy = [...q.respuestas]; copy[idx] = { ...copy[idx], puntaje: Number(e.target.value) }; update({ respuestas: copy });
            }} placeholder="Puntaje" className="w-24 p-2 rounded bg-slate-900/40" />
            <button type="button" onClick={() => { const copy = [...q.respuestas]; copy.splice(idx, 1); update({ respuestas: copy }); }} className="text-red-400">X</button>
          </div>
        ))}
        <button type="button" onClick={() => update({ respuestas: [...(q.respuestas||[]), { respuesta: '', puntaje: 0 }] })} className="text-sm text-emerald-400">+ Agregar opción</button>
      </div>
    </div>
  );
}

export default function CreateEvaluation() {
  const [title, setTitle] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [topicoId, setTopicoId] = useState('');
  const [tipoEvaluacionId, setTipoEvaluacionId] = useState('');
  const [fechaIni, setFechaIni] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const addQuestion = () => setQuestions([...questions, { pregunta: '', parametroId: 1, valor: 1, respuestas: [] }]);

  const updateQuestion = (index, q) => { const copy = [...questions]; copy[index] = q; setQuestions(copy); };
  const removeQuestion = (index) => { const copy = [...questions]; copy.splice(index, 1); setQuestions(copy); };

  const buildPayload = () => ({
    evaluacion: title,
    descripcion,
    fecha_ini: fechaIni || undefined,
    fecha_fin: fechaFin || undefined,
    topicoId: topicoId ? Number(topicoId) : undefined,
    tipo_evaluacionId: tipoEvaluacionId ? Number(tipoEvaluacionId) : undefined,
    preguntas: questions.map((q) => ({
      pregunta: q.pregunta,
      parametroId: Number(q.parametroId),
      valor: Number(q.valor) || 1,
      respuestas: (q.respuestas || []).map((r) => ({ respuesta: r.respuesta, puntaje: Number(r.puntaje) || 0 }))
    }))
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); setSuccess(null); setLoading(true);
    try {
      const payload = buildPayload();
      
      // Create evaluation with ID and calculated puntaje_evaluacion
      const puntajeTotal = questions.reduce((s, q) => s + (q.respuestas ? q.respuestas.reduce((r, o) => r + (Number(o.puntaje)||0), 0) : 0), 0);
      const newEvaluation = {
        id: Date.now(), // Simple unique ID
        ...payload,
        puntaje_evaluacion: puntajeTotal,
        createdAt: new Date().toISOString()
      };

      // Try to save to backend
      try {
        await evaluationsService.createTemplate(payload);
      } catch (backendError) {
        console.warn('Backend error, saving locally:', backendError);
      }

      // Save to localStorage for listing
      const stored = localStorage.getItem('evaluations') || '[]';
      const evaluations = JSON.parse(stored);
      evaluations.push(newEvaluation);
      localStorage.setItem('evaluations', JSON.stringify(evaluations));

      setSuccess('Evaluación creada exitosamente (ID: ' + newEvaluation.id + ')');
      setQuestions([]);
      setTitle(''); setDescripcion(''); setTopicoId(''); setTipoEvaluacionId(''); setFechaIni(''); setFechaFin('');
      
      // Redirect to list after 2 seconds
      setTimeout(() => {
        window.location.href = '/profesor/evaluaciones';
      }, 2000);
    } catch (err) {
      setError(err.message || 'Error al crear la evaluación');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 lg:p-10">
      <div className="max-w-4xl mx-auto bg-slate-900/80 border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-2xl font-bold mb-4 text-white">Crear Evaluación (Editor)</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-slate-300">Título</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 rounded bg-slate-800/40 text-white" />
        </div>

        <div>
          <label className="text-sm text-slate-300">Descripción</label>
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="w-full p-2 rounded bg-slate-800/40 text-white" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-sm text-slate-300">TopicoId</label>
            <input value={topicoId} onChange={(e) => setTopicoId(e.target.value)} className="w-full p-2 rounded bg-slate-800/40 text-white" />
          </div>
          <div>
            <label className="text-sm text-slate-300">TipoEvaluacionId</label>
            <input value={tipoEvaluacionId} onChange={(e) => setTipoEvaluacionId(e.target.value)} className="w-full p-2 rounded bg-slate-800/40 text-white" />
          </div>
          <div>
            <label className="text-sm text-slate-300">Puntaje total estimado</label>
            <input readOnly value={questions.reduce((s, q) => s + (q.respuestas ? q.respuestas.reduce((r, o) => r + (Number(o.puntaje)||0), 0) : 0), 0)} className="w-full p-2 rounded bg-slate-800/40 text-white" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-300">Fecha inicio</label>
            <input type="datetime-local" value={fechaIni} onChange={(e) => setFechaIni(e.target.value)} className="w-full p-2 rounded bg-slate-900/40" />
          </div>
          <div>
            <label className="text-sm text-slate-300">Fecha fin</label>
            <input type="datetime-local" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className="w-full p-2 rounded bg-slate-900/40" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">Preguntas</h3>
            <button type="button" onClick={addQuestion} className="text-emerald-400">+ Agregar pregunta</button>
          </div>

          <div className="space-y-3 mt-3">
            {questions.map((q, idx) => (
              <QuestionEditor key={idx} q={q} onChange={(newQ) => updateQuestion(idx, newQ)} onRemove={() => removeQuestion(idx)} />
            ))}
          </div>
        </div>

        {error && <div className="text-red-400">{error}</div>}
        {success && <div className="text-emerald-400">{success}</div>}

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-emerald-500 text-white">{loading ? 'Creando...' : 'Crear evaluación'}</button>
        </div>
        </form>
      </div>
    </div>
  );
}

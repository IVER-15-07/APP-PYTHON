import React, { useState, useEffect } from 'react';
import { AlertCircle, Save, Send, Plus, Edit2, Eye, X, Calendar, BookOpen, FileText } from 'lucide-react';
import PropTypes from 'prop-types';
import DatePicker, { registerLocale } from 'react-datepicker';
import { es } from 'date-fns/locale/es';
import useEvaluationForm from '../hooks/useEvaluationForm';

registerLocale('es', es);
import QuestionBuilder from './QuestionBuilder';
import evaluationsService from '../../../../services/evaluations.api.js';
import { coursesService } from '../../../../services/courses.api';
import { topicsService } from '../../../../services/topic.api';
import 'react-datepicker/dist/react-datepicker.css';
import './datepicker-evaluation.css';

const EvaluationEditor = ({ courses: initialCourses = [], topics: initialTopics = [], parameterTypes: initialParameterTypes = [], onSuccess, onCancel, evaluationId = null }) => {
  const [saveMode, setSaveMode] = useState('draft'); // 'draft' o 'publish'
  const [showPreview, setShowPreview] = useState(false);
  const [parameterTypes, setParameterTypes] = useState(initialParameterTypes || []);
  const [courses, setCourses] = useState(initialCourses || []);
  const [topics, setTopics] = useState(initialTopics || []);

  const {
    form,
    loading,
    error,
    isEditMode,
    handleChange,
    addQuestion,
    updateQuestion,
    removeQuestion,
    reorderQuestions,
    addOption,
    updateOption,
    removeOption,
    submitForm
  } = useEvaluationForm(onSuccess, parameterTypes);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        if (!parameterTypes || parameterTypes.length === 0) {
          const pts = await evaluationsService.getParameterTypes();
          setParameterTypes(pts || []);
        }
      } catch {
        // ignore
      }

      try {
        if (!courses || courses.length === 0) {
          const cs = await coursesService.getCourses();
          setCourses(cs || []);
        }
      } catch {
        // ignore
      }

      try {
        if (!topics || topics.length === 0) {
          const ts = await topicsService.getAllTopics();
          setTopics(ts || []);
        }
      } catch {
        // ignore
      }
    };

    fetchMeta();

    if (evaluationId) {
      // TODO: fetch y loadForEdit
    }
  }, [evaluationId, courses, topics, parameterTypes]);

  const handleSave = async (mode) => {
    setSaveMode(mode);
    const success = await submitForm(mode === 'publish');
    if (success) {
      // Toast de éxito
    }
  };

  const selectedCourse = Array.isArray(courses) ? courses.find(c => c.id === parseInt(form.cursoId)) : null;
  const selectedTopics = Array.isArray(topics) ? topics.filter(t => t.id === parseInt(form.topicoId)) : [];

  return (
    <div className="text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {isEditMode ? (
              <>
                <Edit2 className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">Editar evaluación</h2>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 text-green-400" />
                <h2 className="text-xl font-semibold text-white">Crear nueva evaluación</h2>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30 transition-all duration-200"
            >
              <Eye className="w-4 h-4" /> {showPreview ? 'Ocultar' : 'Vista previa'}
            </button>
            {onCancel && (
              <button
                onClick={onCancel}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-700 transition-colors text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main form */}
          <div className="lg:col-span-2">
            {showPreview ? (
              <div className="bg-gray-800 rounded-lg p-6 space-y-6">
                <h2 className="text-2xl font-semibold">Vista previa de la evaluación</h2>
                <div className="mt-4">
                  <h3 className="text-lg font-medium">{form.evaluacion || 'Sin título'}</h3>
                  <p className="text-sm text-gray-400 mt-2">{form.descripcion || 'Sin descripción'}</p>
                  <div className="mt-3 text-sm text-gray-400">
                    <div><strong>Curso:</strong> {selectedCourse ? selectedCourse.nombre : '—'}</div>
                    <div><strong>Tópico:</strong> {selectedTopics.length ? selectedTopics.map(t=>t.nombre).join(', ') : '—'}</div>
                    <div><strong>Fecha inicio:</strong> {form.fecha_ini ? new Date(form.fecha_ini).toLocaleString() : '—'}</div>
                    <div><strong>Fecha fin:</strong> {form.fecha_fin ? new Date(form.fecha_fin).toLocaleString() : '—'}</div>
                    <div><strong>Puntaje total:</strong> {form.puntaje_evaluacion}</div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {form.preguntas.length === 0 && (
                    <p className="text-sm text-gray-400">No hay preguntas añadidas.</p>
                  )}

                  {form.preguntas.map((q, idx) => (
                    <div key={idx} className="bg-gray-900 border border-gray-700 rounded p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{idx + 1}. {q.pregunta || 'Pregunta sin texto'}</div>
                          <div className="text-xs text-gray-400">Tipo: {parameterTypes.find(p => p.id === q.parametroId)?.nombre || q.parametroId}</div>
                        </div>
                        <div className="text-sm text-green-300">{q.valor} pts</div>
                      </div>

                      {q.respuestas && q.respuestas.length > 0 && (
                        <ul className="mt-3 space-y-2">
                          {q.respuestas.map((opt, oi) => (
                            <li key={oi} className="flex items-center gap-3 text-sm">
                              <span className={"inline-block w-3 h-3 rounded-full " + (opt.esCorrecta ? 'bg-green-400' : 'bg-gray-600')} />
                              <span className="flex-1 text-gray-200">{opt.respuesta || '(vacía)'}</span>
                              <span className="text-xs text-gray-400">{opt.puntaje} pts</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex gap-3">
                  <button onClick={() => setShowPreview(false)} className="px-4 py-2 bg-gray-700 rounded text-white">Cerrar vista previa</button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Título de la evaluación *
                </label>
                <input
                  type="text"
                  name="evaluacion"
                  value={form.evaluacion}
                  onChange={handleChange}
                  placeholder="Ej: Evaluación de Python - Unidad 1"
                  maxLength={255}
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white placeholder-slate-500 border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
                />
                <p className="text-xs text-slate-500 mt-1.5">{form.evaluacion.length}/255 caracteres</p>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  placeholder="Instrucciones y contexto para los estudiantes..."
                  rows={3}
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white placeholder-slate-500 border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all resize-none"
                />
              </div>

              {/* Curso y Tópico */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Curso *
                  </label>
                  <div className="relative">
                    <select
                      name="cursoId"
                      value={form.cursoId}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all appearance-none"
                    >
                      <option value="">Selecciona un curso</option>
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                      ))}
                    </select>
                    <BookOpen className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Tópico (opcional)
                  </label>
                  <div className="relative">
                    <select
                      name="topicoId"
                      value={form.topicoId}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all appearance-none"
                    >
                      <option value="">Todos los tópicos</option>
                      {topics.map(t => (
                        <option key={t.id} value={t.id}>{t.nombre}</option>
                      ))}
                    </select>
                    <FileText className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Fechas con DatePicker */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="evaluation-calendar">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Fecha de inicio
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={form.fecha_ini ? new Date(form.fecha_ini) : null}
                      onChange={(date) => handleChange({ 
                        target: { 
                          name: 'fecha_ini', 
                          value: date ? date.toISOString() : '' 
                        } 
                      })}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      timeCaption="Hora"
                      dateFormat="dd/MM/yyyy HH:mm"
                      placeholderText="Selecciona fecha y hora"
                      minDate={new Date()}
                      disabled={loading}
                      locale="es"
                      className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white placeholder-slate-500 border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
                      popperPlacement="bottom-start"
                      popperModifiers={[
                        {
                          name: 'offset',
                          options: {
                            offset: [0, 8],
                          },
                        },
                        {
                          name: 'preventOverflow',
                          options: {
                            rootBoundary: 'viewport',
                            tether: false,
                            altAxis: true,
                          },
                        },
                      ]}
                    />
                    <Calendar className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="evaluation-calendar">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Fecha de finalización
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={form.fecha_fin ? new Date(form.fecha_fin) : null}
                      onChange={(date) => handleChange({ 
                        target: { 
                          name: 'fecha_fin', 
                          value: date ? date.toISOString() : '' 
                        } 
                      })}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      timeCaption="Hora"
                      dateFormat="dd/MM/yyyy HH:mm"
                      placeholderText="Selecciona fecha y hora"
                      minDate={form.fecha_ini ? new Date(form.fecha_ini) : new Date()}
                      disabled={loading}
                      locale="es"
                      className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white placeholder-slate-500 border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
                      popperPlacement="bottom-start"
                      popperModifiers={[
                        {
                          name: 'offset',
                          options: {
                            offset: [0, 8],
                          },
                        },
                        {
                          name: 'preventOverflow',
                          options: {
                            rootBoundary: 'viewport',
                            tether: false,
                            altAxis: true,
                          },
                        },
                      ]}
                    />
                    <Calendar className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Puntaje total */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Puntuación total *
                </label>
                <input
                  type="number"
                  name="puntaje_evaluacion"
                  value={form.puntaje_evaluacion}
                  onChange={handleChange}
                  min={1}
                  placeholder="100"
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white placeholder-slate-500 border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
                />
              </div>

              {/* Preguntas */}
              <div className="border-t border-gray-700 pt-6">
                <QuestionBuilder
                  questions={form.preguntas}
                  onAddQuestion={addQuestion}
                  onUpdateQuestion={updateQuestion}
                  onRemoveQuestion={removeQuestion}
                  onReorderQuestion={reorderQuestions}
                  onAddOption={addOption}
                  onUpdateOption={updateOption}
                  onRemoveOption={removeOption}
                  parameterTypes={parameterTypes}
                />
              </div>
            </div>
            )}

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 sticky top-6 space-y-6">
              <h3 className="text-lg font-semibold text-white">Resumen</h3>
              
              <div className="space-y-4">
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4">
                  <div className="text-sm text-slate-400 mb-1">Preguntas</div>
                  <div className="text-2xl font-bold text-blue-400">{form.preguntas.length}</div>
                </div>

                <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4">
                  <div className="text-sm text-slate-400 mb-1">Puntaje total</div>
                  <div className="text-2xl font-bold text-green-400">{form.puntaje_evaluacion} pts</div>
                </div>
              </div>

              <div className="border-t border-slate-700/50 pt-6 space-y-3">
                <button
                  onClick={() => handleSave('draft')}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-700/50 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl border border-slate-600/50 hover:border-slate-500 transition-all duration-200"
                >
                  <Save className="w-4 h-4" />
                  {loading && saveMode === 'draft' ? 'Guardando...' : 'Guardar borrador'}
                </button>
                <button
                  onClick={() => handleSave('publish')}
                  disabled={loading || form.preguntas.length === 0}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500/10 hover:bg-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-green-400 rounded-xl border border-green-500/30 hover:border-green-500/50 transition-all duration-200 font-medium"
                >
                  <Send className="w-4 h-4" />
                  {loading && saveMode === 'publish' ? 'Publicando...' : 'Publicar evaluación'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

EvaluationEditor.propTypes = {
  courses: PropTypes.array,
  topics: PropTypes.array,
  parameterTypes: PropTypes.array,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
  evaluationId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default EvaluationEditor;

import React, { useState, useEffect } from 'react';
import { AlertCircle, Save, Send, Plus, Edit2, Eye } from 'lucide-react';
import PropTypes from 'prop-types';
import useEvaluationForm from '../hooks/useEvaluationForm';
import QuestionBuilder from './QuestionBuilder';

const EvaluationEditor = ({ courses = [], topics = [], parameterTypes = [], onSuccess, evaluationId = null }) => {
  const {
    form,
    loading,
    error,
    isEditMode,
    handleChange,
    handleCheckboxChange,
    addQuestion,
    updateQuestion,
    removeQuestion,
    reorderQuestions,
    addOption,
    updateOption,
    removeOption,
    loadForEdit,
    submitForm
  } = useEvaluationForm(onSuccess);

  const [saveMode, setSaveMode] = useState('draft'); // 'draft' o 'publish'
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (evaluationId && parameterTypes.length > 0) {
      // Cargar evaluación existente
      // TODO: fetch y loadForEdit
    }
  }, [evaluationId]);

  const handleSave = async (mode) => {
    setSaveMode(mode);
    const success = await submitForm(mode === 'publish');
    if (success) {
      // Toast de éxito
      console.log(`Guardado como ${mode}`);
    }
  };

  const selectedCourse = courses.find(c => c.id === parseInt(form.cursoId));
  const selectedTopics = topics.filter(t => t.id === parseInt(form.topicoId));

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">
            {isEditMode ? 'Editar Evaluación' : 'Crear Nueva Evaluación'}
          </h1>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            <Eye className="w-4 h-4" /> Preview
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6 space-y-6">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  name="evaluacion"
                  value={form.evaluacion}
                  onChange={handleChange}
                  placeholder="Ej: Evaluación de Python - Unidad 1"
                  maxLength={255}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">{form.evaluacion.length}/255</p>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  placeholder="Instrucciones y contexto para los estudiantes"
                  rows={3}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Curso */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Curso *
                </label>
                <select
                  name="cursoId"
                  value={form.cursoId}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Selecciona un curso</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>

              {/* Tópico */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tópico
                </label>
                <select
                  name="topicoId"
                  value={form.topicoId}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Todos los tópicos</option>
                  {topics.map(t => (
                    <option key={t.id} value={t.id}>{t.nombre}</option>
                  ))}
                </select>
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fecha de inicio
                  </label>
                  <input
                    type="datetime-local"
                    name="fecha_ini"
                    value={form.fecha_ini}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fecha de fin
                  </label>
                  <input
                    type="datetime-local"
                    name="fecha_fin"
                    value={form.fecha_fin}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Puntaje total */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Puntuación total
                </label>
                <input
                  type="number"
                  name="puntaje_evaluacion"
                  value={form.puntaje_evaluacion}
                  onChange={handleChange}
                  min={1}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
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
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 sticky top-6 space-y-4">
              <h3 className="text-lg font-semibold">Estado</h3>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-400">
                  <strong>{form.preguntas.length}</strong> preguntas
                </p>
                <p className="text-sm text-gray-400">
                  <strong>{form.puntaje_evaluacion}</strong> puntos totales
                </p>
              </div>

              <div className="border-t border-gray-700 pt-4 space-y-3">
                <button
                  onClick={() => handleSave('draft')}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 px-4 py-2 rounded-lg text-white transition"
                >
                  <Save className="w-4 h-4" />
                  {loading && saveMode === 'draft' ? 'Guardando...' : 'Guardar borrador'}
                </button>
                <button
                  onClick={() => handleSave('publish')}
                  disabled={loading || form.preguntas.length === 0}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 px-4 py-2 rounded-lg text-white transition"
                >
                  <Send className="w-4 h-4" />
                  {loading && saveMode === 'publish' ? 'Publicando...' : 'Publicar'}
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
  evaluationId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default EvaluationEditor;

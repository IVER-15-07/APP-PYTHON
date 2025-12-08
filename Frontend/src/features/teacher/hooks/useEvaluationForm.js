import { useState, useCallback } from 'react';
import evaluationsService from '../../../../services/evaluations.api.js';

export const useEvaluationForm = (onSuccess) => {
  const [form, setForm] = useState({
    evaluacion: '',
    descripcion: '',
    topicoId: '',
    cursoId: '',
    puntaje_evaluacion: 100,
    fecha_ini: '',
    fecha_fin: '',
    preguntas: [],
    published: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const validateForm = useCallback(() => {
    const errors = [];

    if (!form.evaluacion?.trim()) {
      errors.push('El título es requerido');
    } else if (form.evaluacion.length < 3 || form.evaluacion.length > 255) {
      errors.push('El título debe tener entre 3 y 255 caracteres');
    }

    if (!form.cursoId) {
      errors.push('Selecciona un curso');
    }

    if (form.preguntas.length === 0) {
      errors.push('Agrega al menos una pregunta');
    }

    // Validar cada pregunta
    form.preguntas.forEach((q, idx) => {
      if (!q.pregunta?.trim()) {
        errors.push(`Pregunta ${idx + 1}: texto requerido`);
      }

      if (!q.parametroId) {
        errors.push(`Pregunta ${idx + 1}: tipo requerido`);
      }

      if (!q.valor || q.valor <= 0) {
        errors.push(`Pregunta ${idx + 1}: valor debe ser > 0`);
      }

      // Validar que single/multiple tengan opciones
      if ((q.parametroId === 1 || q.parametroId === 4) && (!q.respuestas || q.respuestas.length === 0)) {
        errors.push(`Pregunta ${idx + 1}: agrega opciones`);
      }

      // Validar que haya al menos una respuesta correcta
      if ((q.parametroId === 1 || q.parametroId === 4)) {
        const hasCorrect = q.respuestas?.some(r => r.esCorrecta);
        if (!hasCorrect) {
          errors.push(`Pregunta ${idx + 1}: marca al menos una opción correcta`);
        }
      }
    });

    return errors;
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: checked }));
    if (error) setError('');
  };

  const addQuestion = () => {
    setForm(prev => ({
      ...prev,
      preguntas: [
        ...prev.preguntas,
        {
          pregunta: '',
          parametroId: 1,
          valor: 1,
          respuestas: [],
          evaluacionManual: false
        }
      ]
    }));
  };

  const updateQuestion = (index, updates) => {
    setForm(prev => ({
      ...prev,
      preguntas: prev.preguntas.map((q, i) => {
        if (i !== index) return q;
        const merged = { ...q, ...updates };

        // Si el tipo cambió a Verdadero/Falso y no hay opciones, crear por defecto
        if (updates.parametroId === 2 && (!merged.respuestas || merged.respuestas.length === 0)) {
          merged.respuestas = [
            { respuesta: 'Verdadero', puntaje: merged.valor || 1, esCorrecta: false },
            { respuesta: 'Falso', puntaje: 0, esCorrecta: false }
          ];
        }

        // Si el tipo cambió a single/multiple y no hay opciones, iniciar con dos opciones vacías
        if ((updates.parametroId === 1 || updates.parametroId === 4) && (!merged.respuestas || merged.respuestas.length === 0)) {
          merged.respuestas = [
            { respuesta: '', puntaje: 1, esCorrecta: false },
            { respuesta: '', puntaje: 1, esCorrecta: false }
          ];
        }

        return merged;
      })
    }));
  };

  const removeQuestion = (index) => {
    setForm(prev => ({
      ...prev,
      preguntas: prev.preguntas.filter((_, i) => i !== index)
    }));
  };

  const reorderQuestions = (startIndex, endIndex) => {
    const result = Array.from(form.preguntas);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setForm(prev => ({ ...prev, preguntas: result }));
  };

  const addOption = (questionIndex) => {
    setForm(prev => ({
      ...prev,
      preguntas: prev.preguntas.map((q, i) =>
        i === questionIndex
          ? {
              ...q,
              respuestas: [
                ...q.respuestas,
                { respuesta: '', puntaje: 1, esCorrecta: false }
              ]
            }
          : q
      )
    }));
  };

  const updateOption = (questionIndex, optionIndex, updates) => {
    setForm(prev => ({
      ...prev,
      preguntas: prev.preguntas.map((q, i) =>
        i === questionIndex
          ? {
              ...q,
              respuestas: q.respuestas.map((opt, oi) =>
                oi === optionIndex ? { ...opt, ...updates } : opt
              )
            }
          : q
      )
    }));
  };

  const removeOption = (questionIndex, optionIndex) => {
    setForm(prev => ({
      ...prev,
      preguntas: prev.preguntas.map((q, i) =>
        i === questionIndex
          ? {
              ...q,
              respuestas: q.respuestas.filter((_, oi) => oi !== optionIndex)
            }
          : q
      )
    }));
  };

  const resetForm = () => {
    setForm({
      evaluacion: '',
      descripcion: '',
      topicoId: '',
      cursoId: '',
      puntaje_evaluacion: 100,
      fecha_ini: '',
      fecha_fin: '',
      preguntas: [],
      published: false
    });
    setIsEditMode(false);
    setEditingId(null);
    setError('');
  };

  const loadForEdit = (evaluation) => {
    setForm({
      evaluacion: evaluation.evaluacion || '',
      descripcion: evaluation.descripcion || '',
      topicoId: evaluation.topicoId?.toString() || '',
      cursoId: evaluation.cursoId?.toString() || '',
      puntaje_evaluacion: evaluation.puntaje_evaluacion || 100,
      fecha_ini: evaluation.fecha_ini || '',
      fecha_fin: evaluation.fecha_fin || '',
      preguntas: evaluation.preguntas || [],
      published: evaluation.published || false
    });
    setIsEditMode(true);
    setEditingId(evaluation.id);
  };

  const submitForm = async (publish = false) => {
    setLoading(true);
    setError('');

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors[0]);
      setLoading(false);
      return false;
    }

    try {
      const payload = {
        evaluacion: form.evaluacion,
        descripcion: form.descripcion,
        topicoId: parseInt(form.topicoId),
        cursoId: parseInt(form.cursoId),
        puntaje_evaluacion: parseInt(form.puntaje_evaluacion),
        fecha_ini: (() => {
          if (!form.fecha_ini) return null;
          const d = new Date(form.fecha_ini);
          return Number.isNaN(d.getTime()) ? null : d.toISOString();
        })(),
        fecha_fin: (() => {
          if (!form.fecha_fin) return null;
          const d = new Date(form.fecha_fin);
          return Number.isNaN(d.getTime()) ? null : d.toISOString();
        })(),
        published: publish,
        preguntas: form.preguntas.map(q => ({
          pregunta: q.pregunta,
          parametroId: q.parametroId,
          valor: q.valor,
          respuestas: q.respuestas.map(r => ({
            respuesta: r.respuesta,
            puntaje: r.esCorrecta ? r.puntaje : 0
          }))
        }))
      };

      if (isEditMode && editingId) {
        await evaluationsService.updateTemplate(editingId, payload);
      } else {
        await evaluationsService.createTemplate(payload);
      }

      resetForm();
      if (onSuccess) await onSuccess();
      return true;
    } catch (err) {
      setError(err.message || 'Error al guardar');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    error,
    isEditMode,
    editingId,
    validateForm,
    handleChange,
    handleCheckboxChange,
    addQuestion,
    updateQuestion,
    removeQuestion,
    reorderQuestions,
    addOption,
    updateOption,
    removeOption,
    resetForm,
    loadForEdit,
    submitForm
  };
};

export default useEvaluationForm;

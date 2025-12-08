import React from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, AlertCircle } from 'lucide-react';
import PropTypes from 'prop-types';

const QuestionBuilder = ({
  questions,
  onAddQuestion,
  onUpdateQuestion,
  onRemoveQuestion,
  onReorderQuestion,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
  parameterTypes = []
}) => {
  const getTypeName = (typeId) => {
    const type = parameterTypes.find(t => t.id === typeId);
    return type?.nombre || 'Desconocido';
  };

  const questionTypeNames = {
    1: 'single',
    2: 'vf',
    3: 'open',
    4: 'multiple',
    5: 'numeric'
  };

  const renderQuestionPreview = (question, index) => {
    return (
      <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <div className="mb-3">
              <label className="text-sm text-gray-300 block mb-1">Pregunta</label>
              <textarea
                value={question.pregunta}
                onChange={(e) => onUpdateQuestion(index, { pregunta: e.target.value })}
                placeholder={`Texto de la pregunta ${index + 1}`}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white resize-none"
                rows={2}
              />
            </div>

            <div className="flex gap-3 items-center mb-3">
              <div className="flex-1">
                <label className="text-xs text-gray-400">Tipo</label>
                <select
                  value={question.parametroId}
                  onChange={(e) => onUpdateQuestion(index, { parametroId: parseInt(e.target.value) })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                >
                  {parameterTypes.map(t => (
                    <option key={t.id} value={t.id}>{t.nombre}</option>
                  ))}
                </select>
              </div>

              <div style={{width:120}}>
                <label className="text-xs text-gray-400">Puntos</label>
                <input
                  type="number"
                  min={1}
                  value={question.valor}
                  onChange={(e) => onUpdateQuestion(index, { valor: parseInt(e.target.value || 0) })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-1 text-xs">
              <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                {getTypeName(question.parametroId)}
              </span>
              <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded">
                {question.valor} pts
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onReorderQuestion(index, index - 1)}
              disabled={index === 0}
              className="p-2 hover:bg-gray-700 rounded disabled:opacity-50"
              title="Mover arriba"
            >
              <ChevronUp className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={() => onReorderQuestion(index, index + 1)}
              disabled={index === questions.length - 1}
              className="p-2 hover:bg-gray-700 rounded disabled:opacity-50"
              title="Mover abajo"
            >
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={() => onRemoveQuestion(index)}
              className="p-2 hover:bg-red-500/20 rounded text-red-400"
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Question options editor */}
        {(question.parametroId === 1 || question.parametroId === 4) && (
          <div className="mt-3 space-y-2">
            <p className="text-xs text-gray-400 mb-1">Opciones:</p>
            <div className="space-y-2">
              {question.respuestas?.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2 text-sm">
                  <input
                    type={question.parametroId === 4 ? 'checkbox' : 'radio'}
                    checked={opt.esCorrecta || false}
                    onChange={(e) => {
                      if (question.parametroId === 1) {
                        const updated = question.respuestas.map((o, i) => ({
                          ...o,
                          esCorrecta: i === oi && e.target.checked
                        }));
                        onUpdateQuestion(index, { respuestas: updated });
                      } else {
                        onUpdateOption(index, oi, { esCorrecta: e.target.checked });
                      }
                    }}
                    className="w-4 h-4"
                  />

                  <input
                    value={opt.respuesta}
                    onChange={(e) => onUpdateOption(index, oi, { respuesta: e.target.value })}
                    placeholder={`Opción ${oi + 1}`}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  />

                  <input
                    type="number"
                    min={0}
                    value={opt.puntaje}
                    onChange={(e) => onUpdateOption(index, oi, { puntaje: parseInt(e.target.value || 0) })}
                    className="w-20 bg-gray-700 border border-gray-600 rounded px-2 py-2 text-white"
                    title="Puntos si la opción es correcta"
                  />

                  <button
                    onClick={() => onRemoveOption(index, oi)}
                    className="p-1 hover:bg-red-500/20 rounded text-red-400"
                    title="Eliminar opción"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <div>
              <button
                onClick={() => onAddOption(index)}
                className="text-xs text-blue-400 hover:text-blue-300 mt-2 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Agregar opción
              </button>
            </div>
          </div>
        )}

        {/* VF: if no options, provide default True/False */}
        {question.parametroId === 2 && (
          <div className="mt-3">
            <p className="text-xs text-gray-400 mb-1">Verdadero / Falso</p>
            <div className="flex gap-2">
              {(!question.respuestas || question.respuestas.length === 0) && (
                <div className="text-sm text-gray-400">No hay opciones. Se crearán Verdadero/Falso al guardar.</div>
              )}
              {question.respuestas?.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded">
                  <input
                    type="radio"
                    name={`vf-${index}`}
                    checked={opt.esCorrecta}
                    onChange={() => {
                      const updated = question.respuestas.map((o, i) => ({ ...o, esCorrecta: i === oi }));
                      onUpdateQuestion(index, { respuestas: updated });
                    }}
                  />
                  <span className="text-white">{opt.respuesta}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Numeric / Open: simple expected answer field */}
        {(question.parametroId === 3 || question.parametroId === 5) && (
          <div className="mt-3 space-y-2">
            <label className="text-xs text-gray-400">Respuesta esperada (opcional)</label>
            <input
              value={question.respuestas?.[0]?.respuesta || ''}
              onChange={(e) => {
                const txt = e.target.value;
                if (!question.respuestas || question.respuestas.length === 0) {
                  onUpdateQuestion(index, { respuestas: [{ respuesta: txt, puntaje: question.valor || 0, esCorrecta: true }] });
                } else {
                  onUpdateOption(index, 0, { respuesta: txt });
                }
              }}
              placeholder="Texto o valor esperado"
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Preguntas ({questions.length})</h3>
        <button
          onClick={onAddQuestion}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm"
        >
          <Plus className="w-4 h-4" /> Agregar pregunta
        </button>
      </div>

      {questions.length === 0 ? (
        <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-yellow-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>Agrega al menos una pregunta</span>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q, idx) => renderQuestionPreview(q, idx))}
        </div>
      )}
    </div>
  );
};

QuestionBuilder.propTypes = {
  questions: PropTypes.array.isRequired,
  onAddQuestion: PropTypes.func.isRequired,
  onUpdateQuestion: PropTypes.func.isRequired,
  onRemoveQuestion: PropTypes.func.isRequired,
  onReorderQuestion: PropTypes.func.isRequired,
  onAddOption: PropTypes.func.isRequired,
  onUpdateOption: PropTypes.func.isRequired,
  onRemoveOption: PropTypes.func.isRequired,
  parameterTypes: PropTypes.array
};

export default QuestionBuilder;

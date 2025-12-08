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
            <p className="text-white font-medium">
              P{index + 1}. {question.pregunta || '(Sin texto)'}
            </p>
            <div className="flex gap-2 mt-2 text-xs">
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

        {/* Question options */}
        {(question.parametroId === 1 || question.parametroId === 4) && question.respuestas?.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-xs text-gray-400">Opciones:</p>
            <div className="space-y-1">
              {question.respuestas.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2 text-sm">
                  <input
                    type={question.parametroId === 4 ? 'checkbox' : 'radio'}
                    checked={opt.esCorrecta || false}
                    onChange={(e) => {
                      if (question.parametroId === 1) {
                        // Single: deseleccionar otras
                        const updated = question.respuestas.map((o, i) => ({
                          ...o,
                          esCorrecta: i === oi && e.target.checked
                        }));
                        onUpdateQuestion(index, { respuestas: updated });
                      } else {
                        // Multiple: permitir múltiples
                        onUpdateOption(index, oi, { esCorrecta: e.target.checked });
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-300 flex-1">{opt.respuesta || '(vacío)'}</span>
                  <button
                    onClick={() => onRemoveOption(index, oi)}
                    className="p-1 hover:bg-red-500/20 rounded text-red-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => onAddOption(index)}
              className="text-xs text-blue-400 hover:text-blue-300 mt-2 flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Opción
            </button>
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

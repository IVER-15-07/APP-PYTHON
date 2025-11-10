import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

export const LevelList = ({ niveles, grupo, onFetchTopics }) => {
  const [expanded, setExpanded] = useState({});
  const [topicsByLevel, setTopicsByLevel] = useState({});
  const [loadingTopics, setLoadingTopics] = useState({});
  const navigate = useNavigate();

  const toggleLevel = async (nivelId) => {
    const isExpanding = !expanded[nivelId];
    setExpanded((prev) => ({ ...prev, [nivelId]: isExpanding }));

    // Solo cargar tópicos si estamos expandiendo y no los hemos cargado antes
    if (isExpanding && !topicsByLevel[nivelId]) {
      await fetchTopicsForLevel(nivelId);
    }
  };

  const fetchTopicsForLevel = async (nivelId) => {
    setLoadingTopics((prev) => ({ ...prev, [nivelId]: true }));
    try {
      const topics = await onFetchTopics(nivelId);
      setTopicsByLevel((prev) => ({ ...prev, [nivelId]: topics }));
    } catch {
      setTopicsByLevel((prev) => ({ ...prev, [nivelId]: [] }));
    } finally {
      setLoadingTopics((prev) => ({ ...prev, [nivelId]: false }));
    }
  };

  const handleTopicClick = (topicId) => {
    if (grupo) {
      navigate(`/estudiante/cursos/topic/${topicId}`);
    }
  };

  if (niveles.length === 0) return null;

  // Si no tiene grupo, mostrar mensaje motivador en lugar de niveles bloqueados
  if (!grupo) {
    return (
      <div className="mt-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 p-6 rounded-xl shadow-lg">
        <div className="flex items-start gap-4">
          <div className="text-amber-400 text-4xl">🔒</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">
              Únete a un grupo para acceder al contenido
            </h3>
            <p className="text-slate-300 text-sm mb-3">
              Para poder visualizar los tópicos y niveles del curso, necesitas unirte a un grupo usando el código proporcionado por tu profesor.
            </p>
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-3">
              <p className="text-slate-400 text-xs mb-2">
                💡 <span className="font-semibold">¿Qué obtendrás al unirte?</span>
              </p>
              <ul className="text-slate-400 text-xs space-y-1 ml-4">
                <li>✓ Acceso a {niveles.length} {niveles.length === 1 ? 'nivel' : 'niveles'} de aprendizaje</li>
                <li>✓ Contenido educativo completo</li>
                <li>✓ Seguimiento de tu progreso</li>
                <li>✓ Ejercicios y evaluaciones</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 p-5 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">
        Niveles del curso
      </h2>
      <ul className="space-y-3">
        {niveles.map((nivel) => (
          <LevelItem
            key={nivel.id}
            nivel={nivel}
            isExpanded={expanded[nivel.id]}
            topics={topicsByLevel[nivel.id]}
            isLoadingTopics={loadingTopics[nivel.id]}
            hasGroup={!!grupo}
            onToggle={() => toggleLevel(nivel.id)}
            onTopicClick={handleTopicClick}
          />
        ))}
      </ul>
    </div>
  );
};

const LevelItem = ({ nivel, isExpanded, topics, isLoadingTopics, hasGroup, onToggle, onTopicClick }) => (
  <li className="rounded-xl border border-slate-700/50 overflow-hidden bg-slate-800/50 backdrop-blur-sm shadow-md hover:shadow-lg hover:border-emerald-500/30 transition-all">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-4 py-3 text-slate-200 hover:bg-slate-700/30 transition-colors"
    >
      <span className="font-semibold">{nivel.nombre}</span>
      <span className="text-emerald-400 text-sm font-bold">
        {isExpanded ? "▲" : "▼"}
      </span>
    </button>
    {isExpanded && (
      <div className="bg-slate-900/60 border-t border-slate-700/50">
        {isLoadingTopics ? (
          <div className="p-4 text-slate-400 text-sm flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
            Cargando tópicos…
          </div>
        ) : !topics || topics.length === 0 ? (
          <div className="p-4 text-slate-400 text-sm text-center">No hay tópicos en este nivel.</div>
        ) : (
          <TopicList topics={topics} hasGroup={hasGroup} onTopicClick={onTopicClick} />
        )}
      </div>
    )}
  </li>
);

const TopicList = ({ topics, hasGroup, onTopicClick }) => (
  <ul className="divide-y divide-slate-700/50">
    {topics.map((topic) => (
      <li
        key={topic.id}
        className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors"
      >
        <div className="min-w-0 flex-1">
          <div className="text-white font-medium truncate">{topic.nombre}</div>
          {topic.descripcion && (
            <div className="text-slate-400 text-xs line-clamp-1 mt-1">{topic.descripcion}</div>
          )}
        </div>
        <button
          disabled={!hasGroup}
          onClick={() => onTopicClick(topic.id)}
          className={`ml-4 px-4 py-2 text-white text-sm font-medium rounded-lg shadow-lg transition-all ${
            hasGroup
              ? "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-emerald-500/20"
              : "bg-slate-700 cursor-not-allowed shadow-none"
          }`}
        >
          Ver
        </button>
      </li>
    ))}
  </ul>
);

LevelList.propTypes = {
  niveles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
    })
  ).isRequired,
  grupo: PropTypes.object,
  onFetchTopics: PropTypes.func.isRequired,
};

LevelItem.propTypes = {
  nivel: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nombre: PropTypes.string.isRequired,
  }).isRequired,
  isExpanded: PropTypes.bool,
  topics: PropTypes.array,
  isLoadingTopics: PropTypes.bool,
  hasGroup: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onTopicClick: PropTypes.func.isRequired,
};

TopicList.propTypes = {
  topics: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
      descripcion: PropTypes.string,
    })
  ).isRequired,
  hasGroup: PropTypes.bool.isRequired,
  onTopicClick: PropTypes.func.isRequired,
};

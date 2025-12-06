import PropTypes from 'prop-types';
import { FileText, Video, Presentation, Edit2 } from 'lucide-react';

const TopicCard = ({ topic, onEdit }) => {
  // Determinar icono, color y nombre según tipo
  const getTypeConfig = (type) => {
    switch (type) {
      case 1:
      case '1':
        return {
          icon: FileText,
          name: 'Texto',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/30',
          textColor: 'text-blue-400',
          hoverBorder: 'hover:border-blue-500/50'
        };
      case 2:
      case '2':
        return {
          icon: Video,
          name: 'Video',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30',
          textColor: 'text-red-400',
          hoverBorder: 'hover:border-red-500/50'
        };
      case 3:
      case '3':
        return {
          icon: Presentation,
          name: 'Slide',
          bgColor: 'bg-orange-500/10',
          borderColor: 'border-orange-500/30',
          textColor: 'text-orange-400',
          hoverBorder: 'hover:border-orange-500/50'
        };
      default:
        return {
          icon: FileText,
          name: 'Desconocido',
          bgColor: 'bg-slate-500/10',
          borderColor: 'border-slate-500/30',
          textColor: 'text-slate-400',
          hoverBorder: 'hover:border-slate-500/50'
        };
    }
  };

  const config = getTypeConfig(topic.tipo_topicoId);
  const Icon = config.icon;

  return (
    <div className={`bg-slate-900/80 backdrop-blur-sm border ${config.borderColor} ${config.hoverBorder} rounded-2xl p-5 shadow-2xl transition-all duration-200 hover:shadow-xl group`}>
      {/* Header con ícono y tipo */}
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 ${config.bgColor} rounded-lg border ${config.borderColor} group-hover:scale-105 transition-transform`}>
          <Icon className={`w-5 h-5 ${config.textColor}`} />
        </div>
        <span className={`text-xs ${config.textColor} font-medium px-2.5 py-1 ${config.bgColor} rounded-lg border ${config.borderColor}`}>
          {config.name}
        </span>
      </div>

      {/* Título del tópico */}
      <h3 className="text-base font-bold text-white mb-4 line-clamp-2 min-h-[3rem] group-hover:text-slate-200 transition-colors">
        {topic.nombre}
      </h3>
      
      {/* Botón de acción */}
      <button
        onClick={() => onEdit(topic)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 rounded-xl border border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-200 text-sm font-medium"
      >
        <Edit2 className="w-4 h-4" />
        Editar
      </button>
    </div>
  );
};

TopicCard.propTypes = {
  topic: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    nombre: PropTypes.string.isRequired,
    tipo_topicoId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    aprobado: PropTypes.bool,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default TopicCard;

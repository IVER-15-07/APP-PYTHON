import PropTypes from 'prop-types';
import { FileText, Video, Presentation, Edit2 } from 'lucide-react';

const TopicCard = ({ topic, onEdit }) => {
  // Determinar icono y color según tipo
  const getTypeConfig = (type) => {
    switch (type) {
      case '1':
        return {
          icon: FileText,
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/30',
          textColor: 'text-blue-400',
          hoverBorder: 'hover:border-blue-500/50'
        };
      case '2':
        return {
          icon: Video,
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30',
          textColor: 'text-red-400',
          hoverBorder: 'hover:border-red-500/50'
        };
      case '3':
        return {
          icon: Presentation,
          bgColor: 'bg-orange-500/10',
          borderColor: 'border-orange-500/30',
          textColor: 'text-orange-400',
          hoverBorder: 'hover:border-orange-500/50'
        };
      default:
        return {
          icon: FileText,
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
    <div className={`bg-slate-900/80 backdrop-blur-sm border ${config.borderColor} ${config.hoverBorder} rounded-xl p-4 transition-all duration-200 shadow-lg hover:shadow-xl group`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`${config.bgColor} p-2 rounded-lg border ${config.borderColor}`}>
          <Icon className={`w-4 h-4 ${config.textColor}`} />
        </div>
        <h3 className="text-sm font-semibold text-white truncate flex-1 group-hover:text-green-400 transition-colors">
          {topic.nombre}
        </h3>
      </div>

      <button
        onClick={() => onEdit(topic)}
        className={`w-full flex items-center justify-center gap-2 px-3 py-2 ${config.bgColor} ${config.textColor} rounded-lg border ${config.borderColor} hover:bg-opacity-20 transition-all duration-200 text-sm font-medium`}
      >
        <Edit2 className="w-3.5 h-3.5" />
        Editar
      </button>
    </div>
  );
};

TopicCard.propTypes = {
  topic: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    nombre: PropTypes.string.isRequired,
    tipo_topicoId: PropTypes.oneOf([1, 2, 3]).isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default TopicCard;

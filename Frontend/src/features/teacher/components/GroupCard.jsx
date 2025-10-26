import CopyButton from './CopyButton';
import { Edit2, Trash2 } from 'lucide-react';
import PropTypes from 'prop-types';

const GroupCard = ({ g, copied, onCopy, onEdit, onDelete }) => {
  return (
    <article
      key={g.id}
      className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 hover:border-green-500/30 transition-all duration-200 shadow-xl hover:shadow-2xl group"
    >
      <div className="flex justify-between items-start gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white mb-2 truncate group-hover:text-green-400 transition-colors">{g.title}</h3>
          <p className="text-slate-400 text-sm line-clamp-2">{g.description}</p>
        </div>
        <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-medium rounded-full border border-slate-700/50 shrink-0">{g.level}</span>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 mb-4">
        <div className="text-xs text-slate-500 mb-2">Código de inscripción</div>
        <div className="flex items-center justify-between gap-2">
          <code className="text-lg font-bold text-green-400 font-mono tracking-wider">{g.code || '—'}</code>
          <CopyButton text={g.code || ''} id={g.id} onCopy={onCopy} copied={copied} />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-700/50">
        <span className="text-xs text-slate-500">ID: {g.id}</span>
        <div className="flex gap-2">
          <button onClick={() => onEdit(g)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-all duration-200">
            <Edit2 className="w-3.5 h-3.5" />
            Editar
          </button>
          <button onClick={() => onDelete(g)} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-medium border border-red-500/30 transition-all duration-200">
            <Trash2 className="w-3.5 h-3.5" />
            Eliminar
          </button>
        </div>
      </div>
    </article>
  );
};

export default GroupCard;

GroupCard.propTypes = {
  g: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    level: PropTypes.string,
    code: PropTypes.string,
  }).isRequired,
  copied: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onCopy: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

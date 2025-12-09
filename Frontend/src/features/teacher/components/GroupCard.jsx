import CopyButton from './CopyButton';
import { Clock, CheckCircle2, Edit, Users } from 'lucide-react';
import PropTypes from 'prop-types';

const GroupCard = ({ g, copied, onCopy, onEdit, onShowStudents }) => {
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

        {/* Status Badge */}
        {g.isApproved ? (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-400 text-xs font-medium rounded-full border border-green-500/30 shrink-0">
            <CheckCircle2 className="w-3 h-3" />
            Aprobado
          </span>
        ) : (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 text-yellow-400 text-xs font-medium rounded-full border border-yellow-500/30 shrink-0">
            <Clock className="w-3 h-3" />
            Pendiente
          </span>
        )}
      </div>

      {/* Course Badge */}
      <div className="mb-4">
        <span className="inline-flex px-3 py-1 bg-slate-800 text-slate-300 text-xs font-medium rounded-full border border-slate-700/50">
          {g.level}
        </span>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 mb-4">
        <div className="text-xs text-slate-500 mb-2">Código de inscripción</div>
        <div className="flex items-center justify-between gap-2">
          {g.isApproved && g.code ? (
            <>
              <code className="text-lg font-bold text-green-400 font-mono tracking-wider">{g.code}</code>
              <CopyButton text={g.code} id={g.id} onCopy={onCopy} copied={copied} />
            </>
          ) : (
            <div className="flex items-center gap-2 text-slate-500">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Esperando aprobación del admin</span>
            </div>
          )}
        </div>
      </div>

      {/* Botones de acción - Solo para grupos aprobados */}
      {g.isApproved && (
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onEdit(g)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30 transition-all duration-200 text-sm font-medium"
          >
            <Edit className="w-4 h-4" />
            Editar
          </button>
          <button
            onClick={() => onShowStudents(g)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg border border-green-500/30 transition-all duration-200 text-sm font-medium"
          >
            <Users className="w-4 h-4" />
            Ver estudiantes
          </button>
        </div>
      )}
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
    code: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isApproved: PropTypes.bool,
  }).isRequired,
  copied: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onCopy: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onShowStudents: PropTypes.func,
};

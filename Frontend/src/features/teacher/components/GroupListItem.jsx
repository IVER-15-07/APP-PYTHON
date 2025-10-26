import { Link } from 'react-router-dom';
import { Edit2, Trash2, Users } from 'lucide-react';
import PropTypes from 'prop-types';

const GroupListItem = ({ group, onDelete }) => {
  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 hover:border-green-500/30 transition-all duration-200 shadow-xl hover:shadow-2xl group">
      <div className="flex justify-between items-start gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white mb-2 truncate group-hover:text-green-400 transition-colors">
            {group.title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span className="px-3 py-1 bg-slate-800 rounded-full border border-slate-700/50">
              {group.level}
            </span>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>{group.students} estudiantes</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-700/50">
        <Link
          to={`/profesor/cursos/${group.id}`}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-all duration-200"
        >
          <Edit2 className="w-3.5 h-3.5" />
          Administrar
        </Link>
        <button
          onClick={() => onDelete(group.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-medium border border-red-500/30 transition-all duration-200"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Eliminar
        </button>
      </div>
    </div>
  );
};

GroupListItem.propTypes = {
  group: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    level: PropTypes.string.isRequired,
    students: PropTypes.number.isRequired,
  }).isRequired,
  onDelete: PropTypes.func,
};

export default GroupListItem;

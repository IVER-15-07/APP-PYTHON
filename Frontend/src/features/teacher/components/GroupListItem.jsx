import PropTypes from 'prop-types';
import { Users, CheckCircle2} from 'lucide-react';

const GroupListItem = ({ group }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:border-green-500/30 transition-all duration-200 shadow-lg hover:shadow-xl group">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-base font-semibold text-white truncate group-hover:text-green-400 transition-colors">
              {group.title}
            </h3>
            {/* Status Badge */}
            {group.isApproved ? (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500/10 text-green-400 text-xs font-medium rounded-full border border-green-500/30 shrink-0">
                <CheckCircle2 className="w-3 h-3" />
                Aprobado
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500/10 text-yellow-400 text-xs font-medium rounded-full border border-yellow-500/30 shrink-0">
                <Users className="w-3 h-3" />
                Pendiente
              </span>
            )}
          </div>
          
          <p className="text-sm text-slate-400 line-clamp-1 mb-3">
            {group.description || 'Sin descripción'}
          </p>
          
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              {group.students || 0} estudiantes
            </span>
            <span className="px-2 py-1 bg-slate-700/50 rounded-full">
              {group.level}
            </span>
            {group.isApproved && group.code && (
              <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/30 font-mono">
                {group.code}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

GroupListItem.propTypes = {
  group: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    level: PropTypes.string,
    code: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isApproved: PropTypes.bool,
    students: PropTypes.number,
  }).isRequired,
};

export default GroupListItem;

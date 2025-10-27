import { BadgeAlert, Clock, CheckCircle2 } from 'lucide-react';
import PropTypes from 'prop-types';

const SummarySidebar = ({ groups }) => {
  const pendingCount = groups.filter(g => !g.isApproved).length;
  const approvedCount = groups.filter(g => g.isApproved).length;

  return (
    <aside className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl h-fit">
      <div className="flex items-center gap-2 mb-4">
        <BadgeAlert className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">Información</h3>
      </div>
      <p className="text-sm text-slate-400 mb-6">Crea grupos para tus estudiantes. Envía la solicitud al administrador para su revisión y aprobación.</p>
      
      {/* Pending Groups */}
      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-yellow-400 mb-1">
          <Clock className="w-4 h-4" />
          <span>Pendientes de aprobación</span>
        </div>
        <div className="text-3xl font-bold text-yellow-400">{pendingCount}</div>
      </div>

      {/* Approved Groups */}
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4">
        <div className="flex items-center gap-2 text-sm text-green-400 mb-1">
          <CheckCircle2 className="w-4 h-4" />
          <span>Grupos aprobados</span>
        </div>
        <div className="text-3xl font-bold text-green-400">{approvedCount}</div>
      </div>
    </aside>
  );
};

export default SummarySidebar;

SummarySidebar.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.shape({
    isApproved: PropTypes.bool
  })).isRequired,
};

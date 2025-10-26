import { BadgeAlert } from 'lucide-react';
import PropTypes from 'prop-types';

const SummarySidebar = ({ groupsCount }) => {
  return (
    <aside className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl h-fit">
      <div className="flex items-center gap-2 mb-4">
        <BadgeAlert className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">Información</h3>
      </div>
      <p className="text-sm text-slate-400 mb-6">Crea cursos para tus estudiantes. Envia la solicitud al administrador para su revisión y aprobación.</p>
      <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-xl p-4">
        <div className="text-sm text-slate-400 mb-1">Total de grupos</div>
        <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">{groupsCount}</div>
      </div>
    </aside>
  );
};

export default SummarySidebar;

SummarySidebar.propTypes = {
  groupsCount: PropTypes.number.isRequired,
};

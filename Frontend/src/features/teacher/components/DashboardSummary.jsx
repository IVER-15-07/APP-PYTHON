import { BookOpen, Users, TrendingUp } from 'lucide-react';
import PropTypes from 'prop-types';

const DashboardSummary = ({ coursesCount, studentsCount = 0, nextGroup = 'Sin grupos' }) => {
  return (
    <aside className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">Resumen rápido</h3>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/30">
              <BookOpen className="w-4 h-4 text-green-400" />
            </div>
            <span className="text-sm text-slate-400">Grupos publicados</span>
          </div>
          <span className="text-lg font-bold text-white">{coursesCount}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-sm text-slate-400">Estudiantes inscritos</span>
          </div>
          <span className="text-lg font-bold text-emerald-400">{studentsCount}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-sm text-slate-400">Próximo grupo</span>
          </div>
          <span className="text-sm font-medium text-cyan-400">{nextGroup}</span>
        </div>
      </div>
    </aside>
  );
};

DashboardSummary.propTypes = {
  coursesCount: PropTypes.number.isRequired,
  studentsCount: PropTypes.number.isRequired,
  nextGroup: PropTypes.string.isRequired,
};

export default DashboardSummary;

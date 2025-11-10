import PropTypes from 'prop-types';
import { BookOpen } from 'lucide-react';

export const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 lg:p-10">
    <div className="max-w-7xl mx-auto">
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-center p-12">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-slate-300">Cargando curso...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const EmptyState = ({ message = "No hay cursos disponibles." }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 lg:p-10">
    <div className="max-w-7xl mx-auto">
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center shadow-2xl">
        <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-10 h-10 text-slate-600" />
        </div>
        <h3 className="text-xl font-semibold text-slate-300 mb-2">{message}</h3>
        <p className="text-slate-500 text-sm">Los cursos aparecerán aquí cuando estén disponibles.</p>
      </div>
    </div>
  </div>
);

EmptyState.propTypes = {
  message: PropTypes.string,
};

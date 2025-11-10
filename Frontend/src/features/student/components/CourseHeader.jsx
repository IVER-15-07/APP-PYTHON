import PropTypes from 'prop-types';
import { BookOpen, Users } from 'lucide-react';

export const CourseHeader = ({ curso, grupo }) => {
  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/30">
          <BookOpen className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white truncate">
            {curso.nombre}
          </h1>
          {curso.descripcion && (
            <p className="text-slate-400 text-sm mt-1">{curso.descripcion}</p>
          )}
        </div>
      </div>

      {grupo && (
        <div className="mt-4">
          <GroupInfo grupo={grupo} />
        </div>
      )}
    </div>
  );
};

const GroupInfo = ({ grupo }) => (
  <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 shadow-lg">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/30">
          <Users className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs text-slate-400">Te uniste al grupo</div>
          <div className="font-semibold text-emerald-400 text-lg">{grupo.titulo}</div>
        </div>
      </div>
    </div>
  </div>
);

CourseHeader.propTypes = {
  curso: PropTypes.shape({
    nombre: PropTypes.string.isRequired,
    descripcion: PropTypes.string,
  }).isRequired,
  grupo: PropTypes.shape({
    titulo: PropTypes.string,
    codigo: PropTypes.string,
  }),
};

GroupInfo.propTypes = {
  grupo: PropTypes.shape({
    titulo: PropTypes.string.isRequired,
    codigo: PropTypes.string.isRequired,
  }).isRequired,
};

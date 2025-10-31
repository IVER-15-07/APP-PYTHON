import PropTypes from 'prop-types';
import { BookOpen, FileText, Users, CheckCircle, Clock, Edit } from 'lucide-react';

export default function CourseCard({ course, groups = [], onEdit }) {
    if (!course) {
        return null;
    }
    
    return (
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-emerald-500/20 rounded-2xl overflow-hidden shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
            {/* Header con degradado */}
            <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 p-6 border-b border-emerald-500/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-emerald-500/10 rounded-xl backdrop-blur-sm">
                            <BookOpen className="w-7 h-7 text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white tracking-tight">
                                {course.nombre}
                            </h3>
                            <p className="text-emerald-300/80 text-sm mt-1">Curso Principal</p>
                        </div>
                    </div>
                    
                    {/* Botón de editar */}
                    <button
                        onClick={onEdit}
                        className="p-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg transition-colors group"
                        title="Editar curso"
                    >
                        <Edit className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
                    </button>
                </div>
            </div>

            {/* Contenido */}
            <div className="p-6 space-y-6">
                {/* Descripción */}
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-700/50 rounded-lg mt-1">
                        <FileText className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-semibold text-slate-300 mb-2">Descripción</h4>
                        <p className="text-slate-400 leading-relaxed">
                            {course.descripcion || 'Sin descripción disponible'}
                        </p>
                    </div>
                </div>

                {/* Lista de Grupos */}
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-700/50 rounded-lg mt-1">
                        <Users className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-semibold text-slate-300 mb-3">
                            Grupos ({groups.length})
                        </h4>
                        
                        {groups.length === 0 ? (
                            <p className="text-slate-500 text-sm italic">No hay grupos creados aún</p>
                        ) : (
                            <div className="space-y-2">
                                {groups.map((group) => (
                                    <div 
                                        key={group.id}
                                        className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-3 hover:border-emerald-500/30 transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h5 className="text-white font-medium">{group.titulo}</h5>
                                                    {group.esAprobado ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs rounded-full">
                                                            <CheckCircle className="w-3 h-3" />
                                                            Aprobado
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 text-yellow-300 text-xs rounded-full">
                                                            <Clock className="w-3 h-3" />
                                                            Pendiente
                                                        </span>
                                                    )}
                                                </div>
                                                {group.descripcion && (
                                                    <p className="text-slate-400 text-sm">{group.descripcion}</p>
                                                )}
                                                {group.codigo && (
                                                    <p className="text-emerald-400 text-xs mt-1">
                                                        Código: <span className="font-mono">{group.codigo}</span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer decorativo */}
            <div className="h-1 bg-gradient-to-r from-emerald-500/50 via-green-500/50 to-emerald-500/50"></div>
        </div>
    );
}

CourseCard.propTypes = {
    course: PropTypes.shape({
        id: PropTypes.number,
        nombre: PropTypes.string.isRequired,
        descripcion: PropTypes.string
    }),
    groups: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            titulo: PropTypes.string.isRequired,
            descripcion: PropTypes.string,
            codigo: PropTypes.number,
            esAprobado: PropTypes.bool
        })
    ),
    onEdit: PropTypes.func
};

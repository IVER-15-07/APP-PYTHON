import PropTypes from 'prop-types';
import { Users, Calendar, Check } from 'lucide-react';

const PendingGroupCard = ({ group, onApprove, loading }) => {
    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-emerald-500/30 transition-all duration-300 shadow-lg hover:shadow-emerald-500/10">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/30">
                        <Users className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">{group.titulo}</h3>
                        <p className="text-sm text-slate-400">{group.curso?.nombre || 'Sin curso'}</p>
                    </div>
                </div>
            </div>

            {/* Description */}
            <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                {group.descripcion || 'Sin descripción'}
            </p>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <div>
                        <p className="text-slate-500 text-xs">Inicio</p>
                        <p className="text-slate-300">{formatDate(group.fecha_ini)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <div>
                        <p className="text-slate-500 text-xs">Fin</p>
                        <p className="text-slate-300">{formatDate(group.fecha_fin)}</p>
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <button
                onClick={() => onApprove(group.id)}
                disabled={loading === group.id}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
            >
                {loading === group.id ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Aprobando...</span>
                    </>
                ) : (
                    <>
                        <Check className="w-4 h-4" />
                        <span>Aprobar grupo</span>
                    </>
                )}
            </button>
        </div>
    );
};

PendingGroupCard.propTypes = {
    group: PropTypes.shape({
        id: PropTypes.number.isRequired,
        titulo: PropTypes.string.isRequired,
        descripcion: PropTypes.string,
        fecha_ini: PropTypes.string,
        fecha_fin: PropTypes.string,
        curso: PropTypes.shape({
            nombre: PropTypes.string
        })
    }).isRequired,
    onApprove: PropTypes.func.isRequired,
    loading: PropTypes.number
};

export default PendingGroupCard;

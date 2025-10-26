import { Plus, ArrowLeft, AlertCircle } from 'lucide-react';
import PropTypes from 'prop-types';

const GroupForm = ({ form, onChange, onSubmit, loading, error, onBack }) => {
    return (
        <section className="lg:col-span-2 bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-6">
                <Plus className="w-5 h-5 text-green-400" />
                <h2 className="text-xl font-semibold text-white">Crear nuevo grupo</h2>
            </div>

            {error && (
                <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-red-400 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={onSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Título del grupo *</label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={onChange}
                        placeholder="Ej: Grupo de Python A"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white placeholder-slate-500 border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Fecha de inicio *</label>
                    <input
                        name="startDate"
                        type="date"
                        value={form.startDate}
                        onChange={onChange}
                        placeholder="Ej: Grupo de Python A"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white placeholder-slate-500 border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Fecha de finalización *</label>
                    <input
                        name="endDate"
                        type="date"
                        value={form.endDate}
                        onChange={onChange}
                        placeholder="Ej: Grupo de Python A"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white placeholder-slate-500 border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Descripción</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={onChange}
                        placeholder="Describe de qué trata el grupo..."
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white placeholder-slate-500 border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all resize-none"
                        disabled={loading}
                    />
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 border border-emerald-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus className="w-4 h-4" />
                        Enviar solicitud
                    </button>

                    <button
                        type="button"
                        onClick={onBack}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 rounded-xl border border-slate-600/50 transition-all duration-200 font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver
                    </button>
                </div>
            </form>
        </section>
    );
};

export default GroupForm;

GroupForm.propTypes = {
    form: PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        // Fechas en formato string (formato ISO: 'YYYY-MM-DD' para input[type="date"])
        startDate: PropTypes.string,
        endDate: PropTypes.string,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.string,
    onBack: PropTypes.func.isRequired,
};

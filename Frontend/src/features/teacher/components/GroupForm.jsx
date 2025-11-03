import { Plus, Send, Ban, AlertCircle, Calendar, BookOpen, X } from 'lucide-react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import CustomDropdown from './CustomDropdown';
import 'react-datepicker/dist/react-datepicker.css';
import './datepicker-custom.css';

const GroupForm = ({ form, courses, onChange, onSubmit, loading, error, cancel, isModal = false, onClose }) => {
    
    // Si es modal y está cerrado, no renderizar nada
    if (isModal && !onClose) return null;

    const formContent = (
        <>
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

                <CustomDropdown
                    label="Curso"
                    icon={BookOpen}
                    name="courseId"
                    value={form.courseId}
                    onChange={onChange}
                    placeholder="Selecciona un curso"
                    required
                    disabled={loading || courses.length === 0}
                    options={courses.map((course) => ({
                        value: course.id,
                        label: course.nombre,
                        description: course.descripcion 
                    }))}
                />
                {courses.length === 1 && (
                    <p className="text-xs text-slate-500 mt-1.5">
                        Solo hay un curso disponible actualmente
                    </p>
                )}

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Fecha de inicio *</label>
                        <div className="relative">
                            <DatePicker
                                selected={form.startDate ? new Date(form.startDate) : null}
                                onChange={(date) => onChange({ 
                                    target: { 
                                        name: 'startDate', 
                                        value: date ? date.toISOString().split('T')[0] : '' 
                                    } 
                                })}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Selecciona fecha de inicio"
                                minDate={new Date()}
                                maxDate={form.endDate ? new Date(form.endDate) : null}
                                required
                                disabled={loading}
                                className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white placeholder-slate-500 border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
                                calendarClassName="dark-calendar"
                            />
                            <Calendar className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Fecha de finalización *</label>
                        <div className="relative">
                            <DatePicker
                                selected={form.endDate ? new Date(form.endDate) : null}
                                onChange={(date) => onChange({ 
                                    target: { 
                                        name: 'endDate', 
                                        value: date ? date.toISOString().split('T')[0] : '' 
                                    } 
                                })}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Selecciona fecha de fin"
                                minDate={form.startDate ? new Date(form.startDate) : new Date()}
                                required
                                disabled={loading}
                                className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white placeholder-slate-500 border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
                                calendarClassName="dark-calendar"
                            />
                            <Calendar className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>
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
                        <Send className="w-4 h-4" />
                        {loading ? 'Creando...' : 'Enviar solicitud'}
                    </button>

                    <button
                        type="button"
                        onClick={isModal ? onClose : cancel}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 rounded-xl border border-slate-600/50 transition-all duration-200 font-medium"
                    >
                        <Ban className="w-4 h-4" />
                        Cancelar
                    </button>
                </div>
            </form>
        </>
    );

    // Si es modal, envolver en la estructura del modal
    if (isModal) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    {/* Header del Modal */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-700/50 sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
                        <h2 className="text-2xl font-bold text-white">Crear Nuevo Grupo</h2>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700/50 rounded-lg"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    {/* Contenido del Modal */}
                    <div className="p-6">
                        {formContent}
                    </div>
                </div>
            </div>
        );
    }

    // Si no es modal, renderizar como card normal
    return (
        <section className="lg:col-span-2 bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
            {formContent}
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
        courseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
    courses: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            nombre: PropTypes.string.isRequired,
        })
    ),
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.string,
    cancel: PropTypes.func,
    isModal: PropTypes.bool,
    onClose: PropTypes.func,
};

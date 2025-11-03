import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { X, Save } from 'lucide-react';


export default function EditCourseModal({ isOpen, onClose, course, onSave }) {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');

    // Actualizar los valores cuando cambie el curso
    useEffect(() => {
        if (course) {
            setNombre(course.nombre || '');
            setDescripcion(course.descripcion || '');
        }
    }, [course]);

    const handleSave = () => {
        onSave({ nombre, descripcion });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 p-6 border-b border-emerald-500/20">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white">Editar Curso</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                        >
                            <X className="w-6 h-6 text-slate-400 hover:text-white" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                    {/* Nombre del curso */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Nombre del Curso
                        </label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                            placeholder="Ej: Introducción a Python"
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Descripción
                        </label>
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            rows={6}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
                            placeholder="Describe el curso..."
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-700 bg-slate-900/50">
                    <div className="flex items-center justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-lg font-medium flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                        >
                            <Save className="w-4 h-4" />
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

EditCourseModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    course: PropTypes.shape({
        nombre: PropTypes.string,
        descripcion: PropTypes.string
    }),
    onSave: PropTypes.func.isRequired,
    isLoading: PropTypes.bool
};

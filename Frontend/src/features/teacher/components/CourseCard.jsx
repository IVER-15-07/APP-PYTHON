import { useState } from 'react';
import PropTypes from 'prop-types';
import { Edit2, Save, X } from 'lucide-react';

export default function CourseCard({ course, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleEdit = () => {
        setEditForm({
            name: course.name,
            description: course.description
        });
        setIsEditing(true);
        setError('');
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditForm({ name: '', description: '' });
        setError('');
    };

    const handleChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!editForm.name.trim()) {
            setError('El nombre del curso es obligatorio');
            setLoading(false);
            return;
        }

        try {
            await onUpdate(editForm);
            setIsEditing(false);
            setEditForm({ name: '', description: '' });
        } catch (err) {
            setError(err.message || 'Error al actualizar el curso');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 shadow-xl">
            {!isEditing ? (
                <>
                    {/* View Mode */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                Nombre del Curso
                            </label>
                            <div className="flex items-center justify-between bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3">
                                <span className="text-lg font-semibold text-white">
                                    {course.name}
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                Descripción
                            </label>
                            <div className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3">
                                <p className="text-slate-300 leading-relaxed">
                                    {course.description || 'Sin descripción'}
                                </p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-700">
                            <button
                                onClick={handleEdit}
                                className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors duration-200"
                            >
                                <Edit2 className="w-4 h-4" />
                                Editar Curso
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* Edit Mode */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                                Nombre del Curso *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={editForm.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                placeholder="Ej: Introducción a Python"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
                                Descripción
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={editForm.description}
                                onChange={handleChange}
                                rows="5"
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                                placeholder="Describe el curso y sus objetivos..."
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        <div className="flex gap-3 pt-4 border-t border-slate-700">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200"
                            >
                                <Save className="w-4 h-4" />
                                {loading ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200"
                            >
                                <X className="w-4 h-4" />
                                Cancelar
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
}

CourseCard.propTypes = {
    course: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string
    }).isRequired,
    onUpdate: PropTypes.func.isRequired
};

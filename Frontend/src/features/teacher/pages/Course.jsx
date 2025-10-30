import { useState, useEffect } from 'react';
import { BookOpen, Edit2, Save, X } from 'lucide-react';

export default function Course() {
    const [course, setCourse] = useState({
        id: 1,
        name: 'Introducción a Python',
        description: 'Curso básico de programación en Python'
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // TODO: Cuando tengas el endpoint del backend, reemplaza esto con:
        // fetchCourse();
        
        // Por ahora usamos datos hardcoded
        setCourse({
            id: 1,
            name: 'Introducción a Python',
            description: 'Curso básico de programación en Python para principiantes. Aprende desde variables y estructuras de control hasta funciones y manejo de archivos.'
        });
    }, []);

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
            // TODO: Cuando tengas el endpoint del backend, reemplaza esto con:
            // await courseService.updateCourse({ nombre: editForm.name, descripcion: editForm.description });
            
            // Por ahora solo actualizamos el estado local
            setCourse({
                ...course,
                name: editForm.name,
                description: editForm.description
            });
            
            setIsEditing(false);
            setEditForm({ name: '', description: '' });
        } catch (err) {
            setError(err.message || 'Error al actualizar el curso');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <BookOpen className="w-8 h-8 text-emerald-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Información del Curso</h1>
                            <p className="text-slate-400 mt-1">Gestiona el nombre y descripción del curso</p>
                        </div>
                    </div>
                </div>

                {/* Course Card */}
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

                {/* Info Box */}
                <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <p className="text-blue-300 text-sm">
                        <strong>Nota:</strong> Este es el curso principal del sistema. Todos los grupos creados pertenecen a este curso.
                    </p>
                </div>
            </div>
        </div>
    );
}

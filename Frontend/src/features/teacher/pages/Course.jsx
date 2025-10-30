import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { coursesService } from '../../../../services/courses.api.js';
import { CourseCard } from '../components';

export default function Course() {
    const [course, setCourse] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCourse();
    }, []);

    const fetchCourse = async () => {
        try {
            const data = await coursesService.getCourses();
            setCourse({
                data: data,
            });
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Error al cargar el curso', err);
            setError(err.message || 'Error al cargar el curso');
        }
    };

    const handleUpdate = async (editForm) => {
        const payload = {
            nombre: editForm.name,
            descripcion: editForm.description
        };
        
        await coursesService.updateCourse(payload);
        
        setCourse({
            ...course,
            name: editForm.name,
            description: editForm.description
        });
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

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {/* Course Card Component */}
                <CourseCard course={course} onUpdate={handleUpdate} />

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

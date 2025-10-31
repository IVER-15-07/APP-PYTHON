import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { coursesService } from '../../../../services/courses.api.js';
import { coursesService as groupService } from '../../../../services/group.api.js';
import { CourseCard, EditCourseModal } from '../components';

export default function Course() {
    const [course, setCourse] = useState(null);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchCourseAndGroups();
    }, []);

    const fetchCourseAndGroups = async () => {
    try {
        setLoading(true);
        
        // Obtener curso
        const courseData = await coursesService.getCourses(); 
        // eslint-disable-next-line no-console
        console.log('Course Data:', courseData);
        if (Array.isArray(courseData) && courseData.length > 0) {  
            setCourse(courseData[0]); 
        }
        
        // Obtener grupos
        const groupsResponse = await groupService.getGroupRequests();
        // eslint-disable-next-line no-console
        console.log('Groups Response:', groupsResponse);
        
        // El backend retorna { success: true, data: [...] }
        const groupsData = groupsResponse?.data || [];
        // eslint-disable-next-line no-console
        console.log('Groups Array:', groupsData);
        
        if (Array.isArray(groupsData)) {
            setGroups(groupsData);
        }
        
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error al obtener datos:', err);
        setError(err.message || 'Error al cargar los datos');
    } finally {
        setLoading(false);
    }
    };

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    
    const handleSave = (updatedData) => {
        // Por ahora solo console.log y cerrar modal
        // eslint-disable-next-line no-console
        console.log('Datos a guardar:', updatedData);
        handleCloseModal();
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
                            <p className="text-slate-400 mt-1">Detalles del curso principal</p>
                        </div>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 text-center">
                        <p className="text-slate-400">Cargando información del curso...</p>
                    </div>
                )}

                {/* Error */}
                {error && !loading && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {/* Course Info */}
                {!loading && !error && course && (
                    <>
                        <CourseCard course={course} groups={groups} onEdit={handleOpenModal} />
                        
                        {/* Modal de edición */}
                        <EditCourseModal 
                            isOpen={isModalOpen}
                            onClose={handleCloseModal}
                            course={course}
                            onSave={handleSave}
                        />
                    </>
                )}

                {/* Info Box */}
                {!loading && course && (
                    <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                        <p className="text-blue-300 text-sm">
                            <strong>Nota:</strong> Este es el curso principal del sistema. Todos los grupos creados pertenecen a este curso.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

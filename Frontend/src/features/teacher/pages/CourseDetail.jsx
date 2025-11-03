import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, CheckCircle, Clock, Edit2 } from 'lucide-react';
import { coursesService } from '../../../../services/courses.api.js';
import { coursesService as groupService } from '../../../../services/group.api.js';
import { EditCourseModal } from '../components';

export default function CourseDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    useEffect(() => {
        fetchCourseDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchCourseDetail = async () => {
        try {
            setLoading(true);
            
            // Obtener curso
            const courseResponse = await coursesService.getCourses();
            const courseData = courseResponse?.data || [];
            const foundCourse = courseData.find(c => c.id === Number(id));
            setCourse(foundCourse);
            
            // Obtener grupos del curso
            const groupsResponse = await groupService.getGroupRequests();
            const groupsData = groupsResponse?.data || [];
            const courseGroups = groupsData.filter(g => Number(g.curso?.id) === Number(id));
            setGroups(courseGroups);
            
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Error al obtener detalles del curso:', err);
            setError(err.message || 'Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    
    const handleSave = async (updatedData) => {
        try {
            setSaveLoading(true);
            
            const response = await coursesService.updateCourse(course.id, updatedData);
            
            setCourse(prevCourse => ({
                ...prevCourse,
                ...updatedData
            }));
            
            handleCloseModal();
            //eslint-disable-next-line no-console
            console.log('Curso actualizado exitosamente:', response);
            
            alert('Curso actualizado exitosamente');
            
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error al actualizar curso:', error);
            alert(error.message || 'Error al actualizar el curso');
        } finally {
            setSaveLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 text-center">
                        <p className="text-slate-400">Cargando información...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4">
                        <p className="text-red-400 text-sm">{error || 'Curso no encontrado'}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Botón Volver */}
                <button
                    onClick={() => navigate('/profesor/cursos')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Volver a mis cursos</span>
                </button>

                {/* Header del Curso */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 mb-8">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-start gap-4 flex-1">
                            <div className="p-3 bg-blue-500/10 rounded-lg">
                                <Users className="w-6 h-6 text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-white mb-2">{course.nombre}</h1>
                                <div className="flex items-center gap-4 text-slate-400 text-sm">
                                    <span className="flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        {groups.reduce((sum, g) => sum + (g.estudiantes?.length || 0), 0)} estudiantes totales
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Botón de Editar */}
                        <button
                            onClick={handleOpenModal}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-emerald-400 font-medium transition-colors"
                        >
                            <Edit2 className="w-4 h-4" />
                            Editar curso
                        </button>
                    </div>

                    {/* Descripción del Curso */}
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold text-white mb-3">Descripción del Curso</h2>
                        <p className="text-slate-400 leading-relaxed">
                            {course.descripcion || 'Sin descripción disponible'}
                        </p>
                    </div>
                </div>

                {/* Grupos Registrados */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-6">Grupos Registrados</h2>
                </div>

                {/* Grid de Grupos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map((group) => {
                        const capacity = group.estudiantes?.length || 0;

                        return (
                            <div
                                key={group.id}
                                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:shadow-lg hover:border-emerald-500/50 transition-all"
                            >
                                {/* Header del Grupo */}
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-white">{group.titulo}</h3>
                                    <span className="text-sm font-medium text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full">
                                        {capacity} estudiantes
                                    </span>
                                </div>

                                {/* Estado y Descripción */}
                                <div className="space-y-3">
                                    {/* Estado de aprobación */}
                                    <div className="flex items-center gap-2">
                                        {group.esAprobado ? (
                                            <>
                                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                                                <span className="text-sm text-emerald-400">Aprobado</span>
                                            </>
                                        ) : (
                                            <>
                                                <Clock className="w-4 h-4 text-yellow-400" />
                                                <span className="text-sm text-yellow-400">Pendiente de aprobación</span>
                                            </>
                                        )}
                                    </div>

                                    {/* Descripción */}
                                    {group.descripcion && (
                                        <p className="text-slate-400 text-sm">
                                            {group.descripcion}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Mensaje si no hay grupos */}
                {groups.length === 0 && (
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 text-center">
                        <p className="text-slate-400">No hay grupos registrados para este curso</p>
                    </div>
                )}

                {/* Modal de edición */}
                {course && (
                    <EditCourseModal 
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        course={course}
                        onSave={handleSave}
                        isLoading={saveLoading}
                    />
                )}
            </div>
        </div>
    );
}

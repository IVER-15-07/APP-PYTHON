import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { coursesService } from '../../../../services/courses.api.js';
import { coursesService as groupService } from '../../../../services/group.api.js';

export default function Course() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            // Obtener cursos
            const courseResponse = await coursesService.getCourses(); 
            const courseData = courseResponse?.data || [];
            setCourses(Array.isArray(courseData) ? courseData : []);
            
            // Obtener grupos
            const groupsResponse = await groupService.getGroupRequests();
            const groupsData = groupsResponse?.data || [];
            setGroups(Array.isArray(groupsData) ? groupsData : []);
            
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Error al obtener datos:', err);
            setError(err.message || 'Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    // Calcular estadísticas
    const totalCursos = courses.length;
    const totalGrupos = groups.length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Mis Cursos</h1>
                    <p className="text-slate-400">Gestiona y visualiza la información de tus cursos</p>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 text-center shadow-sm">
                        <p className="text-slate-400">Cargando información...</p>
                    </div>
                )}

                {/* Error */}
                {error && !loading && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {/* Estadísticas */}
                {!loading && !error && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {/* Total de Cursos */}
                            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-emerald-500/50 transition-all">
                                <p className="text-slate-400 text-sm mb-2">Total de Cursos</p>
                                <p className="text-4xl font-bold text-white">{totalCursos}</p>
                            </div>

                            {/* Total de Grupos */}
                            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-emerald-500/50 transition-all">
                                <p className="text-slate-400 text-sm mb-2">Total de Grupos</p>
                                <p className="text-4xl font-bold text-white">{totalGrupos}</p>
                            </div>

                            {/* Total de Estudiantes */}
                            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-emerald-500/50 transition-all">
                                <p className="text-slate-400 text-sm mb-2">Total de Estudiantes</p>
                                <p className="text-4xl font-bold text-white">---</p>
                            </div>
                        </div>

                        {/* Lista de Cursos */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {courses.map((course) => {
                                const courseGroups = groups.filter(g => Number(g.curso?.id) === Number(course.id));
                                
                                return (
                                    <div key={course.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-emerald-500/50 transition-all">
                                        {/* Header con icono */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-3 bg-emerald-500/10 rounded-lg">
                                                <BookOpen className="w-6 h-6 text-emerald-400" />
                                            </div>
                                            <span className="text-sm font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                                                {courseGroups.length} {courseGroups.length === 1 ? 'grupo' : 'grupos'}
                                            </span>
                                        </div>

                                        {/* Nombre del curso */}
                                        <h3 className="text-2xl font-bold text-white mb-3">
                                            {course.nombre}
                                        </h3>

                                        {/* Descripción */}
                                        <p className="text-slate-400 mb-6 line-clamp-3">
                                            {course.descripcion || 'Sin descripción disponible'}
                                        </p>

                                        {/* Botón */}
                                        <button 
                                            onClick={() => navigate(`/profesor/cursos/${course.id}`)}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/50 rounded-xl text-emerald-400 font-medium transition-colors group"
                                        >
                                            Ver detalles del curso
                                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

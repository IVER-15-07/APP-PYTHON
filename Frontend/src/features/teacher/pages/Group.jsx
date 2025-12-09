import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../../services/auth.api.js';
import { coursesService as groupService } from '../../../../services/group.api';
import { coursesService } from '../../../../services/courses.api.js';
import { BookOpen, Users, X, Mail, User } from 'lucide-react';
import { GroupForm, SummarySidebar, GroupCard } from '../components';
import { CreateButton } from '../../../components/ui';



const Group = () => {
    const navigate = useNavigate();
    const [user] = useState(authService.obtenerUsuarioActual());
    const [form, setForm] = useState({ title: '', description: '', startDate: '', endDate: '', courseId: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [groups, setGroups] = useState([]);
    const [copied, setCopied] = useState(null);
    const [courses, setCourses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingGroupId, setEditingGroupId] = useState(null);
    const [showStudentList, setShowStudentList] = useState(false);
    const [selectedGroupForStudents, setSelectedGroupForStudents] = useState(null);
    const [students, setStudents] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(false);

    useEffect(() => {
        if (!user) return navigate('/login');
        fetchGroups();
        fetchCourses();
        // eslint-disable-next-line
    }, [user]);

    const fetchCourses = async () => {
        try {
            const courseResponse = await coursesService.getCourses();
            
            const courseData = courseResponse?.data || [];
            
            setCourses(courseData);
            
            // Selecciona el primer curso por defecto
            if (courseData.length > 0) {
                setForm(prev => ({ ...prev, courseId: courseData[0].id }));
            }
        } catch {
            // Error al cargar cursos
        }
    };


    const fetchGroups = async () => {
        try {
            const res = await groupService.getGroupRequests();
            const data = res?.data ?? res ?? [];

            // Transformar datos del backend (español) al formato del componente (inglés)
            const transformedGroups = (Array.isArray(data) ? data : []).map(group => ({
                id: group.id,
                title: group.titulo,
                description: group.descripcion,
                code: group.codigo,
                level: group.curso?.nombre || 'Sin curso',
                courseId: group.cursoId, // Guardar el ID del curso
                startDate: group.fecha_ini,
                endDate: group.fecha_fin,
                isApproved: group.esAprobado
            }));

            setGroups(transformedGroups);
        } catch {
            // Error al cargar grupos
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (error) setError(''); // Limpia el error cuando el usuario edita
    };

    const copyToClipboard = async (text, id) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(id);
            setTimeout(() => setCopied(null), 2000);
        } catch {
            // Error al copiar
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (new Date(form.endDate) < new Date(form.startDate)) {
            setError('La fecha de finalización debe ser posterior a la fecha de inicio');
            setLoading(false);
            return;
        }

        try {
            // Transformar datos al formato que espera el backend
            const payload = {
                titulo: form.title,
                descripcion: form.description,
                fecha_ini: form.startDate,
                fecha_fin: form.endDate,
                cursoId: Number(form.courseId) || 1
            };

            if (isEditing && editingGroupId) {
                await groupService.updateGroup(editingGroupId, payload);
            } else {
                // Crear nuevo grupo
                await groupService.createGroup(payload);
            }

            // Limpiar formulario y estados
            setForm({ title: '', description: '', startDate: '', endDate: '', courseId: courses[0]?.id || 1 });
            setIsEditing(false);
            setEditingGroupId(null);
            await fetchGroups();
            setIsModalOpen(false); // Cerrar modal después de crear/actualizar
        } catch (err) {
            setError(err.message || err?.response?.data?.message || `Error al ${isEditing ? 'actualizar' : 'crear'} grupo`);
        } finally {
            setLoading(false);
        }
    };

    const handleEditGroup = (group) => {
        // Solo permitir editar grupos aprobados
        if (!group.isApproved) {
            setError('Solo se pueden editar grupos aprobados');
            return;
        }

        // Encontrar el grupo original de la respuesta del backend para obtener el cursoId
        const originalGroup = groups.find(g => g.id === group.id);
        
        setForm({
            title: group.title,
            description: group.description,
            startDate: group.startDate,
            endDate: group.endDate,
            courseId: originalGroup?.courseId || courses[0]?.id || 1
        });
        setEditingGroupId(group.id);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsEditing(false);
        setEditingGroupId(null);
        setForm({ title: '', description: '', startDate: '', endDate: '', courseId: courses[0]?.id || 1 });
        setError('');
    };

    const handleOpenCreateModal = () => {
        setIsEditing(false);
        setEditingGroupId(null);
        setForm({ title: '', description: '', startDate: '', endDate: '', courseId: courses[0]?.id || 1 });
        setError('');
        setIsModalOpen(true);
    };

    const handleShowStudents = async (group) => {
        setSelectedGroupForStudents(group);
        setShowStudentList(true);
        setLoadingStudents(true);
        
        try {
            const response = await groupService.getListStudentsByGroup(group.id);
            const registros = response?.data || response || [];
            
            // Transformar y filtrar estudiantes del backend
            const studentList = (Array.isArray(registros) ? registros : [])
                .filter(reg => reg.usuario?.rol_usuario?.nombre === 'Estudiante')
                .map(reg => ({
                    id: reg.usuario.id,
                    nombre: reg.usuario.nombre || '',
                    apellidos: reg.usuario.apellidos || '',
                    correo: reg.usuario.email || '',
                    profilePicture: reg.usuario.profilePicture
                }));
            
            setStudents(studentList);
        } catch {
            setStudents([]);
        } finally {
            setLoadingStudents(false);
        }
    };

    const handleCloseStudentList = () => {
        setShowStudentList(false);
        setSelectedGroupForStudents(null);
        setStudents([]);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 lg:p-10">
            <div className="max-w-7xl mx-auto">
                {/* Header con botón */}
                <header className="mb-8 flex items-center justify-between">
                    <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Mis Grupos</h1>
                    <p className="text-slate-400">Administra todos los grupos que has creado</p>
                </div>
                    
                    {/* Botón para abrir modal */}
                    <CreateButton onClick={handleOpenCreateModal}>
                        Nuevo Grupo
                    </CreateButton>
                </header>

                {/* Layout con sidebar a la derecha */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Contenido principal (Lista de grupos) */}
                    <section className="lg:col-span-3">
                        <h2 className="text-2xl font-bold text-white mb-6">Grupos creados</h2>

                        {groups.length === 0 ? (
                            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center shadow-2xl">
                                <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <BookOpen className="w-10 h-10 text-slate-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-300 mb-2">Aún no tienes grupos</h3>
                                <p className="text-slate-500 text-sm">Crea tu primer grupo haciendo click en el botón &quot;Nuevo Grupo&quot;.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {groups.map((g) => (
                                    <GroupCard 
                                        key={g.id} 
                                        g={g} 
                                        copied={copied} 
                                        onCopy={copyToClipboard} 
                                        onEdit={handleEditGroup} 
                                        onDelete={() => { }}
                                        onShowStudents={handleShowStudents}
                                    />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Sidebar resumen a la derecha */}
                    <aside className="lg:col-span-1">
                        <SummarySidebar groups={groups} />
                    </aside>
                </div>

                {/* Modal para crear/editar grupo */}
                <GroupForm
                    isModal={true}
                    onClose={isModalOpen ? handleCloseModal : null}
                    form={form}
                    courses={courses}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    loading={loading}
                    error={error}
                    isEditing={isEditing}
                />

                {/* Modal para lista de estudiantes */}
                {showStudentList && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
                            {/* Header */}
                            <div className="bg-slate-800/50 border-b border-slate-700 p-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                        <Users className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Estudiantes Inscritos</h3>
                                        <p className="text-sm text-slate-400">{selectedGroupForStudents?.title}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCloseStudentList}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-700 transition-colors text-slate-400 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
                                {loadingStudents ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                                    </div>
                                ) : students.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Users className="w-8 h-8 text-slate-600" />
                                        </div>
                                        <p className="text-slate-400">Aún no hay estudiantes inscritos en este grupo</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {students.map((student) => (
                                            <div
                                                key={student.id}
                                                className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-blue-500/30 transition-all duration-200"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg shrink-0">
                                                        {student.nombre?.charAt(0)?.toUpperCase() || <User className="w-6 h-6" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-white font-semibold truncate">
                                                            {student.nombre} {student.apellidos}
                                                        </h4>
                                                        <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                                                            <Mail className="w-4 h-4" />
                                                            <span className="truncate">{student.correo}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Group;

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../../services/auth.api.js';
import { coursesService as groupService } from '../../../../services/group.api';
import { coursesService } from '../../../../services/courses.api.js';
import { BookOpen } from 'lucide-react';
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

    useEffect(() => {
        if (!user) return navigate('/login');
        fetchGroups();
        fetchCourses();
        // eslint-disable-next-line
    }, [user]);

    const fetchCourses = async () => {
        try {
            const courseResponse = await coursesService.getCourses();
            // eslint-disable-next-line no-console
            console.log('Courses Response:', courseResponse);
            
            // El backend retorna { success: true, data: [...] }
            const courseData = courseResponse?.data || [];
            
            setCourses(courseData);
            
            // Selecciona el primer curso por defecto
            if (courseData.length > 0) {
                setForm(prev => ({ ...prev, courseId: courseData[0].id }));
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Error al cargar cursos:', err);
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
                startDate: group.fecha_ini,
                endDate: group.fecha_fin,
                isApproved: group.esAprobado
            }));

            setGroups(transformedGroups);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err);
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
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('No se pudo copiar', err);
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

            await groupService.createGroup(payload);
            setForm({ title: '', description: '', startDate: '', endDate: '', courseId: courses[0]?.id || 1 });
            await fetchGroups();
            setIsModalOpen(false); // Cerrar modal después de crear
        } catch (err) {
            setError(err.message || err?.response?.data?.message || 'Error al crear grupo');
        } finally {
            setLoading(false);
        }

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
                    <CreateButton onClick={() => setIsModalOpen(true)}>
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
                                    <GroupCard key={g.id} g={g} copied={copied} onCopy={copyToClipboard} onEdit={() => { }} onDelete={() => { }} />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Sidebar resumen a la derecha */}
                    <aside className="lg:col-span-1">
                        <SummarySidebar groups={groups} />
                    </aside>
                </div>

                {/* Modal para crear grupo */}
                <GroupForm
                    isModal={true}
                    onClose={isModalOpen ? () => setIsModalOpen(false) : null}
                    form={form}
                    courses={courses}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    loading={loading}
                    error={error}
                />
            </div>
        </div>
    );
};

export default Group;

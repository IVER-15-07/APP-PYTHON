
import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.api';
import Dashboard from '../page/teacher/Dashboard';
import Course from '../page/teacher/course';
import { teacherService } from '../../services/teacher.api';
import DashboardAdmin from '../page/admin/DashboardAdmin';
import { Sidebar, Modal} from "../components/ui";

const VentanaProfesor = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [user] = useState(authService.obtenerUsuarioActual());
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);


    const [professorVariant, setProfessorVariant] = useState('ejecutor'); // 'ejecutor' | 'editor'
    const [requestLoading, setRequestLoading] = useState(false);
    const [requestError, setRequestError] = useState(null);
    const [requestSuccess, setRequestSuccess] = useState(null);
    const [pendingRequest, setPendingRequest] = useState(null);

    useEffect(() => {
        const roleId = user?.rol_usuarioId ?? user?.rol?.id ?? user?.rol_usuario?.id;
        if (roleId === 5) {
            setModalOpen(true);
        } else {
            setModalOpen(false);
        }
    }, [user]);

    useEffect(() => {
        const fetchpending = async () => {
            try {
                const token = authService.obtenerToken?.(); // asegúrate que retorna token
                const solicitud = await teacherService.getMyRoleRequest(token);
                if (solicitud?.data) {
                    setPendingRequest(solicitud.data);
                } else {
                    setPendingRequest(null);
                }
            } catch {
                setPendingRequest(null);
            }
        };
        if (user) fetchpending();
    }, [user]);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const handleSendRequest = async () => {
        if (pendingRequest) {
            setRequestError('Ya existe una solicitud pendiente.');
            return;
        }
        setRequestError(null);
        setRequestSuccess(null);
        setRequestLoading(true);
        try {
            // ids según tu Prisma: 2 = Profesor ejecutor, 3 = Profesor editor
            const desiredRolId = professorVariant === 'ejecutor' ? 2 : 3;
            const token = authService.obtenerToken?.(); // asegúrate que retorna token
            await teacherService.requestRoleChange({ rolId: desiredRolId }, token);
            setRequestSuccess('Solicitud enviada correctamente. El administrador la revisará.');
            // opcional: cerrar modal tras éxito
            setTimeout(() => setModalOpen(false), 1400);
            // actualizar pending
            setPendingRequest({ rol_usuarioId: desiredRolId, estado: 'pendiente' });
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Enviar solicitud error:', err);
            setRequestError(err.message || 'Error al enviar la solicitud');
        } finally {
            setRequestLoading(false);
        }
    };




    const menuItems = [
        { path: '/profesor', icon: '🏠', label: 'Dashboard', exact: true },
        { path: '/profesor/cursos', icon: '📚', label: 'Mis Cursos' },
        { path: '/profesor/estudiantes', icon: '👥', label: 'Estudiantes' },
        //{ path: '/profesor/ejercicios', icon: '📝', label: 'Crear Ejercicios' },
        //{ path: '/profesor/estadisticas', icon: '📊', label: 'Estadísticas' },
        //{ path: '/profesor/perfil', icon: '👤', label: 'Mi Perfil' },
    ];
    

    return (
        <div className="min-h-screen bg-slate-950 flex">

            <Sidebar
                user={user}
                items={menuItems}
                roleLabel="Profesor"
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onLogout={handleLogout}
                brand={{ icon: "🎓", name: "PyLearn" }}
            />

            <main className="flex-1 h-screenoverflow-auto">
                <Routes>
                    <Route index element={
                        user ? ((user.rol_usuarioId ?? user.rol?.id ?? user.rol_usuario?.id) === 1
                            ? <DashboardAdmin />
                            : <Dashboard />)
                            : <div style={{ padding: 20 }}>Cargando...</div>
                    }
                    />
                    <Route path="cursos" element={<Course />} />
                    {/* <Route path="estudiantes" element={<GestionEstudiantes />} /> */}
                    {/* <Route path="ejercicios" element={<CrearEjercicios />} /> */}
                    {/* <Route path="estadisticas" element={<Estadisticas />} /> */}
                    {/* <Route path="perfil" element={<Perfil />} /> */}
                </Routes>
            </main>

            <Modal
                open={modalOpen}
                onClose={() => navigate('/login')}
                title="Solicitar rol de Profesor"
                size="md"
                footer={
                    <div className="flex justify-end gap-2">
                        <button onClick={() => navigate('/login')} className="px-3 py-2 rounded bg-slate-700 text-slate-200">Cerrar</button>
                        <button
                            onClick={handleSendRequest}
                            disabled={requestLoading || !!pendingRequest} // deshabilita si ya hay pendiente
                            className="px-3 py-2 rounded bg-emerald-500 text-white disabled:opacity-60"
                        >
                            {requestLoading ? 'Enviando...' : 'Enviar solicitud'}
                        </button>
                    </div>
                }
            >
                {pendingRequest ? (
                    <div className="space-y-4">
                        <div className="text-sm text-yellow-400 space-y-1">
                            <div className="font-semibold">Solicitud pendiente</div>

                            <div>
                                <span className="text-slate-300">Rol solicitado: </span>
                                <span className="font-medium">
                                    {pendingRequest.rol_usuario?.nombre
                                        || (pendingRequest.rol_usuarioId === 2 ? 'Profesor ejecutor'
                                            : pendingRequest.rol_usuarioId === 3 ? 'Profesor editor'
                                                : `ID ${pendingRequest.rol_usuarioId}`)}
                                </span>
                            </div>

                            <div>
                                <span className="text-slate-300">Solicitado por: </span>
                                <span className="font-medium">{pendingRequest.usuario?.nombre || user?.nombre || '—'}</span>
                            </div>

                            <div>
                                <span className="text-slate-300">Fecha: </span>
                                <span className="font-medium">
                                    {pendingRequest.fecha_solicitud
                                        ? new Date(pendingRequest.fecha_solicitud).toLocaleString()
                                        : '—'}
                                </span>
                            </div>

                            <div>
                                <span className="text-slate-300">Estado: </span>
                                <span className="font-medium capitalize">{pendingRequest.estado || 'pendiente'}</span>
                            </div>

                            <div className="text-xs text-slate-400">Mientras la solicitud esté pendiente no podrás enviar otra.</div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-slate-300">Tienes el rol usuario. Selecciona el tipo de profesor que deseas solicitar:</p>

                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 text-slate-200">
                                <input
                                    type="radio"
                                    name="variant_modal"
                                    value="ejecutor"
                                    checked={professorVariant === 'ejecutor'}
                                    onChange={() => setProfessorVariant('ejecutor')}
                                    disabled={requestLoading}
                                />
                                Profesor ejecutor
                            </label>

                            <label className="flex items-center gap-2 text-slate-200">
                                <input
                                    type="radio"
                                    name="variant_modal"
                                    value="editor"
                                    checked={professorVariant === 'editor'}
                                    onChange={() => setProfessorVariant('editor')}
                                    disabled={requestLoading}
                                />
                                Profesor editor
                            </label>
                        </div>

                        <p className="text-xs text-slate-400">
                            {professorVariant === 'editor'
                                ? 'Como editor podrás crear y editar cursos.'
                                : 'Como ejecutor podrás crear grupos y gestionar evaluaciones.'}
                        </p>

                        {requestError && <div className="text-sm text-red-400">{requestError}</div>}
                        {requestSuccess && <div className="text-sm text-emerald-400">{requestSuccess}</div>}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default VentanaProfesor;
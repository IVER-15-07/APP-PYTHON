
import { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.api';
import Dashboard from '../page/profesor/Dashboard';
import Course from '../page/profesor/course';
import Modal from '../componentes/Modal';
import { teacherService } from '../../services/teacher.api';
import DashboardAdmin from '../page/admin/DashboardAdmin';

const VentanaProfesor = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [user, setUser] = useState(authService.obtenerUsuarioActual());
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
        { path: '/profesor/ejercicios', icon: '📝', label: 'Crear Ejercicios' },
        { path: '/profesor/estadisticas', icon: '📊', label: 'Estadísticas' },
        { path: '/profesor/perfil', icon: '👤', label: 'Mi Perfil' },
    ];

    return (
        <div className="min-h-screen bg-slate-950 flex">

            <aside className={`bg-slate-900 border-r border-slate-800 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'} h-screen sticky top-0 flex-shrink-0 overflow-hidden`}>

                <div className="p-4 border-b border-slate-800">
                    <div className="flex items-center justify-between">
                        <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
                            <span className="text-2xl">👨‍🏫</span>
                            {sidebarOpen && (
                                <div>
                                    <h2 className="text-blue-400 font-bold text-lg">PyLearn</h2>
                                    <p className="text-slate-400 text-xs">Profesor</p>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="text-slate-400 hover:text-white p-1 rounded"
                        >
                            {sidebarOpen ? '◀' : '▶'}
                        </button>
                    </div>
                </div>

                {sidebarOpen && user && (
                    <div className="p-4 border-b border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                {user.nombre?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-slate-200 font-medium truncate">{user.nombre}</p>
                                <p className="text-slate-400 text-sm truncate">{user.email}</p>
                            </div>
                        </div>
                    </div>
                )}

                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.exact}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
                                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                                } ${!sidebarOpen && 'justify-center'}`
                            }
                        >
                            <span className="text-xl">{item.icon}</span>
                            {sidebarOpen && <span className="font-medium">{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                <div className="absolute bottom-4 left-4 right-4">
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors ${!sidebarOpen && 'justify-center'}`}
                    >
                        <span className="text-xl">🚪</span>
                        {sidebarOpen && <span className="font-medium">Cerrar Sesión</span>}
                    </button>
                </div>
            </aside>

            <main className="flex-1 h-screenoverflow-auto">
                <Routes>
                    <Route index element={
                            user? ((user.rol_usuarioId ?? user.rol?.id ?? user.rol_usuario?.id) === 1
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


            // ...existing code...
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
                        <p className="text-slate-300">Tienes el rol "usuario". Selecciona el tipo de profesor que deseas solicitar:</p>

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
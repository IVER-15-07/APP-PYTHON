import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.api';
import Dashboard from '../features/teacher/pages/Dashboard';
import Group from '../features/teacher/pages/Group';
import Topic from '../features/teacher/pages/Topic';
import { teacherService } from '../../services/teacher.api';
import DashboardAdmin from '../features/admin/pages/DashboardAdmin';
import { Sidebar, Modal } from "../components/ui";
import { Home, BookOpen, Library, Code2, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

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
                const token = authService.obtenerToken?.();
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
            const desiredRolId = professorVariant === 'ejecutor' ? 2 : 3;
            const token = authService.obtenerToken?.();
            await teacherService.requestRoleChange({ rolId: desiredRolId }, token);
            setRequestSuccess('Solicitud enviada correctamente. El administrador la revisará.');
            setTimeout(() => {
                setModalOpen(false);
                navigate('/login');
            }, 1400);
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
        { 
            path: '/profesor', 
            icon: <Home className="w-5 h-5" />, 
            label: 'Dashboard', 
            exact: true 
        },
        { 
            path: '/profesor/cursos', 
            icon: <BookOpen className="w-5 h-5" />, 
            label: 'Mis Grupos' 
        },
        { 
            path: '/profesor/topicos', 
            icon: <Library className="w-5 h-5" />, 
            label: 'Mis tópicos' 
        },
        // { 
        //     path: '/profesor/ejercicios', 
        //     icon: <FileEdit className="w-5 h-5" />, 
        //     label: 'Crear Ejercicios' 
        // },
        // { 
        //     path: '/profesor/estadisticas', 
        //     icon: <BarChart3 className="w-5 h-5" />, 
        //     label: 'Estadísticas' 
        // },
        // { 
        //     path: '/profesor/perfil', 
        //     icon: <User className="w-5 h-5" />, 
        //     label: 'Mi Perfil' 
        // },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex">
            <Sidebar
                user={user}
                items={menuItems}
                roleLabel="Profesor"
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onLogout={handleLogout}
                brand={{ 
                    icon: <Code2 className="w-6 h-6" />, 
                    name: "PyLearn" 
                }}
            />

            <main className="flex-1 h-screen overflow-auto">
                <Routes>
                    <Route index element={
                        user ? ((user.rol_usuarioId ?? user.rol?.id ?? user.rol_usuario?.id) === 1
                            ? <DashboardAdmin />
                            : <Dashboard />)
                            : <div className="flex items-center justify-center h-full">
                                <div className="text-slate-400">Cargando...</div>
                              </div>
                    }
                    />
                    <Route path="cursos" element={<Group/>} />
                    <Route path="topicos" element={<Topic/>} /> 
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
                    <div className="flex justify-end gap-3">
                        <button 
                            onClick={() => navigate('/login')} 
                            className="px-4 py-2.5 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 border border-slate-600/50 font-semibold transition-all duration-200"
                        >
                            Cerrar
                        </button>
                        <button
                            onClick={handleSendRequest}
                            disabled={requestLoading || !!pendingRequest}
                            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold border border-emerald-400/30 shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {requestLoading ? 'Enviando...' : 'Enviar solicitud'}
                        </button>
                    </div>
                }
            >
                {pendingRequest ? (
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                            <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                            <div className="space-y-2 text-sm">
                                <div className="font-semibold text-yellow-400">Solicitud pendiente</div>

                                <div className="text-slate-300">
                                    <span className="text-slate-400">Rol solicitado: </span>
                                    <span className="font-medium text-white">
                                        {pendingRequest.rol_usuario?.nombre
                                            || (pendingRequest.rol_usuarioId === 2 ? 'Profesor ejecutor'
                                                : pendingRequest.rol_usuarioId === 3 ? 'Profesor editor'
                                                    : `ID ${pendingRequest.rol_usuarioId}`)}
                                    </span>
                                </div>

                                <div className="text-slate-300">
                                    <span className="text-slate-400">Solicitado por: </span>
                                    <span className="font-medium text-white">{pendingRequest.usuario?.nombre || user?.nombre || '—'}</span>
                                </div>

                                <div className="text-slate-300">
                                    <span className="text-slate-400">Fecha: </span>
                                    <span className="font-medium text-white">
                                        {pendingRequest.fecha_solicitud
                                            ? new Date(pendingRequest.fecha_solicitud).toLocaleString()
                                            : '—'}
                                    </span>
                                </div>

                                <div className="text-slate-300">
                                    <span className="text-slate-400">Estado: </span>
                                    <span className="font-medium capitalize text-yellow-400">{pendingRequest.estado || 'pendiente'}</span>
                                </div>

                                <div className="text-xs text-slate-400 pt-1">
                                    Mientras la solicitud esté pendiente no podrás enviar otra.
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-5">
                        <p className="text-slate-300">Tienes el rol usuario. Selecciona el tipo de profesor que deseas solicitar:</p>

                        <div className="space-y-3">
                            <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-700/50 hover:border-green-500/30 hover:bg-slate-800/30 cursor-pointer transition-all duration-200">
                                <input
                                    type="radio"
                                    name="variant_modal"
                                    value="ejecutor"
                                    checked={professorVariant === 'ejecutor'}
                                    onChange={() => setProfessorVariant('ejecutor')}
                                    disabled={requestLoading}
                                    className="mt-1"
                                />
                                <div>
                                    <div className="text-slate-200 font-semibold">Profesor ejecutor</div>
                                    <div className="text-xs text-slate-400 mt-1">
                                        Podrás crear grupos y gestionar evaluaciones.
                                    </div>
                                </div>
                            </label>

                            <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-700/50 hover:border-green-500/30 hover:bg-slate-800/30 cursor-pointer transition-all duration-200">
                                <input
                                    type="radio"
                                    name="variant_modal"
                                    value="editor"
                                    checked={professorVariant === 'editor'}
                                    onChange={() => setProfessorVariant('editor')}
                                    disabled={requestLoading}
                                    className="mt-1"
                                />
                                <div>
                                    <div className="text-slate-200 font-semibold">Profesor editor</div>
                                    <div className="text-xs text-slate-400 mt-1">
                                        Podrás crear y editar cursos.
                                    </div>
                                </div>
                            </label>
                        </div>

                        {requestError && (
                            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {requestError}
                            </div>
                        )}
                        
                        {requestSuccess && (
                            <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                                {requestSuccess}
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default VentanaProfesor;

import { useState } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.api';
import Dashboard from '../page/estudiante/Dashboard';

const VentanaEstudiante = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [user, setUser] = useState(authService.obtenerUsuarioActual());
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const menuItems = [
        { path: '/estudiante', icon: '🏠', label: 'Dashboard', exact: true },
        { path: '/estudiante/cursos', icon: '📚', label: 'Mis Cursos' },
        { path: '/estudiante/progreso', icon: '📊', label: 'Mi Progreso' },
        { path: '/estudiante/ejercicios', icon: '🎯', label: 'Ejercicios' },
        { path: '/estudiante/perfil', icon: '👤', label: 'Mi Perfil' },
    ];

    return (
        <div className="min-h-screen bg-slate-950 flex">

            {/* ✅ SIDEBAR ESTUDIANTE */}
            <aside className={`bg-slate-900 border-r border-slate-800 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}>

                {/* Header del Sidebar */}
                <div className="p-4 border-b border-slate-800">
                    <div className="flex items-center justify-between">
                        <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
                            <span className="text-2xl">🎓</span>
                            {sidebarOpen && (
                                <div>
                                    <h2 className="text-emerald-400 font-bold text-lg">PyLearn</h2>
                                    <p className="text-slate-400 text-xs">Estudiante</p>
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

                {/* Info del Usuario */}
                {sidebarOpen && user && (
                    <div className="p-4 border-b border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                                {user.nombre?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-slate-200 font-medium truncate">{user.nombre}</p>
                                <p className="text-slate-400 text-sm truncate">{user.email}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Menú de Navegación */}
                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.exact}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                                } ${!sidebarOpen && 'justify-center'}`
                            }
                        >
                            <span className="text-xl">{item.icon}</span>
                            {sidebarOpen && <span className="font-medium">{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout */}
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

            {/* ✅ CONTENIDO PRINCIPAL */}
            <main className="flex-1 overflow-auto">
                <Routes>
                    <Route index element={<Dashboard />} />
                    {/* <Route path="cursos" element={<Cursos />} /> */}
                    {/* <Route path="progreso" element={<Progreso />} /> */}
                    {/* <Route path="ejercicios" element={<Ejercicios />} /> */}
                    {/* <Route path="perfil" element={<Perfil />} /> */}
                </Routes>
            </main>
        </div>
    );
};

export default VentanaEstudiante;

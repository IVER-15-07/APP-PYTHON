
import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.api';
import Dashboard from '../page/estudiante/Dashboard';
import Course from '../page/estudiante/course';
import Sidebar from '../componentes/Sidebar';

const VentanaEstudiante = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [user] = useState(authService.obtenerUsuarioActual());
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
            <Sidebar
                user={user}
                items={menuItems}
                roleLabel="Estudiante"
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onLogout={handleLogout}
                brand={{ icon: "🎓", name: "PyLearn" }}
            />

            <main className="flex-1 h-screen overflow-auto">
                <Routes>
                    <Route index element={<Dashboard />} />
                    <Route path="cursos" element={<Course />} /> 
                </Routes>
            </main>
        </div>
    );
};

export default VentanaEstudiante;

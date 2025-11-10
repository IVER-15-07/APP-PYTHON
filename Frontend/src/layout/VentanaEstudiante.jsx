import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.api';
import Dashboard from '../features/student/pages/Dashboard';
import Course from '../features/student/pages/Course';
import Topic from '../features/student/pages/Topic';
import { Sidebar } from "../components/ui";
import { Home, BookOpen, Code2 } from 'lucide-react';

const VentanaEstudiante = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [user] = useState(authService.obtenerUsuarioActual());
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const menuItems = [
        { 
            path: '/estudiante', 
            icon: <Home className="w-5 h-5" />, 
            label: 'Dashboard', 
            exact: true 
        },
        { 
            path: '/estudiante/cursos', 
            icon: <BookOpen className="w-5 h-5" />, 
            label: 'Mis Cursos' 
        },
        // { 
        //     path: '/estudiante/progreso', 
        //     icon: <BarChart3 className="w-5 h-5" />, 
        //     label: 'Mi Progreso' 
        // },
        // { 
        //     path: '/estudiante/ejercicios', 
        //     icon: <Target className="w-5 h-5" />, 
        //     label: 'Ejercicios' 
        // },
        // { 
        //     path: '/estudiante/perfil', 
        //     icon: <User className="w-5 h-5" />, 
        //     label: 'Mi Perfil' 
        // },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex">
            <Sidebar
                user={user}
                items={menuItems}
                roleLabel="Estudiante"
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
                    <Route index element={<Dashboard />} />
                    <Route path="cursos" element={<Course />} /> 
                    <Route path="/cursos/topic/:id" element={<Topic />} />

                </Routes>
            </main>
        </div>
    );
};

export default VentanaEstudiante;
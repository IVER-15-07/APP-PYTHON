import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.api';
import Dashboard from '../features/student/pages/Dashboard';
import Course from '../features/student/pages/Course';
import { Sidebar } from "../components/ui";
import { Home, BookOpen, Code2, FlaskConical, BookMarked } from 'lucide-react';
import Lab1 from '../features/student/pages/Lab1';
import Topic1 from '../features/student/pages/Topic1';
import Topic2 from '../features/student/pages/Topic2';

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
        { 
            path: '/estudiante/lab1', 
            icon: <FlaskConical className="w-5 h-5" />, 
            label: 'Laboratorio 1' 
        },
        { 
            path: '/estudiante/topic1', 
            icon: <BookMarked className="w-5 h-5" />, 
            label: 'Tipo tópico 1' 
        },
        { 
            path: '/estudiante/topic2', 
            icon: <BookMarked className="w-5 h-5" />, 
            label: 'Tipo tópico 2' 
        },
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
                    <Route path="lab1" element={<Lab1 />} />
                    <Route path="topic1" element={<Topic1 />} />
                    <Route path="topic2" element={<Topic2 />} />
                </Routes>
            </main>
        </div>
    );
};

export default VentanaEstudiante;

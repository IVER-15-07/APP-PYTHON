// ...existing code...
import React, { useEffect, useState } from 'react';
import { authService } from '../../../../services/auth.api.js';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Activity, Target, Plus, BarChart3 } from 'lucide-react';
import { StatCard, GroupListItem, DashboardSummary } from '../components';

const Dashboard = () => {
  const user = authService.obtenerUsuarioActual();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Datos de ejemplo para la interfaz. Reemplaza por fetch real si quieres.
    setCourses([
      { id: 1, title: 'Python Básico', level: 'Básico', students: 24 },
      { id: 2, title: 'Data Science Intro', level: 'Intermedio', students: 18 },
      { id: 3, title: 'Algoritmos y Estructuras', level: 'Avanzado', students: 9 }
    ]);
  }, []);

  const totalStudents = courses.reduce((s, c) => s + c.students, 0);

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="text-green-400 bg-green-500/10 p-2 rounded-lg border border-green-500/30 shadow-lg shadow-green-500/20">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h1 className="text-3xl font-bold text-white">Panel del Profesor</h1>
              </div>
              <p className="text-slate-400 ml-14">
                Bienvenido{user?.nombre ? `, ${user.nombre}` : ''} — aquí tienes un resumen rápido
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/profesor/cursos"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 border border-emerald-400/30"
              >
                <Plus className="w-4 h-4" />
                Crear Grupo
              </Link>
              <Link
                to="/profesor/estadisticas"
                className="flex items-center gap-2 px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 rounded-xl border border-slate-600/50 transition-all duration-200 font-medium"
              >
                <BarChart3 className="w-4 h-4" />
                Estadísticas
              </Link>
            </div>
          </div>
        </header>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard label="Grupos" value={courses.length} variant="default" icon={BookOpen} />
          <StatCard label="Estudiantes en total" value={totalStudents} variant="primary" icon={Users} />
          <StatCard label="Ejercicios activos" value={12} variant="secondary" icon={Activity} />
          <StatCard label="Tasa de completado" value="87%" variant="accent" icon={Target} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista grupos recientes */}
          <section className="lg:col-span-2 bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Grupos recientes</h2>

            {courses.length === 0 ? (
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-12 text-center">
                <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-300 mb-2">No has creado grupos aún</h3>
                <p className="text-slate-500 text-sm">Comienza creando tu primer grupo de estudio.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {courses.map((c) => (
                  <GroupListItem key={c.id} group={c} />
                ))}
              </div>
            )}
          </section>

          {/* Panel derecho: resumen y acciones */}
          <DashboardSummary
            coursesCount={courses.length}
            studentsCount={totalStudents}
            lastActivity="hace 2 días"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
// ...existing code...
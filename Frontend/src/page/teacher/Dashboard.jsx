// ...existing code...
import React, { useEffect, useState } from 'react';
import { authService } from '../../../services/auth.api';
import { Link } from 'react-router-dom';

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
    <div className="p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Panel del Profesor</h1>
            <p className="text-sm text-slate-400 mt-1">Bienvenido{user?.nombre ? `, ${user.nombre}` : ''} — aquí tienes un resumen rápido</p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/profesor/cursos" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md">Crear Curso</Link>
            <Link to="/profesor/estadisticas" className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md">Ver estadísticas</Link>
          </div>
        </header>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-4">
            <p className="text-sm text-slate-400">Cursos</p>
            <div className="text-2xl font-semibold text-slate-100">{courses.length}</div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-4">
            <p className="text-sm text-slate-400">Estudiantes en total</p>
            <div className="text-2xl font-semibold text-emerald-400">{totalStudents}</div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-4">
            <p className="text-sm text-slate-400">Ejercicios activos</p>
            <div className="text-2xl font-semibold text-blue-400">12</div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-4">
            <p className="text-sm text-slate-400">Actividad reciente</p>
            <div className="text-2xl font-semibold text-purple-400">Buen rendimiento</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista cursos recientes */}
          <section className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-slate-200 mb-4">Cursos recientes</h2>

            {courses.length === 0 ? (
              <div className="text-slate-400">No has creado cursos aún.</div>
            ) : (
              <div className="space-y-4">
                {courses.map((c) => (
                  <div key={c.id} className="p-4 bg-slate-800/70 border border-slate-700 rounded-lg flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-100">{c.title}</h3>
                      <p className="text-sm text-slate-400 mt-1">{c.level} • {c.students} estudiantes</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Link to={`/profesor/cursos/${c.id}`} className="text-sm px-3 py-1 bg-slate-700 rounded text-slate-100">Administrar</Link>
                      <button className="text-xs px-2 py-1 bg-red-600 rounded text-white hover:bg-red-500">Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Panel derecho: resumen y acciones */}
          <aside className="bg-slate-800/70 border border-slate-700 rounded-xl p-6">
            <h3 className="text-sm font-medium text-slate-200 mb-3">Resumen rápido</h3>
            <ul className="text-sm text-slate-400 space-y-2">
              <li>• Cursos publicados: <span className="text-slate-100 font-medium ml-2">{courses.length}</span></li>
              <li>• Estudiantes inscritos: <span className="text-emerald-400 font-medium ml-2">{totalStudents}</span></li>
              <li>• Última actividad: <span className="text-slate-100 font-medium ml-2">hace 2 días</span></li>
            </ul>

            <div className="mt-6">
              <button className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md">Enviar anuncio</button>
              <button className="w-full px-4 py-2 mt-3 bg-slate-700 hover:bg-slate-600 text-white rounded-md">Gestionar estudiantes</button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
// ...existing code...
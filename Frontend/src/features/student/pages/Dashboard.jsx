// Frontend/src/page/estudiante/Dashboard.jsx
import { useEffect, useState } from 'react';

import { authService } from '../../../../services/auth.api.js'; // service located at Frontend/services/auth.api.js

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ✅ USAR authService para obtener usuario del localStorage
    const currentUser = authService.obtenerUsuarioActual();
    setUser(currentUser);
  }, []);

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-200 mb-2">
            ¡Bienvenido, {user?.nombre || 'Estudiante'}! 👋
          </h1>
          <p className="text-slate-400">Panel de control del estudiante</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
            <div className="text-emerald-400 text-3xl mb-3">📚</div>
            <h3 className="text-xl font-semibold text-slate-200 mb-2">Mis Cursos</h3>
            <p className="text-slate-400">Ver cursos inscritos</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
            <div className="text-blue-400 text-3xl mb-3">📊</div>
            <h3 className="text-xl font-semibold text-slate-200 mb-2">Progreso</h3>
            <p className="text-slate-400">Mi progreso de aprendizaje</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
            <div className="text-purple-400 text-3xl mb-3">🎯</div>
            <h3 className="text-xl font-semibold text-slate-200 mb-2">Ejercicios</h3>
            <p className="text-slate-400">Practicar con ejercicios</p>
          </div>
        </div>

        {/* Info del usuario */}
        {user && (
          <div className="mt-8 bg-slate-900/60 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">Información del Usuario</h2>
            <div className="flex items-center gap-4">
              {user.profilePicture && (
                <img 
                  src={user.profilePicture} 
                  alt={user.nombre}
                  className="w-16 h-16 rounded-full"
                />
              )}
              <div>
                <p className="text-lg font-medium text-slate-200">{user.nombre}</p>
                <p className="text-slate-400">{user.email}</p>
                <p className="text-sm text-emerald-400">
                  Rol: {user.rol_usuarioId === 1 ? 'Profesor' : 'Estudiante'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
import { useEffect, useState } from 'react';
import { authService } from '../../../../services/auth.api.js';
import { BookOpen, TrendingUp, Target, User } from 'lucide-react';

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authService.obtenerUsuarioActual();
    setUser(currentUser);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/30 shadow-lg shadow-emerald-500/20">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h1 className="text-3xl font-bold text-white">
                  ¡Bienvenid@, {user?.nombre || 'Estudiante'}! 👋
                </h1>
              </div>
              <p className="text-slate-400 ml-14">
                Aqui podras acceder a tus cursos y seguir tu progreso de aprendizaje.
              </p>
            </div>
          </div>
        </header>

        {/* Cards de navegación */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:border-emerald-500/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-slate-400">Mis Cursos</p>
              <BookOpen className="w-5 h-5 text-emerald-400 opacity-50" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-400 mb-2">Ver cursos</h3>
            <p className="text-slate-400 text-sm">Accede a tus cursos inscritos</p>
          </div>

          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:border-blue-500/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-slate-400">Progreso</p>
              <TrendingUp className="w-5 h-5 text-blue-400 opacity-50" />
            </div>
            <h3 className="text-2xl font-bold text-blue-400 mb-2">En desarrollo</h3>
            <p className="text-slate-400 text-sm">Mi progreso de aprendizaje</p>
          </div>

          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-slate-400">Ejercicios</p>
              <Target className="w-5 h-5 text-purple-400 opacity-50" />
            </div>
            <h3 className="text-2xl font-bold text-purple-400 mb-2">Próximamente</h3>
            <p className="text-slate-400 text-sm">Practicar con ejercicios</p>
          </div>
        </div>

        {/* Info del usuario */}
        {user && (
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/30">
                <User className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">Información del Usuario</h2>
            </div>
            <div className="flex items-center gap-4">
              {user.profilePicture && (
                <img 
                  src={user.profilePicture} 
                  alt={user.nombre}
                  className="w-16 h-16 rounded-full border-2 border-emerald-500/30"
                />
              )}
              <div>
                <p className="text-lg font-semibold text-white">{user.nombre}</p>
                <p className="text-slate-400">{user.email}</p>
                <p className="text-sm text-emerald-400 font-medium mt-1">
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
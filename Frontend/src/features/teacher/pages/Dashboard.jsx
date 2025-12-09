// ...existing code...
import React, { useEffect, useState } from 'react';
import { authService } from '../../../../services/auth.api.js';
import { coursesService } from '../../../../services/group.api.js';
import { BookOpen, Users, Activity, Target} from 'lucide-react';
import { StatCard, GroupListItem, DashboardSummary } from '../components';

const Dashboard = () => {
  const user = authService.obtenerUsuarioActual();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await coursesService.getGroupRequests();
      const data = res?.data ?? res ?? [];
      
      // Transformar datos del backend (español) al formato del componente (inglés)
      const transformedGroups = (Array.isArray(data) ? data : []).map(group => ({
        id: group.id,
        title: group.titulo,
        description: group.descripcion,
        code: group.codigo,
        level: group.curso?.nombre || 'Sin curso',
        startDate: group.fecha_ini,
        endDate: group.fecha_fin,
        isApproved: group.esAprobado,
        students: group.estudiantesInscritos || 0
      }));
      
      setGroups(transformedGroups);
    } catch {
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const totalStudents = groups.reduce((s, g) => s + (g.students || 0), 0);

  // Calcular próximo grupo por iniciar
  const getNextGroup = () => {
    if (groups.length === 0) return 'Sin grupos';
    
    const now = new Date();
    
    // Filtrar grupos aprobados que aún no han iniciado o están por iniciar pronto
    const upcomingGroups = groups
      .filter(g => g.isApproved)
      .map(group => ({
        ...group,
        startDate: new Date(group.startDate)
      }))
      .sort((a, b) => a.startDate - b.startDate);
    
    if (upcomingGroups.length === 0) return 'Sin grupos';
    
    // Tomar el grupo más cercano por fecha de inicio
    const nextGroup = upcomingGroups[0];
    const diffMs = nextGroup.startDate - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    const groupName = nextGroup.title.length > 20 
      ? nextGroup.title.substring(0, 20) + '...' 
      : nextGroup.title;
    
    if (diffDays < 0) return `${groupName} - En curso`;
    if (diffDays === 0) return `${groupName} - Hoy`;
    if (diffDays === 1) return `${groupName} - Mañana`;
    if (diffDays < 7) return `${groupName} - En ${diffDays} días`;
    if (diffDays < 30) return `${groupName} - En ${Math.floor(diffDays / 7)} semanas`;
    return `${groupName} - En ${Math.floor(diffDays / 30)} meses`;
  };

  const nextGroupInfo = getNextGroup();
  
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
                Bienvenid@{user?.nombre ? `, ${user.nombre}` : ''} — aquí tienes un resumen rápido
              </p>
            </div>
          </div>
        </header>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard label="Grupos" value={groups.length} variant="default" icon={BookOpen} />
          <StatCard label="Estudiantes en total" value={totalStudents} variant="primary" icon={Users} />
          <StatCard label="Grupos aprobados" value={groups.filter(g => g.isApproved).length} variant="secondary" icon={Activity} />
          <StatCard label="Grupos pendientes" value={groups.filter(g => !g.isApproved).length} variant="accent" icon={Target} />
        </div>
 
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista grupos recientes */}
          <section className="lg:col-span-2 bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Grupos activos</h2>

            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-slate-300">Cargando grupos...</span>
                </div>
              </div>
            ) : groups.filter(g => g.isApproved).length === 0 ? (
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-12 text-center">
                <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-300 mb-2">No tienes grupos aprobados aún</h3>
                <p className="text-slate-500 text-sm">Los grupos aparecerán aquí una vez que el administrador los apruebe.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {groups
                  .filter(g => g.isApproved)
                  .slice(0, 5)
                  .map((g) => (
                    <GroupListItem key={g.id} group={g} />
                  ))}
              </div>
            )}
          </section>

          {/* Panel derecho: resumen y acciones */}
          <DashboardSummary
            coursesCount={groups.length}
            studentsCount={totalStudents}
            nextGroup={nextGroupInfo}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
// ...existing code...
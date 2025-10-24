import { useState, useEffect } from "react";
import { Users, Copy, LogOut, UserPlus, CheckCircle2, AlertCircle, BookOpen } from "lucide-react";

const Course = () => {
  // curso fijo (card principal)
  const [curso] = useState({
    id: 1,
    nombre: "Introducción a Python",
    descripcion: "Curso introductorio de Python: variables, control y funciones.",
  });

  // datos simulados de grupos (no se muestran en la UI, solo para validar código)
  const [grupos] = useState([
    { id: 1, nombre: "Grupo A", codigo: "ABC123", miembrosCount: 4 },
    { id: 2, nombre: "Grupo B", codigo: "DEF456", miembrosCount: 2 },
    { id: 3, nombre: "Grupo C", codigo: "GHI789", miembrosCount: 0 },
  ]);

  // estado del usuario en este curso
  const [currentGroup, setCurrentGroup] = useState(null); // { id, nombre, codigo, miembrosCount }
  const [showForm, setShowForm] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // si quieres cargar el grupo real desde el backend, hazlo aquí
  }, []);

  const joinByCode = () => {
    setMsg({ type: '', text: '' });
    if (!codigo.trim()) {
      setMsg({ type: 'error', text: 'Ingresa un código válido.' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const found = grupos.find(g => g.codigo.toLowerCase() === codigo.trim().toLowerCase());
      if (!found) {
        setMsg({ type: 'error', text: 'Código inválido.' });
        setLoading(false);
        return;
      }
      // simular unión: establecer currentGroup
      setCurrentGroup(found);
      setCodigo("");
      setShowForm(false);
      setMsg({ type: 'success', text: 'Te has unido correctamente al grupo.' });
      setLoading(false);
    }, 500);
  };

  const leaveGroup = () => {
    if (!window.confirm('¿Estás seguro de que quieres salir del grupo?')) return;
    setCurrentGroup(null);
    setMsg({ type: 'success', text: 'Has salido del grupo correctamente.' });
  };

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setMsg({ type: 'error', text: `No se pudo copiar el ${label}` });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header del curso */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-green-400 bg-green-500/10 p-2 rounded-lg border border-green-500/30 shadow-lg shadow-green-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-bold text-white">{curso.nombre}</h1>
          </div>
          <p className="text-slate-400 ml-14">{curso.descripcion}</p>
        </div>

        {/* Mensajes globales */}
        {msg.text && (
          <div className={`flex items-start gap-3 p-4 rounded-xl border mb-6 ${
            msg.type === 'success' 
              ? 'bg-green-500/10 border-green-500/30 text-green-400' 
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            {msg.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            )}
            <span className="text-sm font-medium">{msg.text}</span>
          </div>
        )}

        {/* Card principal */}
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-2">Estado del Grupo</h2>
                <p className="text-slate-400 text-sm">
                  {currentGroup 
                    ? 'Estás participando en un grupo de estudio' 
                    : 'Únete a un grupo para empezar a colaborar'}
                </p>
              </div>

              <button
                onClick={() => { setShowForm(s => !s); setMsg({ type: '', text: '' }); }}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 border border-emerald-400/30"
              >
                <UserPlus className="w-4 h-4" />
                {currentGroup ? "Cambiar grupo" : "Unirse"}
              </button>
            </div>

            {/* Estado actual del grupo */}
            {currentGroup ? (
              <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-xl p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-400">Grupo actual</div>
                      <div className="text-xl font-bold text-white">{currentGroup.nombre}</div>
                      <div className="text-xs text-slate-500 mt-0.5">Código: {currentGroup.codigo}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-slate-400">Miembros</div>
                    <div className="text-2xl font-bold text-green-400">{currentGroup.miembrosCount}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => copyToClipboard(currentGroup.nombre, 'nombre')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 border border-slate-600/50 transition-all duration-200 text-sm font-medium"
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? 'Copiado!' : 'Copiar nombre'}
                  </button>
                  
                  <button
                    onClick={() => copyToClipboard(currentGroup.codigo, 'código')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 border border-slate-600/50 transition-all duration-200 text-sm font-medium"
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? 'Copiado!' : 'Copiar código'}
                  </button>
                  
                  <button
                    onClick={leaveGroup}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 transition-all duration-200 text-sm font-medium ml-auto"
                  >
                    <LogOut className="w-4 h-4" />
                    Salir del grupo
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-300 mb-2">No perteneces a ningún grupo</h3>
                <p className="text-slate-500 text-sm">Únete a un grupo usando un código de acceso</p>
              </div>
            )}

            {/* Formulario para unirse */}
            {showForm && !currentGroup && (
              <div className="mt-6 bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                <label className="text-sm font-semibold text-slate-300 block mb-3 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-green-400" />
                  Unirse por código de acceso
                </label>
                <div className="flex gap-3">
                  <input
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !loading && joinByCode()}
                    placeholder="Ejemplo: ABC123"
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700/50 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
                    disabled={loading}
                  />
                  <button
                    onClick={joinByCode}
                    disabled={loading || !codigo.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 border border-emerald-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Uniendo...
                      </div>
                    ) : (
                      'Unirse'
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  Ingresa el código que te proporcionó tu profesor o compañero
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Course;
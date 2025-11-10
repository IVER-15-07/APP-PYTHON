import { useState, useEffect } from "react";
import { grupoService } from "../services/grupo.api.js";
import { topicsService } from "../../../../services/topic.api.js";
import { useNavigate } from "react-router-dom";

const Course = () => {
  const [curso] = useState({
    id: 1,
    nombre: "Introducción a Python",
    descripcion: "Curso introductorio de Python: variables, control y funciones.",
  });

  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [grupo, setGrupo] = useState(null);
  const [niveles, setNiveles] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [expanded, setExpanded] = useState({});
  const [topicsByLevel, setTopicsByLevel] = useState({});
  const [loadingTopics, setLoadingTopics] = useState({});
  const navigate = useNavigate();

  // 🔹 Cargar grupo y niveles al iniciar
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("user"));

    const loadLevels = async () => {
      try {
        const res = await topicsService.getLevels();
        const lista = Array.isArray(res)
          ? res
          : res.data?.levels || res.data || res.levels || [];
        console.log("📘 Niveles cargados:", lista);
        setNiveles(lista);
      } catch (e) {
        console.error("Error cargando niveles:", e);
      }
    };

    const fetchUserGroup = async () => {
      if (!usuario?.id) return;
      try {
        const response = await grupoService.getUserGroup(usuario.id);
        const grupoData = response?.grupo || response?.data?.grupo || null;
        if (grupoData) setGrupo(grupoData);
        console.log("👥 Grupo del usuario:", grupoData);
      } catch (error) {
        console.error("Error al obtener grupo del usuario:", error);
      }
    };

    loadLevels();
    fetchUserGroup();
  }, []);

  // 🔹 Unirse por código
  const joinByCode = async () => {
    setMsg("");
    if (!codigo.trim()) {
      setMsg("Ingresa un código válido.");
      return;
    }

    const usuario = JSON.parse(localStorage.getItem("user"));
    const usuarioId = usuario?.id;
    if (!usuarioId) {
      setMsg("Error: no se encontró el usuario en sesión.");
      return;
    }

    setLoading(true);
    try {
      const data = await grupoService.joinGroupByCode({ codigo, usuarioId });
      const grupoData = data?.grupo || data?.data?.grupo;
      const nivelesData = data?.niveles || data?.data?.niveles || [];

      setGrupo(grupoData);
      setNiveles(nivelesData);
      setMsg(data?.message || "Te has unido correctamente.");
      setShowForm(false);


    } catch (error) {

      setMsg(error.response?.data?.message || "Código inválido o error del servidor.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Obtener tópicos por nivel
  const fetchTopicsForLevel = async (nivelId) => {
    setLoadingTopics((s) => ({ ...s, [nivelId]: true }));
    try {
      const res = await grupoService.getTopicsByLevel(nivelId);
      const lista = Array.isArray(res)
        ? res
        : res.data?.topics || res.data || [];

      setTopicsByLevel((s) => ({ ...s, [nivelId]: lista }));
    } catch {

      setTopicsByLevel((s) => ({ ...s, [nivelId]: [] }));
    } finally {
      setLoadingTopics((s) => ({ ...s, [nivelId]: false }));
    }
  };

  const toggleLevel = (nivelId) => {
    setExpanded((s) => ({ ...s, [nivelId]: !s[nivelId] }));
    if (!topicsByLevel[nivelId]) fetchTopicsForLevel(nivelId);
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="w-[90%]">
        <div className="bg-slate-800 p-6 rounded-lg shadow-md">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-slate-100 truncate">{curso.nombre}</h1>
              <p className="text-slate-400 mt-2">{curso.descripcion}</p>

              <div className="mt-4">
                {grupo ? (
                  <div className="bg-emerald-700/10 border border-emerald-700/20 text-emerald-200 px-4 py-3 rounded">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-emerald-100">Te uniste al grupo</div>
                        <div className="font-semibold text-emerald-200 text-lg">{grupo.titulo}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-300">Código</div>
                        <div className="font-medium text-slate-100">{grupo.codigo}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-300">No perteneces a ningún grupo aún.</div>
                )}
              </div>
            </div>

            {!grupo && (
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => {
                    setShowForm((s) => !s);
                    setMsg("");
                  }}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded"
                >
                  Unirse por código
                </button>
              </div>
            )}
          </div>

          {/* Formulario de unión por código */}
          {showForm && !grupo && (
            <div className="mt-4 bg-slate-900 p-4 rounded border border-slate-700">
              <label className="text-sm text-slate-300 block mb-2">Unirse por código</label>
              <div className="flex gap-2">
                <input
                  value={codigo}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setCodigo(val);
                  }}
                  placeholder="Introduce el código"
                  className="flex-1 px-3 py-2 rounded bg-slate-800 text-slate-200"
                  maxLength={6}
                />
                <button
                  onClick={joinByCode}
                  disabled={loading}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded"
                >
                  {loading ? "Verificando..." : "Unirse"}
                </button>
              </div>
              {msg && <p className="text-xs text-red-400 mt-2">{msg}</p>}
            </div>
          )}

          {niveles.length > 0 && (
            <div className="mt-6 bg-slate-900 p-4 rounded border border-slate-700">
              <h2 className="text-lg font-semibold text-emerald-400 mb-3">Niveles disponibles</h2>
              {!grupo && (
                <p className="text-xs text-slate-500 mb-2">
                  Únete a un grupo para habilitar acceso completo; aún puedes ver los tópicos listados.
                </p>
              )}
              <ul className="space-y-2">
                {niveles.map((nivel) => (
                  <li key={nivel.id} className="rounded border border-slate-700 overflow-hidden">
                    <button
                      onClick={() => toggleLevel(nivel.id)}
                      className="w-full flex items-center justify-between px-3 py-2 bg-slate-800 text-slate-200 hover:bg-slate-800/70"
                    >
                      <span>{nivel.nombre}</span>
                      <span className="text-slate-400 text-sm">
                        {expanded[nivel.id] ? "▲" : "▼"}
                      </span>
                    </button>
                    {expanded[nivel.id] && (
                      <div className="bg-slate-900/60 border-t border-slate-700">
                        {loadingTopics[nivel.id] ? (
                          <div className="p-3 text-slate-400 text-sm">Cargando tópicos…</div>
                        ) : (topicsByLevel[nivel.id]?.length || 0) === 0 ? (
                          <div className="p-3 text-slate-400 text-sm">No hay tópicos en este nivel.</div>
                        ) : (
                          <ul className="divide-y divide-slate-700">
                            {topicsByLevel[nivel.id].map((t) => (
                              <li key={t.id} className="p-3 flex items-center justify-between hover:bg-slate-800/40">
                                <div className="min-w-0">
                                  <div className="text-slate-200 font-medium truncate">{t.nombre}</div>
                                  {t.descripcion && (
                                    <div className="text-slate-400 text-xs line-clamp-1">{t.descripcion}</div>
                                  )}
                                </div>
                                <button
                                  disabled={!grupo}
                                  onClick={() => navigate(`/estudiante/cursos/topic/${t.id}`)}
                                  className={`px-3 py-1 text-white text-xs rounded ${
                                    grupo
                                      ? "bg-emerald-500 hover:bg-emerald-600"
                                      : "bg-slate-600 cursor-not-allowed"
                                  }`}
                                >
                                  Ver
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!showForm && !grupo && msg && (
            <div className="mt-4 text-sm text-red-400">{msg}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Course;

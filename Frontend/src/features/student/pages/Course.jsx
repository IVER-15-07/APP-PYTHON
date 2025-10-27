import { useState, useEffect } from "react";
import { grupoService } from "../../../../services/grupo.api.js";

const Course = () => {
  const [grupo, setGrupo] = useState(null);
  const [niveles, setNiveles] = useState([]);
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Obtener el usuario del localStorage
  const usuario = JSON.parse(localStorage.getItem("user"));
  const usuarioId = usuario?.id;

  // Al cargar, verificar si el usuario pertenece a un grupo
  useEffect(() => {
    if (!usuarioId) return;

    const fetchUserGroup = async () => {
      try {
        const data = await grupoService.getUserGroup(usuarioId);
        if (data.grupo) {
          setGrupo(data.grupo);
          setNiveles(data.niveles);
        } else {
          setGrupo(null);
          setNiveles([]);
        }
      } catch (error) {
        console.error("Error al obtener grupo:", error);
      }
    };

    fetchUserGroup();
  }, [usuarioId]);

  // Función para unirse a un grupo por código
  const joinByCode = async () => {
    setMsg("");
    if (!codigo.trim()) {
      setMsg("Ingresa un código válido.");
      return;
    }
    if (!usuarioId) {
      setMsg("Error: no se encontró el usuario en sesión.");
      return;
    }

    setLoading(true);
    try {
      const data = await grupoService.joinGroupByCode({ codigo, usuarioId });
      setGrupo(data.grupo);
      setNiveles(data.niveles);
      setMsg(data.message);
      setShowForm(false);
    } catch (error) {
      setMsg(error.response?.data?.message || "Código inválido o error del servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="w-[90%]">
        <div className="bg-slate-800 p-6 rounded-lg shadow-md">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-slate-100 truncate">Curso</h1>

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

            {/* Botón para unirse si no tiene grupo */}
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
                  onChange={(e) => setCodigo(e.target.value.replace(/\D/g, "").slice(0, 6))}
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

          {/* Lista de niveles */}
          {grupo && niveles.length > 0 && (
            <div className="mt-6 bg-slate-900 p-4 rounded border border-slate-700">
              <h2 className="text-lg font-semibold text-emerald-400 mb-3">Niveles disponibles</h2>
              <ul className="space-y-2">
                {niveles.map((nivel) => (
                  <li
                    key={nivel.id}
                    className="bg-slate-800 px-3 py-2 rounded text-slate-200 border border-slate-700"
                  >
                    {nivel.nombre}
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


import { useState, useEffect } from "react";
import axios from "axios";

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

  // Al cargar, verificar en el backend si el usuario pertenece a un grupo
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("user"));
    if (!usuario?.id) return;

    const fetchUserGroup = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/grupo/user/${usuario.id}`);
        if (res.data.grupo) {
          setGrupo(res.data.grupo);
          setNiveles(res.data.niveles);
        } else {
          setGrupo(null);
          setNiveles([]);
        }
      } catch (error) {
        console.error("Error al obtener grupo del usuario:", error);
      }
    };

    fetchUserGroup();
  }, []);

  // Unirse por código
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
      const res = await axios.post("http://localhost:3000/api/grupo/join-by-code", {
        codigo,
        usuarioId,
      });

      setGrupo(res.data.grupo);
      setNiveles(res.data.niveles);
      setMsg(res.data.message);
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

            {/* Botón solo si el usuario no tiene grupo */}
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
                    const val = e.target.value.replace(/\D/g, "").slice(0, 5);
                    setCodigo(val);
                  }}
                  placeholder="Introduce el código"
                  className="flex-1 px-3 py-2 rounded bg-slate-800 text-slate-200"
                  maxLength={5}
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

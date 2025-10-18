import { useState, useEffect } from "react";

const course = () => {
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
  const [msg, setMsg] = useState("");

  useEffect(() => {
    // si quieres cargar el grupo real desde el backend, hazlo aquí
  }, []);

  const joinByCode = () => {
    setMsg("");
    if (!codigo.trim()) {
      setMsg("Ingresa un código válido.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const found = grupos.find(g => g.codigo.toLowerCase() === codigo.trim().toLowerCase());
      if (!found) {
        setMsg("Código inválido.");
        setLoading(false);
        return;
      }
      // simular unión: establecer currentGroup
      setCurrentGroup(found);
      setCodigo("");
      setShowForm(false);
      setMsg("Te has unido correctamente.");
      setLoading(false);
    }, 500);
  };

  const leaveGroup = () => {
    // si integras backend, llamar endpoint para abandonar grupo
    setCurrentGroup(null);
    setMsg("Has salido del grupo.");
  };


    return (
       <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-800 p-6 rounded-lg shadow-md">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-slate-100 truncate">{curso.nombre}</h1>
              <p className="text-slate-400 mt-2">{curso.descripcion}</p>

              <div className="mt-4">
                {currentGroup ? (
                  <div className="bg-emerald-700/10 border border-emerald-700/20 text-emerald-200 px-4 py-3 rounded">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-emerald-100">Estás en</div>
                        <div className="font-semibold text-emerald-200 text-lg">{currentGroup.nombre}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-300">Miembros</div>
                        <div className="font-medium text-slate-100">{currentGroup.miembrosCount}</div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => navigator.clipboard?.writeText(currentGroup.nombre) && alert("Nombre copiado")}
                        className="px-3 py-1 rounded bg-slate-700 text-slate-200 text-sm"
                      >
                        Copiar nombre
                      </button>
                      <button
                        onClick={leaveGroup}
                        className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
                      >
                        Salir del grupo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-300">No perteneces a ningún grupo aún.</div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <button
                onClick={() => { setShowForm(s => !s); setMsg(""); }}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded"
              >
                {currentGroup ? "Cambiar de grupo" : "Unirse por código"}
              </button>
              {/* opción de crear/solicitar grupo eliminada según petición */}
            </div>
          </div>

          {showForm && !currentGroup && (
            <div className="mt-4 bg-slate-900 p-4 rounded border border-slate-700">
              <label className="text-sm text-slate-300 block mb-2">Unirse por código</label>
              <div className="flex gap-2">
                <input
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  placeholder="Introduce el código"
                  className="flex-1 px-3 py-2 rounded bg-slate-800 text-slate-200"
                />
                <button
                  onClick={joinByCode}
                  disabled={loading}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded"
                >
                  {loading ? "Procesando..." : "Unirse"}
                </button>
              </div>
              {msg && <p className="text-xs text-red-400 mt-2">{msg}</p>}
            </div>
          )}

          {/* estado / mensaje */}
          {!showForm && !currentGroup && msg && (
            <div className="mt-4 text-sm text-red-400">{msg}</div>
          )}
        </div>
      </div>
    </div>
  );
};



export default course

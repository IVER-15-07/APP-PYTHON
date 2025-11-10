import { useState } from 'react';
import PropTypes from 'prop-types';

export const JoinGroupForm = ({ onJoin, onToggle, showForm }) => {
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleJoin = async () => {
    setMsg("");
    if (!codigo.trim()) {
      setMsg("Ingresa un código válido.");
      return;
    }

    setLoading(true);
    try {
      await onJoin(codigo);
      setMsg("Te has unido correctamente.");
    } catch (error) {
      setMsg(error.message || "Código inválido o error del servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCodigo(val);
  };

  if (!showForm) {
    return (
      <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-white font-bold mb-1">¿Tienes un código de grupo?</h3>
            <p className="text-slate-400 text-sm">
              Introduce el código proporcionado por tu profesor para acceder al contenido.
            </p>
          </div>
          <button
            onClick={() => {
              onToggle();
              setMsg("");
            }}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold rounded-lg shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all whitespace-nowrap"
          >
            Ingresar código
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-5 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <label className="text-base text-white font-bold">
          Unirse por código de grupo
        </label>
        <button
          onClick={onToggle}
          className="text-slate-400 hover:text-slate-300 text-sm font-medium"
        >
          Cancelar
        </button>
      </div>
      <div className="flex gap-3">
        <input
          value={codigo}
          onChange={handleInputChange}
          placeholder="Código de 6 dígitos"
          className="flex-1 px-4 py-3 rounded-lg bg-slate-900 text-slate-200 border border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all placeholder:text-slate-500"
          maxLength={6}
          autoFocus
        />
        <button
          onClick={handleJoin}
          disabled={loading || codigo.length !== 6}
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg shadow-emerald-500/20 disabled:shadow-none transition-all"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Verificando...
            </span>
          ) : (
            "Unirse"
          )}
        </button>
      </div>
      {msg && (
        <div className={`mt-3 px-3 py-2 rounded-lg text-sm font-medium ${
          msg.includes("correctamente") 
            ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" 
            : "bg-red-500/10 border border-red-500/30 text-red-400"
        }`}>
          {msg}
        </div>
      )}
    </div>
  );
};

JoinGroupForm.propTypes = {
  onJoin: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  showForm: PropTypes.bool.isRequired,
};

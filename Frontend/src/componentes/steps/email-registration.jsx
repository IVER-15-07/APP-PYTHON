import { useState } from "react";
import { authService } from "../../../services/auth.api";
import PropTypes from "prop-types";

const EmailRegistration = ({ defaultRolId = 5, onNext, onError }) => {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    contrasena: "",
    confirmarContrasena: "",
    rol_usuarioId: defaultRolId,
  });

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    onError?.("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    onError?.("");

    if (!form.nombre.trim()) return onError?.("Ingresa tu nombre");
    if (!/\S+@\S+\.\S+/.test(form.email)) return onError?.("Correo inválido");
    if (form.contrasena.length < 6) return onError?.("Contraseña mínima de 6 caracteres");
    if (form.contrasena !== form.confirmarContrasena) return onError?.("Las contraseñas no coinciden");

    try {
      setLoading(true);
      // Paso 1: enviar código (no crea el usuario aún)
      await authService.registerSendCode({
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        contrasena: form.contrasena,
        rol_usuarioId: Number(form.rol_usuarioId || defaultRolId),
      });

      // Guardar para posible reenvío en el paso 2
      sessionStorage.setItem(
        "pendingReg",
        JSON.stringify({
          nombre: form.nombre.trim(),
          email: form.email.trim(),
          contrasena: form.contrasena,
          rol_usuarioId: Number(form.rol_usuarioId || defaultRolId),
        })
      );

      setMsg("Código enviado a tu correo");
      onNext?.(form.email.trim());
    } catch (err) {
      onError?.(err.message || "No se pudo enviar el código");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      {msg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-emerald-400 text-sm text-center">
          {msg}
        </div>
      )}

      <input
        type="text"
        name="nombre"
        placeholder="Nombre completo"
        value={form.nombre}
        onChange={onChange}
        className="w-full px-4 py-4 bg-slate-700/80 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
        disabled={loading}
      />

      <input
        type="email"
        name="email"
        placeholder="Correo electrónico"
        value={form.email}
        onChange={onChange}
        className="w-full px-4 py-4 bg-slate-700/80 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
        disabled={loading}
      />

      <input
        type="password"
        name="contrasena"
        placeholder="Contraseña (mín. 6)"
        value={form.contrasena}
        onChange={onChange}
        className="w-full px-4 py-4 bg-slate-700/80 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
        minLength={6}
        disabled={loading}
      />

      <input
        type="password"
        name="confirmarContrasena"
        placeholder="Confirmar contraseña"
        value={form.confirmarContrasena}
        onChange={onChange}
        className="w-full px-4 py-4 bg-slate-700/80 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
        minLength={6}
        disabled={loading}
      />

      <button
        type="submit"
        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Enviando código..." : "Enviar código de verificación"}
      </button>
    </form>
  );
};

EmailRegistration.propTypes = {
  defaultRolId: PropTypes.number,
  onNext: PropTypes.func,
  onError: PropTypes.func,
};
export default EmailRegistration;
import { useEffect, useMemo, useRef, useState } from "react";
import { authService } from '../../../../../services/auth.api.js';
import PropTypes from "prop-types";

const EmailVerification = ({ email, onVerified, onError }) => {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [secs, setSecs] = useState(60);
  const [msg, setMsg] = useState("");
  const inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
    const t = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const code = useMemo(() => digits.join(""), [digits]);

  const onChange = (i, v) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    if (v && i < 5) inputsRef.current[i + 1]?.focus();
  };

  const onPaste = (e) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    const arr = text.split("");
    while (arr.length < 6) arr.push("");
    setDigits(arr);
    inputsRef.current[Math.min(text.length, 5)]?.focus();
  };

  const submit = async (e) => {
    e.preventDefault();
    onError?.("");
    setMsg("");
    if (code.length !== 6) return onError?.("Completa los 6 dígitos");

    try {
      setLoading(true);
      // Paso 2: verifica OTP y crea usuario en el backend
      await authService.registerVerifyCode({ email, code });
      sessionStorage.removeItem("pendingReg");
      setMsg("Correo verificado. Cuenta creada.");
      onVerified?.();
    } catch (err) {
      onError?.(err.message || "Código inválido o expirado");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    const saved = JSON.parse(sessionStorage.getItem("pendingReg") || "null");
    if (!saved || saved.email !== email) return onError?.("No hay datos para reenviar.");
    try {
      onError?.("");
      setSecs(60);
      await authService.registerSendCode(saved);
      setMsg("Nuevo código enviado");
    } catch (err) {
      onError?.(err.message || "No se pudo reenviar el código");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <p className="text-slate-300 text-sm text-center">Hemos enviado un código a {email}</p>
      {msg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-emerald-400 text-sm text-center">
          {msg}
        </div>
      )}

      <div className="flex gap-2 justify-center" onPaste={onPaste}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <input
            key={i}
            ref={(el) => (inputsRef.current[i] = el)}
            inputMode="numeric"
            maxLength={1}
            className="w-12 h-12 text-center text-xl bg-slate-700/80 border border-slate-600/50 rounded-xl text-white"
            value={digits[i]}
            onChange={(e) => onChange(i, e.target.value)}
          />
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all disabled:opacity-60"
      >
        {loading ? "Verificando..." : "Confirmar"}
      </button>

      <div className="text-center text-sm text-slate-400">
        {secs > 0 ? (
          <>Reenviar código en {secs}s</>
        ) : (
          <button type="button" className="underline" onClick={resend}>
            Reenviar código
          </button>
        )}
      </div>

      <p className="text-center text-xs text-slate-500">El código expira en 15 minutos.</p>
    </form>
  );
};

EmailVerification.propTypes = {
  email: PropTypes.string.isRequired,
  onVerified: PropTypes.func,
  onError: PropTypes.func,
};
export default EmailVerification;
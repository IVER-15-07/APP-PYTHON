import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/auth.api';
import { teacherService } from '../../services/teacher.api';
import { BotonLink, Spinner, InputField } from "../components/ui" 

const Register = () => {
  const [searchParams] = useSearchParams();
  const rolParam = searchParams.get('rol'); // 'profesor' | 'estudiante' | 'usuario' | null
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    contrasena: '',
    confirmarContrasena: '',
    rol_usuarioId: rolParam === 'usuario' ? 5 : 4,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // variante por defecto para profesor (puedes convertir esto en control del formulario si lo necesitas)
  const [professorVariant] = useState('ejecutor'); // 'ejecutor' | 'editor'

  useEffect(() => {
    if (rolParam) {
      setFormData(prev => ({ ...prev, rol_usuarioId: rolParam === 'usuario' ? 5 : 4 }));
    }
  }, [rolParam]);

  const getRolMessage = () => {
    if (rolParam === 'profesor') return 'Crea tu cuenta de Profesor';
    if (rolParam === 'estudiante') return 'Crea tu cuenta de Estudiante';
    return 'Crea tu cuenta para comenzar';
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.contrasena !== formData.confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const datosRegistro = { ...formData };
      const response = await authService.register(datosRegistro);

      if (response.success) {
        if (rolParam === 'usuario') {
          const desiredRolId = professorVariant === 'ejecutor' ? 2 : 3;

          // intentar extraer token del response o del authService
          const token = response.data?.token || response.token || authService.obtenerToken?.();

          if (token) {
            try {
              await teacherService.requestRoleChange({ rolId: desiredRolId }, token);
              setSuccess('Registro exitoso. Solicitud de rol enviada al administrador.');
            } catch (errReq) {
              // si falla el envío aun con token, guardar para reintentar al iniciar sesión
              // eslint-disable-next-line no-console
              console.error('Error enviando solicitud:', errReq);
              localStorage.setItem('pendingRoleRequest', JSON.stringify({ rolId: desiredRolId }));
              setSuccess('Registro exitoso. Hubo un problema enviando la solicitud; se intentará enviar al iniciar sesión.');
            }
            setTimeout(() => navigate('/login'), 1500);
          } else {
            // no hay token: guardar petición para enviarla después al hacer login
            localStorage.setItem('pendingRoleRequest', JSON.stringify({ rolId: desiredRolId }));
            setSuccess('Registro exitoso. Inicia sesión para enviar la solicitud de rol al administrador.');
            setTimeout(() => navigate('/login'), 1500);
          }
        } else {
          setSuccess('¡Registro exitoso! Redirigiendo al login...');
          setTimeout(() => navigate('/login'), 1500);
        }
      } else {
        setError(response.message || 'Error en el registro');
      }
    } catch (err) {
        // eslint-disable-next-line no-console
      console.error(err);
      setError(err.message || 'Error en el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-5">
      <div className="bg-slate-800/90 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md shadow-2xl border border-slate-700/50">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-emerald-400 mb-2 drop-shadow-lg">PyLearn</h1>
          <p className="text-slate-400 text-sm">{getRolMessage()}</p>

          {rolParam && (
            <div className="mt-4 inline-flex items-center gap-2 bg-emerald-400/10 text-emerald-400 px-3 py-1 rounded-full text-sm">
              <span>{rolParam === 'profesor' ? '👨‍🏫' : '🎓'}</span>
              <span>Registrándote como {rolParam}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-6 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-6 text-green-400 text-sm text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre completo"
            required
            disabled={loading}
          />

          <InputField
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Correo electrónico"
            required
            disabled={loading}
          />

          <InputField
            name="contrasena"
            type="password"
            value={formData.contrasena}
            onChange={handleChange}
            placeholder="Contraseña"
            required
            disabled={loading}
          />

          <InputField
            name="confirmarContrasena"
            type="password"
            value={formData.confirmarContrasena}
            onChange={handleChange}
            placeholder="Confirmar contraseña"
            required
            disabled={loading}
          />

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Spinner />
                Creando cuenta...
              </div>
            ) : (
              `Crear Cuenta${rolParam ? ` de ${rolParam.charAt(0).toUpperCase() + rolParam.slice(1)}` : ''}`
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-slate-400 text-sm">
            ¿Ya tienes cuenta?{' '}
            <BotonLink
              to={rolParam ? `/login?rol=${rolParam}` : '/login'}
              variant="secondary"
            >
              Inicia Sesión{rolParam ? ` como ${rolParam}` : ''}
            </BotonLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

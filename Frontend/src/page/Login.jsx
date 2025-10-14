
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/auth.api';
import { firebaseAuthService } from '../../services/firebase.api';




const Login = () => {
  const [searchParams] = useSearchParams();
  const rolParam = searchParams.get('rol'); //  Leer rol de la URL

  const [formData, setFormData] = useState({
    email: '',
    contrasena: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const getRolMessage = () => {
    if (rolParam === 'profesor') {
      return 'Inicia sesión como Profesor';
    } else if (rolParam === 'estudiante') {
      return 'Inicia sesión como Estudiante';
    }
    return 'Logueate para continuar';
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authService.login(formData);
      if (response.success) {
        const user = response.data.usuario;
        console.log('Usuario logueado:', user);
        if (user.rol_usuarioId === 1) {
          navigate('/profesor');
        } else if (user.rol_usuarioId === 2) {
          navigate('/estudiante');
        } else {
          navigate('/login');
        }
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const firebaseResult = await firebaseAuthService.loginWithGoogle();

      console.log("firebaseResult:", firebaseResult);
      if (firebaseResult.success) {
        const roleId = rolParam === 'profesor' ? 1 : 2;
        const response = await authService.firebaseLogin(firebaseResult.data, roleId);
        if (response.success) {
          const user = response.data.usuario;
          if (user.rol_usuarioId === 1) navigate('/profesor');
          else if (user.rol_usuarioId === 2) navigate('/estudiante');
          else navigate('/login');
        }
      } else {
        setError(firebaseResult.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  
   const handleMicrosoftLogin = async () => {
      setLoading(true);
      setError('');
      try {
        const firebaseResult = await firebaseAuthService.loginWithMicrosoft();
  
        console.log("firebaseResult:", firebaseResult);
        if (firebaseResult.success) {
          const roleId = rolParam === 'profesor' ? 1 : 2;
          const response = await authService.firebaseLogin(firebaseResult.data, roleId);
          if (response.success) {
            const user = response.data.usuario;
            if (user.rol_usuarioId === 1) navigate('/profesor');
            else if (user.rol_usuarioId === 2) navigate('/estudiante');
            else navigate('/login');
          }
        } else {
          setError(firebaseResult.message);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }; 

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-5">

      <div className="bg-slate-800/90 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md shadow-2xl border border-slate-700/50">

        <button
          onClick={() => navigate('/')}
          aria-label="Cerrar"
          title="Cerrar"
          className="absolute top-3 right-3 text-slate-400 hover:text-white bg-transparent p-1 rounded-md"
        >
          ✕
        </button>

        {/* ...existing code... */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-6 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-emerald-400 mb-2 drop-shadow-lg">
            PyLearn
          </h1>
          <p className="text-slate-400 text-sm">
            {getRolMessage()}
          </p>

          {rolParam && (
            <div className="mt-4 inline-flex items-center gap-2 bg-emerald-400/10 text-emerald-400 px-3 py-1 rounded-full text-sm">
              <span>{rolParam === 'profesor' ? '👨‍🏫' : '🎓'}</span>
              <span>Inicia como {rolParam}</span> 
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-6 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          className="w-full py-4 bg-white text-gray-700 font-medium rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300/50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 mb-6"
          disabled={loading}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-gray-400/30 border-t-gray-600 rounded-full animate-spin"></div>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          )}
          {loading ? 'Logueándote...' :
            (rolParam ? `Continuar con Google` : 'Continuar con Google')
          }
        </button>

        <button
          onClick={handleMicrosoftLogin}
          className="w-full py-4 bg-white text-gray-700 font-medium rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300/50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 mb-6"
          disabled={loading}
          aria-label="Continuar con Microsoft"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-gray-400/30 border-t-gray-600 rounded-full animate-spin"></div>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <rect x="2" y="2" width="9" height="9" fill="#f35325" />
              <rect x="13" y="2" width="9" height="9" fill="#81bc06" />
              <rect x="2" y="13" width="9" height="9" fill="#05a6f0" />
              <rect x="13" y="13" width="9" height="9" fill="#ffba08" />
            </svg>

          )}
          {loading ? 'Logueándote...' :
            (rolParam ? `Continuar con Microsoft` : 'Continuar con Microsoft')
          }
        </button>

        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-600"></div>
          </div>
          <div className="relative bg-slate-800 px-4">
            <span className="text-slate-400 text-sm">o</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-4 bg-slate-700/80 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300 disabled:opacity-60"
              required
              disabled={loading}
            />
          </div>

          <div>
            <input
              type="password"
              name="contrasena"
              placeholder="Contraseña"
              value={formData.contrasena}
              onChange={handleChange}
              className="w-full px-4 py-4 bg-slate-700/80 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300 disabled:opacity-60"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Logueándote...
              </div>
            ) : (
              `Iniciar Sesión${rolParam ? ` como ${rolParam.charAt(0).toUpperCase() + rolParam.slice(1)}` : ''}` // ✅ TÉRMINO CORRECTO
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-slate-400 text-sm">
            ¿No tienes cuenta?{' '}
            <Link
              to={rolParam ? `/register?rol=${rolParam}` : '/register'}
              className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors duration-300 hover:underline"
            >
              Regístrate{rolParam ? ` como ${rolParam}` : ''}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
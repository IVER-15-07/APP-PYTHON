// Frontend/components/Register.jsx
import { useState ,useEffect} from 'react';
import { Link, useNavigate,useSearchParams } from 'react-router-dom';
import { authService } from '../../services/auth.api';

const Register = () => {
    const [searchParams] = useSearchParams();
    const rolParam = searchParams.get('rol'); // ✅ LEER ROL DE URL
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        contrasena: '',
        confirmarContrasena: '',
        rol_usuarioId: rolParam === 'profesor' ? 1 : 2 // ✅ ASIGNAR ROL POR DEFECTO
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();


        // ✅ ACTUALIZAR ROL CUANDO CAMBIE LA URL
    useEffect(() => {
        if (rolParam) {
            setFormData(prev => ({
                ...prev,
                rol_usuarioId: rolParam === 'profesor' ? 1 : 2
            }));
        }
    }, [rolParam]);

    // ✅ FUNCIÓN PARA MENSAJE DINÁMICO
    const getRolMessage = () => {
        if (rolParam === 'profesor') {
            return 'Crea tu cuenta de Profesor';
        } else if (rolParam === 'estudiante') {
            return 'Crea tu cuenta de Estudiante';
        }
        return 'Crea tu cuenta para comenzar';
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
        setSuccess('');

        // Validaciones frontend
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
            const { confirmarContrasena, ...datosRegistro } = formData;
            const response = await authService.register(datosRegistro);

            if (response.success) {
                setSuccess('¡Registro exitoso! Redirigiendo al login...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
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

                {/* Header dinámico */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-emerald-400 mb-2 drop-shadow-lg">
                        PyLearn
                    </h1>
                    <p className="text-slate-400 text-sm">
                        {getRolMessage()} {/* ✅ MENSAJE DINÁMICO */}
                    </p>
                    
                    {/* ✅ MOSTRAR ROL SELECCIONADO */}
                    {rolParam && (
                        <div className="mt-4 inline-flex items-center gap-2 bg-emerald-400/10 text-emerald-400 px-3 py-1 rounded-full text-sm">
                            <span>{rolParam === 'profesor' ? '👨‍🏫' : '🎓'}</span>
                            <span>Registrándote como {rolParam}</span>
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-6 text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-6 text-green-400 text-sm text-center">
                        {success}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Nombre */}
                    <div>
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Nombre completo"
                            value={formData.nombre}
                            onChange={handleChange}
                            className="w-full px-4 py-4 bg-slate-700/80 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300 disabled:opacity-60"
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Email */}
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

                    {/* Contraseña */}
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
                            minLength={6}
                        />
                    </div>

                    {/* Confirmar Contraseña */}
                    <div>
                        <input
                            type="password"
                            name="confirmarContrasena"
                            placeholder="Confirmar contraseña"
                            value={formData.confirmarContrasena}
                            onChange={handleChange}
                            className="w-full px-4 py-4 bg-slate-700/80 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300 disabled:opacity-60"
                            required
                            disabled={loading}
                            minLength={6}
                        />
                    </div>

                    {/* ✅ SOLO MOSTRAR SELECTOR SI NO HAY ROL EN URL */}
                    {!rolParam && (
                        <div className="space-y-3">
                            <label className="text-slate-300 text-sm font-medium block">
                                Tipo de cuenta
                            </label>
                            
                            <div className="space-y-3">
                                {/* Estudiante */}
                                <label className="flex items-center p-4 border border-slate-600 rounded-xl cursor-pointer hover:border-emerald-400 transition-colors">
                                    <input
                                        type="radio"
                                        name="rol_usuarioId"
                                        value="2"
                                        checked={formData.rol_usuarioId == 2}
                                        onChange={handleChange}
                                        className="mr-3 text-emerald-500"
                                        disabled={loading}
                                    />
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">🎓</span>
                                        <div>
                                            <div className="text-slate-200 font-medium">Estudiante</div>
                                            <div className="text-slate-400 text-sm">Quiero aprender programación</div>
                                        </div>
                                    </div>
                                </label>

                                {/* Profesor */}
                                <label className="flex items-center p-4 border border-slate-600 rounded-xl cursor-pointer hover:border-emerald-400 transition-colors">
                                    <input
                                        type="radio"
                                        name="rol_usuarioId"
                                        value="1"
                                        checked={formData.rol_usuarioId == 1}
                                        onChange={handleChange}
                                        className="mr-3 text-emerald-500"
                                        disabled={loading}
                                    />
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">👨‍🏫</span>
                                        <div>
                                            <div className="text-slate-200 font-medium">Profesor</div>
                                            <div className="text-slate-400 text-sm">Quiero enseñar programación</div>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Submit Button dinámico */}
                    <button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Creando cuenta...
                            </div>
                        ) : (
                            `Crear Cuenta${rolParam ? ` de ${rolParam.charAt(0).toUpperCase() + rolParam.slice(1)}` : ''}`
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-slate-400 text-sm">
                        ¿Ya tienes cuenta?{' '}
                        <Link
                            to={rolParam ? `/login?rol=${rolParam}` : '/login'}
                            className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors duration-300 hover:underline"
                        >
                            Inicia Sesión{rolParam ? ` como ${rolParam}` : ''}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};


export default Register;

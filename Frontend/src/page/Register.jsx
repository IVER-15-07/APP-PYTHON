// Frontend/components/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.api';

const Register = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        contrasena: '',
        confirmarContrasena: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

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

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-emerald-400 mb-2 drop-shadow-lg">
                        PyLearn
                    </h1>
                    <p className="text-slate-400 text-sm">
                        Crea tu cuenta para comenzar
                    </p>
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

                    {/* tipo de  roles  */}
                    <div className="space-y-3">
                        <label className="text-slate-300 text-sm font-medium block">
                            Tipo de cuenta
                        </label>

                        <div className="space-y-3">
                            {/* Estudiante */}
                            <label className="flex items-center gap-3 cursor-pointer">
                                <div className="relative">
                                    <input
                                        type="radio"
                                        name="rol_usuarioId"
                                        value={2}
                                        checked={formData.rol_usuarioId == 2}
                                        onChange={handleChange}
                                        className="sr-only"
                                        disabled={loading}
                                    />
                                    <div className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${formData.rol_usuarioId == 2
                                            ? 'border-emerald-400 bg-emerald-400'
                                            : 'border-slate-400'
                                        }`}>
                                        {formData.rol_usuarioId == 2 && (
                                            <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                                        )}
                                    </div>
                                </div>
                                <span className="text-2xl">🎓</span>
                                <div>
                                    <span className="text-white font-medium">Estudiante</span>
                                    <span className="text-slate-400 text-sm ml-2">- Quiero aprender Python</span>
                                </div>
                            </label>

                            {/* Profesor */}
                            <label className="flex items-center gap-3 cursor-pointer">
                                <div className="relative">
                                    <input
                                        type="radio"
                                        name="rol_usuarioId"
                                        value={1}
                                        checked={formData.rol_usuarioId == 1}
                                        onChange={handleChange}
                                        className="sr-only"
                                        disabled={loading}
                                    />
                                    <div className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${formData.rol_usuarioId == 1
                                            ? 'border-emerald-400 bg-emerald-400'
                                            : 'border-slate-400'
                                        }`}>
                                        {formData.rol_usuarioId == 1 && (
                                            <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                                        )}
                                    </div>
                                </div>
                                <span className="text-2xl">👨‍🏫</span>
                                <div>
                                    <span className="text-white font-medium">Profesor</span>
                                    <span className="text-slate-400 text-sm ml-2">- Quiero enseñar Python</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
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
                            'Crear Cuenta'
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-slate-400 text-sm">
                        ¿Ya tienes cuenta?{' '}
                        <Link
                            to="/login"
                            className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors duration-300 hover:underline"
                        >
                            Inicia Sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;

import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import EmailRegistration from '../components/steps/email-registration';
import EmailVerification from '../components/steps/email-verification';
import { CheckCircle2, AlertCircle, User, GraduationCap, X } from 'lucide-react';

const Register = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const rolParam = searchParams.get('rol'); // 'profesor' | 'estudiante' | 'usuario'
  const defaultRolId = rolParam === 'usuario' ? 5 : 4;

  const [step, setStep] = useState(0); // 0=Datos, 1=OTP, 2=Listo
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setError('');
    setSuccess('');
  }, [step]);

  const getRolMessage = () => {
    if (rolParam === 'usuario') return 'Crea tu cuenta de Usuario';
    if (rolParam === 'estudiante') return 'Crea tu cuenta de Estudiante';
    return 'Crea tu cuenta para comenzar';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-5">
      <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-2xl border border-slate-700/50">
        <button
          onClick={() => navigate("/")}
          aria-label="Cerrar"
          title="Cerrar"
          className="absolute top-4 right-4 text-slate-400 hover:text-white hover:bg-slate-700/50 p-2 rounded-lg transition-all duration-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            PyLearn
          </h1>
          <p className="text-slate-400 text-sm">{getRolMessage()}</p>
          {rolParam && (
            <div className="mt-4 inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-full text-sm font-medium shadow-lg shadow-green-500/10">
              {rolParam === 'usuario' ? (
                <User className="w-4 h-4" />
              ) : (
                <GraduationCap className="w-4 h-4" />
              )}
              <span>Registrándote como {rolParam}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="flex items-start gap-3 bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6 text-green-400 text-sm">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Indicador de pasos */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            {/* Línea de fondo */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-700/50 -translate-y-1/2 z-0"></div>
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-green-500 to-cyan-500 -translate-y-1/2 z-0 transition-all duration-300"
              style={{ width: `${(step / 2) * 100}%` }}
            ></div>

            {/* Pasos */}
            {[
              { num: 1, label: 'Datos' },
              { num: 2, label: 'Verificación' },
              { num: 3, label: 'Listo' }
            ].map((item, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                  step >= idx 
                    ? 'bg-gradient-to-r from-green-500 to-cyan-500 border-green-400 text-white shadow-lg shadow-green-500/30' 
                    : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}>
                  {step > idx ? <CheckCircle2 className="w-5 h-5" /> : item.num}
                </div>
                <span className={`text-xs font-medium ${step >= idx ? 'text-green-400' : 'text-slate-500'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {step === 0 && (
          <EmailRegistration
            defaultRolId={defaultRolId}
            onError={setError}
            onNext={(userEmail) => {
              setEmail(userEmail);
              setSuccess('Código enviado a tu correo');
              setStep(1);
            }}
          />
        )}

        {step === 1 && (
          <EmailVerification
            email={email}
            onError={setError}
            onVerified={() => {
              setSuccess('Cuenta creada y correo verificado');
              setStep(2);
            }}
          />
        )}

        {step === 2 && (
          <div className="text-center space-y-4 py-4">
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-green-500/30">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">¡Registro Completado!</h2>
              <p className="text-slate-400">Tu correo fue verificado correctamente</p>
              <p className="text-green-400 font-medium mt-1">{email}</p>
            </div>
            <Link
              to={rolParam ? `/login?rol=${rolParam}` : '/login'}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 border border-emerald-400/30 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Ir a iniciar sesión
            </Link>
          </div>
        )}

        {step < 2 && (
          <div className="text-center mt-6">
            <p className="text-slate-400 text-sm">
              ¿Ya tienes cuenta?{' '}
              <Link
                to={rolParam ? `/login?rol=${rolParam}` : '/login'}
                className="text-green-400 hover:text-green-300 font-semibold transition-colors duration-200 hover:underline"
              >
                Inicia Sesión{rolParam ? ` como ${rolParam}` : ''}
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
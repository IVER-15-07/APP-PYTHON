import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import EmailRegistration from '../componentes/steps/email-registration';
import EmailVerification from '../componentes/steps/email-verification';


const Register = () => {
  const [searchParams] = useSearchParams();
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
    if (rolParam === 'profesor') return 'Crea tu cuenta de Profesor';
    if (rolParam === 'estudiante') return 'Crea tu cuenta de Estudiante';
    return 'Crea tu cuenta para comenzar';
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

        {/* Indicador simple de pasos */}
        <ol className="flex items-center justify-center gap-6 mb-6 text-sm">
          <li className={`font-medium ${step >= 0 ? 'text-emerald-400' : 'text-slate-500'}`}>1. Datos</li>
          <li className={`font-medium ${step >= 1 ? 'text-emerald-400' : 'text-slate-500'}`}>2. Verificación</li>
          <li className={`font-medium ${step >= 2 ? 'text-emerald-400' : 'text-slate-500'}`}>3. Listo</li>
        </ol>

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
          <div className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="text-emerald-600 text-2xl">✓</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Registro Completado</h2>
            <p className="text-slate-300">Tu correo fue verificado: {email}</p>
            <Link
              to="/login"
              className="inline-block mt-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
            >
              Ir a iniciar sesión
            </Link>
          </div>
        )}

        <div className="text-center mt-6">
          <p className="text-slate-400 text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link
              to={rolParam ? `/login?rol=${rolParam}` : '/login'}
              className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors hover:underline"
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

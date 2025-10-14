
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../services/auth.api';
import { coursesService } from '../../../services/course.api';

const generateRandomCode = (length = 6) => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
};

const Course = () => {
  const navigate = useNavigate();
  const [user] = useState(authService.obtenerUsuarioActual());
  const [form, setForm] = useState({ title: '', description: '', level: 'Básico', code: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (!user) return navigate('/login');
    fetchCourses();
    // eslint-disable-next-line
  }, [user]);

  const fetchCourses = async () => {
    try {
      const res = await coursesService.getMyCourses();
      const data = res?.data ?? res ?? [];
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleGenerateCode = () => {
    setForm({ ...form, code: generateRandomCode(6) });
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // opcional: mostrar notificación
    } catch (err) {
      console.error('No se pudo copiar', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // si no se proporcionó código, generar uno automáticamente
      const finalCode = form.code?.trim() || generateRandomCode(6);
      const payload = { title: form.title, description: form.description, level: form.level, code: finalCode, profesorId: user.id };
      await coursesService.createCourse(payload);
      setForm({ title: '', description: '', level: 'Básico', code: '' });
      await fetchCourses();
    } catch (err) {
      setError(err.message || err?.response?.data?.message || 'Error al crear curso');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-200">Mis cursos</h1>
          <div className="text-sm text-slate-400">Profesor: <span className="font-medium text-slate-100">{user?.nombre}</span></div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario - ocupa 2 columnas en pantallas grandes */}
          <section className="lg:col-span-2 bg-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-slate-200 mb-4">Crear nuevo curso</h2>

            {error && <div className="mb-4 text-sm text-red-400 bg-red-500/5 p-3 rounded">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Título del curso"
                required
                className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white placeholder-slate-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                disabled={loading}
              />

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Descripción breve"
                rows={5}
                className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white placeholder-slate-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                disabled={loading}
              />

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <select
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  className="px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600"
                  disabled={loading}
                >
                  <option>Básico</option>
                  <option>Intermedio</option>
                  <option>Avanzado</option>
                </select>

                <div className="flex-1" />

                <div className="flex gap-2 items-center">
                  <input
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    placeholder="Código del curso (opcional)"
                    className="px-3 py-2 rounded-lg bg-slate-700 text-white border border-slate-600"
                    disabled={loading}
                  />
                  <button type="button" onClick={handleGenerateCode} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                    Generar código
                  </button>
                </div>

                <div className="hidden sm:block" />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition"
                >
                  {loading ? 'Creando...' : 'Crear curso'}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/profesor')}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition"
                >
                  Volver
                </button>
              </div>
            </form>
          </section>

          {/* Sidebar / Resumen rápido */}
          <aside className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <h3 className="text-sm font-medium text-slate-200 mb-2">Resumen</h3>
            <p className="text-sm text-slate-400 mb-4">Crea cursos para tus estudiantes. Comparte el código para que se inscriban.</p>
            <div className="text-xs text-slate-400">Total cursos</div>
            <div className="text-2xl font-semibold text-emerald-400">{courses.length}</div>
          </aside>
        </div>

        {/* Lista de cursos */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-slate-200 mb-4">Cursos creados</h2>

          {courses.length === 0 ? (
            <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-8 text-center text-slate-400">
              <div className="text-4xl mb-3">📚</div>
              <div className="font-medium mb-1">Aún no tienes cursos</div>
              <div className="text-sm">Crea tu primer curso usando el formulario.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((c) => (
                <article key={c.id} className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 hover:scale-[1.01] transition-transform shadow-sm">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-100">{c.title}</h3>
                      <p className="text-slate-400 text-sm mt-2 line-clamp-3">{c.description}</p>
                    </div>
                    <div className="text-sm text-slate-400">{c.level}</div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span>ID: {c.id}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => { /* editar */ }} className="px-2 py-1 bg-slate-700 text-slate-200 rounded hover:bg-slate-600 text-xs">Editar</button>
                      <button onClick={() => { /* eliminar */ }} className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-500 text-xs">Eliminar</button>
                    </div>
                  </div>

                  {/* Código del curso y copiar */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-sm text-slate-300">Código para inscripción:</div>
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1 bg-slate-700 text-slate-100 rounded-md font-mono text-sm">{c.code || '—'}</div>
                      <button onClick={() => copyToClipboard(c.code || '')} className="px-2 py-1 bg-emerald-500 text-white rounded-md text-xs">Copiar</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Course;

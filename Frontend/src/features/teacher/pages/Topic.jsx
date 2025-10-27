import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../../services/auth.api.js';
import { coursesService } from '../../../../services/group.api';
import { Library } from 'lucide-react';
import { TopicForm, SummarySidebar, GroupCard } from '../components';

const Topic = () => {
    const navigate = useNavigate();
    const [user] = useState(authService.obtenerUsuarioActual());
    const [form, setForm] = useState({ title: '', description: '', contentType: '', level: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [topics, setTopics] = useState([]);
    const [copied, setCopied] = useState(null);

    useEffect(() => {
        if (!user) return navigate('/login');
        fetchTopics();
        // eslint-disable-next-line
    }, [user]);

    const fetchTopics = async () => {
        try {
            const res = await coursesService.getMyCourses();
            const data = res?.data ?? res ?? [];
            setTopics(Array.isArray(data) ? data : []);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (error) setError(''); // Limpia el error cuando el usuario edita
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            if (error) setError('');
        }
    };

    const copyToClipboard = async (text, id) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(id);
            setTimeout(() => setCopied(null), 2000);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('No se pudo copiar', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        if (!selectedFile) {
            setError('Por favor selecciona un archivo');
            setLoading(false);
            return;
        }

        try {
            // Crear FormData para enviar archivo
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('description', form.description);
            formData.append('contentType', form.contentType);
            formData.append('level', form.level);
            formData.append('file', selectedFile);
            formData.append('profesorId', user.id);

            // Aquí debes llamar a tu servicio API que maneje FormData
            // await topicService.createTopic(formData);
            
            // Por ahora simulo el éxito
            // eslint-disable-next-line no-console
            console.log('FormData a enviar:', {
                title: form.title,
                description: form.description,
                contentType: form.contentType,
                level: form.level,
                fileName: selectedFile.name,
                fileSize: selectedFile.size,
                profesorId: user.id
            });

            // Limpiar formulario
            setForm({ title: '', description: '', contentType: '', level: '' });
            setSelectedFile(null);
            await fetchTopics();
        } catch (err) {
            setError(err.message || err?.response?.data?.message || 'Error al crear tópico');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 lg:p-10">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <header className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="text-green-400 bg-green-500/10 p-2 rounded-lg border border-green-500/30 shadow-lg shadow-green-500/20">
                            <Library className="w-5 h-5" />
                        </div>
                        <h1 className="text-3xl font-bold text-white">Mis tópicos</h1>
                    </div>
                    <p className="text-slate-400 ml-14">
                        Profesor: <span className="font-semibold text-white">{user?.nombre}</span>
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Formulario (ahora como componente) */}
                    <TopicForm
                        form={form}
                        onChange={handleChange}
                        onFileChange={handleFileChange}
                        onSubmit={handleSubmit}
                        loading={loading}
                        error={error}
                        selectedFile={selectedFile}
                        cancel={() => {
                            setForm({ title: '', description: '', contentType: '', level: '' });
                            setSelectedFile(null);
                            setError('');
                        }}
                    />

                    {/* Sidebar resumen (componente) */}
                    <SummarySidebar topicsCount={topics.length} />
                </div>

                {/* Lista de grupos */}
                <section className="mt-10">
                    <h2 className="text-2xl font-bold text-white mb-6">Tópicos creados</h2>

                    {topics.length === 0 ? (
                        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center shadow-2xl">
                            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Library className="w-10 h-10 text-slate-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-300 mb-2">Aún no tienes tópicos</h3>
                            <p className="text-slate-500 text-sm">Crea tu primer tópico usando el formulario de arriba.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {topics.map((t) => (
                                <GroupCard key={t.id} t={t} copied={copied} onCopy={copyToClipboard} onEdit={() => { }} onDelete={() => { }} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Topic;

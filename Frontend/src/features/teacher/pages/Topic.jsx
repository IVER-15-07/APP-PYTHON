import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../../services/auth.api.js';
import { topicsService } from '../../../../services/topic.api.js';
import { Library, FileText, Video, Presentation } from 'lucide-react';
import { TopicForm, TopicSummary, TopicCard } from '../components';

const Topic = () => {
    const navigate = useNavigate();
    const [user] = useState(authService.obtenerUsuarioActual());
    const [form, setForm] = useState({ title: '', description: '', contentType: '', level: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [topics, setTopics] = useState([]);
    const [topicTypes, setTopicTypes] = useState([]);
    const [levels, setLevels] = useState([]);

    useEffect(() => {
        if (!user) return navigate('/login');
        fetchTopics();
        fetchTopicTypes();
        fetchLevels();
        // eslint-disable-next-line
    }, [user]);

    const fetchTopics = async () => {
        try {
            const response = await topicsService.getAllTopics();
            // El backend retorna { success: true, data: [...] }
            const topicsData = response?.data || [];
            setTopics(Array.isArray(topicsData) ? topicsData : []);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Error al obtener tópicos:', err);
        }
    };

    const fetchTopicTypes = async () => {
        try {
            const response = await topicsService.getTopicTypes();
            const typesData = response?.data || [];
            setTopicTypes(Array.isArray(typesData) ? typesData : []);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Error al obtener tipos de tópico:', err);
        }
    };

    const fetchLevels = async () => {
        try {
            const response = await topicsService.getLevels();
            const levelsData = response?.data || [];
            setLevels(Array.isArray(levelsData) ? levelsData : []);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Error al obtener niveles:', err);
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

    const handleEditTopic = (topic) => {
        // eslint-disable-next-line no-console
        console.log('Editar tópico:', topic);
        // TODO: Implementar lógica de edición
    };

    // Filtrar tópicos por tipo
    const textoTopics = topics.filter(t => t.contentType === 'texto');
    const videoTopics = topics.filter(t => t.contentType === 'video');
    const slidesTopics = topics.filter(t => t.contentType === 'slides');

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
                    {/* Formulario */}
                    <TopicForm
                        form={form}
                        onChange={handleChange}
                        onFileChange={handleFileChange}
                        onSubmit={handleSubmit}
                        loading={loading}
                        error={error}
                        selectedFile={selectedFile}
                        topicTypes={topicTypes}
                        levels={levels}
                        cancel={() => {
                            setForm({ title: '', description: '', contentType: '', level: '' });
                            setSelectedFile(null);
                            setError('');
                        }}
                    />

                    {/* Resumen de tópicos */}
                    <TopicSummary topics={topics} />
                </div>

                {/* Lista de tópicos organizados por tipo */}
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
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Columna 1: Tópicos de Texto */}
                            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/30">
                                        <FileText className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white">Texto</h3>
                                    <span className="ml-auto text-sm font-semibold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/30">
                                        {textoTopics.length}
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {textoTopics.length === 0 ? (
                                        <p className="text-sm text-slate-500 text-center py-8">No hay tópicos de texto</p>
                                    ) : (
                                        textoTopics.map((topic) => (
                                            <TopicCard key={topic.id} topic={topic} onEdit={handleEditTopic} />
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Columna 2: Tópicos de Video */}
                            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/30">
                                        <Video className="w-5 h-5 text-red-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white">Video</h3>
                                    <span className="ml-auto text-sm font-semibold text-red-400 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/30">
                                        {videoTopics.length}
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {videoTopics.length === 0 ? (
                                        <p className="text-sm text-slate-500 text-center py-8">No hay tópicos de video</p>
                                    ) : (
                                        videoTopics.map((topic) => (
                                            <TopicCard key={topic.id} topic={topic} onEdit={handleEditTopic} />
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Columna 3: Tópicos de Slides */}
                            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/30">
                                        <Presentation className="w-5 h-5 text-orange-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white">Slides</h3>
                                    <span className="ml-auto text-sm font-semibold text-orange-400 bg-orange-500/10 px-2 py-1 rounded-full border border-orange-500/30">
                                        {slidesTopics.length}
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {slidesTopics.length === 0 ? (
                                        <p className="text-sm text-slate-500 text-center py-8">No hay tópicos de slides</p>
                                    ) : (
                                        slidesTopics.map((topic) => (
                                            <TopicCard key={topic.id} topic={topic} onEdit={handleEditTopic} />
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Topic;

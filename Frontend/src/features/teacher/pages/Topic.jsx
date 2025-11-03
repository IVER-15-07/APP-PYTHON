import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../../services/auth.api.js';
import { topicsService } from '../../../../services/topic.api.js';
import { Library, FileText, Video, Presentation, Plus } from 'lucide-react';
import { TopicForm, TopicSummary } from '../components';

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
    const [isModalOpen, setIsModalOpen] = useState(false);

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
            // Preparar datos para el backend
            const topicData = {
                nombre: form.title,
                tipo_topicoId: Number(form.contentType),  // Convertir a número
                nivelId: Number(form.level),              // Convertir a número
                aprobado: false
            };

            // Archivos en array (backend espera 'files' en plural)
            const files = [selectedFile];

            // eslint-disable-next-line no-console
            console.log('Datos a enviar:', topicData);
            // eslint-disable-next-line no-console
            console.log('Archivos a enviar:', files);

            // Llamar al servicio para crear el tópico
            const response = await topicsService.createTopic(topicData, files);

            // eslint-disable-next-line no-console
            console.log('Tópico creado exitosamente:', response);

            // Limpiar formulario
            setForm({ title: '', description: '', contentType: '', level: '' });
            setSelectedFile(null);
            setIsModalOpen(false); // Cerrar modal después de crear

            // Recargar la lista de tópicos
            await fetchTopics();

        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Error al crear tópico:', err);
            setError(err.message || 'Error al crear el tópico');
        } finally {
            setLoading(false);
        }
    };

    const handleEditTopic = (topic) => {
        // eslint-disable-next-line no-console
        console.log('Editar tópico:', topic);
        // TODO: Implementar lógica de edición
    };

    // Obtener el nombre del tipo de tópico
    const getTopicTypeName = (tipo_topicoId) => {
        const type = topicTypes.find(t => t.id === tipo_topicoId);
        return type ? type.nombre : 'Desconocido';
    };

    // Obtener el ícono y color según el tipo
    const getTopicTypeIcon = (tipo_topicoId) => {
        switch (tipo_topicoId) {
            case 1:
                return { icon: FileText, color: 'blue' };
            case 2:
                return { icon: Video, color: 'red' };
            case 3:
                return { icon: Presentation, color: 'orange' };
            default:
                return { icon: FileText, color: 'gray' };
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 lg:p-10">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <header className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="text-green-400 bg-green-500/10 p-2 rounded-lg border border-green-500/30 shadow-lg shadow-green-500/20">
                                <Library className="w-5 h-5" />
                            </div>
                            <h1 className="text-3xl font-bold text-white">Mis tópicos</h1>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 border border-emerald-400/30"
                        >
                            <Plus className="w-5 h-5" />
                            Nuevo tópico
                        </button>
                    </div>
                    <p className="text-slate-400 ml-14">
                        Profesor: <span className="font-semibold text-white">{user?.nombre}</span>
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Lista de tópicos - Ocupa 3 columnas */}
                    <section className="lg:col-span-3">
                        <h2 className="text-2xl font-bold text-white mb-6">Tópicos creados</h2>

                        {topics.length === 0 ? (
                            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center shadow-2xl">
                                <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Library className="w-10 h-10 text-slate-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-300 mb-2">Aún no tienes tópicos</h3>
                                <p className="text-slate-500 text-sm">Crea tu primer tópico usando el botón de arriba.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {topics.map((topic) => {
                                    const { icon: Icon, color } = getTopicTypeIcon(topic.tipo_topicoId);
                                    const typeName = getTopicTypeName(topic.tipo_topicoId);
                                    
                                    return (
                                        <div
                                            key={topic.id}
                                            className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl hover:border-slate-600/50 transition-all duration-200 group"
                                        >
                                            {/* Header de la card */}
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className={`p-3 bg-${color}-500/10 rounded-xl border border-${color}-500/30 group-hover:scale-110 transition-transform`}>
                                                    <Icon className={`w-6 h-6 text-${color}-400`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg font-bold text-white mb-1 truncate">
                                                        {topic.nombre}
                                                    </h3>
                                                    <p className="text-sm text-slate-400 capitalize">
                                                        {typeName}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Información adicional */}
                                            <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                                                <div className="flex items-center gap-2">
                                                    {topic.aprobado ? (
                                                        <span className="text-xs px-2 py-1 bg-green-500/10 text-green-400 rounded-lg border border-green-500/30 font-medium">
                                                            Aprobado
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded-lg border border-yellow-500/30 font-medium">
                                                            Pendiente
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleEditTopic(topic)}
                                                    className="text-sm text-slate-400 hover:text-white transition-colors font-medium"
                                                >
                                                    Ver detalles
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    {/* Resumen de tópicos - Sidebar derecho */}
                    <aside className="lg:col-span-1">
                        <TopicSummary topics={topics} />
                    </aside>
                </div>
            </div>

            {/* Modal para crear tópico */}
            {isModalOpen && (
                <TopicForm
                    isModal={true}
                    onClose={() => setIsModalOpen(false)}
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
            )}
        </div>
    );
};

export default Topic;

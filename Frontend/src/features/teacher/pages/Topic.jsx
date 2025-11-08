import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../../services/auth.api.js';
import { topicsService } from '../../../../services/topic.api.js';
import { Library } from 'lucide-react';
import { TopicForm, TopicSummary, FilePreview, TopicCarousel } from '../components';
import { CreateButton } from '../../../components/ui';
import mammoth from 'mammoth';

const Topic = () => {
    const navigate = useNavigate();
    const [user] = useState(authService.obtenerUsuarioActual());
    const [form, setForm] = useState({ title: '', description: '', contentType: '', level: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null); // Imagen adicional para tipo texto
    const [textPreview, setTextPreview] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [videoPreview, setVideoPreview] = useState('');
    const [pdfPreview, setPdfPreview] = useState('');
    const [docxPreview, setDocxPreview] = useState('');
    const [selectedImagePreview, setSelectedImagePreview] = useState(''); // Para imagen ADICIONAL
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [topics, setTopics] = useState([]);
    const [topicTypes, setTopicTypes] = useState([]);
    const [levels, setLevels] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    // useEffect para cargar datos iniciales
    useEffect(() => {
        if (!user) return navigate('/login');
        fetchTopics();
        fetchTopicTypes();
        fetchLevels();
        // eslint-disable-next-line
    }, [user]);

    // useEffect para limpiar Object URLs cuando se desmonta el componente
    useEffect(() => {
        return () => {
            if (imagePreview && imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
            if (videoPreview && videoPreview.startsWith('blob:')) {
                URL.revokeObjectURL(videoPreview);
            }
            if (pdfPreview && pdfPreview.startsWith('blob:')) {
                URL.revokeObjectURL(pdfPreview);
            }
            if (selectedImagePreview && selectedImagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(selectedImagePreview);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Array vacío = solo se ejecuta al desmontar

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

        // Limpiar previsualizaciones anteriores
        setTextPreview('');
        setImagePreview('');
        setVideoPreview('');
        setPdfPreview('');
        setDocxPreview('');

        const fileType = file.type;
        const fileName = file.name.toLowerCase();

        // Preview para TEXTO (.txt, .md)
        if (form.contentType === '1' &&
            (fileType === 'text/plain' || fileName.endsWith('.txt') || fileName.endsWith('.md'))) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setTextPreview(event.target.result);
            };
            reader.onerror = () => {
                setTextPreview('❌ Error al leer el archivo de texto');
            };
            reader.readAsText(file);
        }
        // Preview para IMÁGENES
        else if (fileType.startsWith('image/')) {
            const objectUrl = URL.createObjectURL(file);
            setImagePreview(objectUrl);
        }
        // Preview para WORD (.docx)
        else if (form.contentType === '1' && 
            (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
             fileName.endsWith('.docx'))) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const arrayBuffer = event.target.result;
                    const result = await mammoth.convertToHtml({ arrayBuffer });
                    setDocxPreview(result.value); // HTML convertido
                } catch {
                    setDocxPreview('❌ Error al leer el archivo Word');
                }
            };
            reader.onerror = () => {
                setDocxPreview('❌ Error al leer el archivo Word');
            };
            reader.readAsArrayBuffer(file);
        }

        // Preview para VIDEOS
        else if (form.contentType === '2' && fileType.startsWith('video/')) {
            const objectUrl = URL.createObjectURL(file);
            setVideoPreview(objectUrl);
        }
        // Preview para PDFs
        else if (fileName.endsWith('.pdf')) {
            const objectUrl = URL.createObjectURL(file);
            setPdfPreview(objectUrl);
        }
    }
};

const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setSelectedImage(file);
        if (error) setError('');

        if (file.type.startsWith('image/')) {
            const objectUrl = URL.createObjectURL(file);
            setSelectedImagePreview(objectUrl);
        }
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

        // Si es tipo texto (1) y hay imagen, enviar ambos archivos
        if (form.contentType === '1' && selectedImage) {
            files.push(selectedImage);
        }

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
        setSelectedImage(null);
        setTextPreview('');
        setImagePreview('');
        setVideoPreview('');
        setPdfPreview('');
        setDocxPreview('');
        setSelectedImagePreview('');
        setCurrentStep(1); // Resetear al paso 1
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

return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 lg:p-10">
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <header className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">Mis Tópicos</h1>
                        <p className="text-slate-400">Administra el contenido educativo de tus cursos</p>
                    </div>
                    <CreateButton onClick={() => setIsModalOpen(true)}>
                        Nuevo tópico
                    </CreateButton>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Lista de tópicos - Ocupa 3 columnas */}
                <section className="lg:col-span-3 space-y-8">
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
                        <>
                            {/* Agrupar tópicos por nivel y crear un carrusel para cada uno */}
                            {levels.map((level) => {
                                const topicsByLevel = topics.filter(topic => topic.nivelId === level.id);
                                
                                if (topicsByLevel.length === 0) return null;

                                return (
                                    <TopicCarousel 
                                        key={level.id}
                                        levelName={level.nombre}
                                        topics={topicsByLevel}
                                        onEdit={handleEditTopic}
                                    />
                                );
                            })}
                        </>
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
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        {currentStep === 1 ? (
                            <TopicForm
                                isModal={false}
                                onClose={() => {
                                    setIsModalOpen(false);
                                    setCurrentStep(1);
                                }}
                                form={form}
                                onChange={handleChange}
                                onFileChange={handleFileChange}
                                onImageChange={handleImageChange}
                                onSubmit={handleSubmit}
                                onShowPreview={() => setCurrentStep(2)}
                                loading={loading}
                                error={error}
                                selectedFile={selectedFile}
                                selectedImage={selectedImage}
                                textPreview={textPreview}
                                imagePreview={imagePreview}
                                videoPreview={videoPreview}
                                pdfPreview={pdfPreview}
                                docxPreview={docxPreview}
                                selectedImagePreview={selectedImagePreview}
                                topicTypes={topicTypes}
                                levels={levels}
                                cancel={() => {
                                    setForm({ title: '', description: '', contentType: '', level: '' });
                                    setSelectedFile(null);
                                    setSelectedImage(null);
                                    setTextPreview('');
                                    setImagePreview('');
                                    setVideoPreview('');
                                    setPdfPreview('');
                                    setDocxPreview('');
                                    setSelectedImagePreview('');
                                    setError('');
                                    setIsModalOpen(false);
                                    setCurrentStep(1);
                                }}
                            />
                        ) : (
                            <FilePreview
                                selectedFile={selectedFile}
                                selectedImage={selectedImage}
                                textPreview={textPreview}
                                imagePreview={imagePreview}
                                videoPreview={videoPreview}
                                pdfPreview={pdfPreview}
                                docxPreview={docxPreview}
                                selectedImagePreview={selectedImagePreview}
                                onBack={() => setCurrentStep(1)}
                                onSubmit={handleSubmit}
                                loading={loading}
                            />
                        )}
                    </div>
                </div>
            </div>
        )}
    </div>
);
};

export default Topic;

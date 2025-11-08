import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../../services/auth.api.js';
import { Library } from 'lucide-react';
import { TopicForm, TopicSummary, FilePreview, TopicCarousel } from '../components';
import { CreateButton } from '../../../components/ui';
import { useTopicData, useTopicForm, useFilePreview } from '../hooks';

const Topic = () => {
    const navigate = useNavigate();
    const [user] = useState(authService.obtenerUsuarioActual());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    // Custom hooks
    const { topics, topicTypes, levels, fetchTopics } = useTopicData(user);
    
    const {
        form,
        loading,
        error,
        isEditMode,
        editingTopicId,
        handleChange,
        resetForm,
        loadTopicForEdit,
        submitTopic,
    } = useTopicForm(fetchTopics);

    const {
        selectedFile,
        selectedImage,
        textPreview,
        imagePreview,
        videoPreview,
        pdfPreview,
        docxPreview,
        selectedImagePreview,
        handleFileChange,
        handleImageChange,
        clearAll,
    } = useFilePreview();

    // Redirect si no hay usuario
    if (!user) {
        navigate('/login');
        return null;
    }

    const handleOpenModal = () => {
        resetForm();
        clearAll();
        setIsModalOpen(true);
        setCurrentStep(1);
    };

    const handleCloseModal = () => {
        resetForm();
        clearAll();
        setIsModalOpen(false);
        setCurrentStep(1);
    };

    const handleEditTopic = (topic) => {
        // eslint-disable-next-line no-console
        console.log('Editar tópico:', topic);
        loadTopicForEdit(topic);
        clearAll();
        setIsModalOpen(true);
        setCurrentStep(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await submitTopic(selectedFile, selectedImage);
        if (success) {
            handleCloseModal();
        }
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
                    <CreateButton onClick={handleOpenModal}>
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
                                onClose={handleCloseModal}
                                form={form}
                                onChange={handleChange}
                                onFileChange={(e) => handleFileChange(e.target.files[0], form.contentType)}
                                onImageChange={(e) => handleImageChange(e.target.files[0])}
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
                                cancel={handleCloseModal}
                                isEditMode={isEditMode}
                                topicId={editingTopicId}
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

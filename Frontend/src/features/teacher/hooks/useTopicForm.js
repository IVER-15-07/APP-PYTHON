import { useState } from 'react';
import { topicsService } from '../../../../services/topic.api.js';

export const useTopicForm = (onSuccess) => {
    const [form, setForm] = useState({ 
        title: '', 
        description: '', 
        contentType: '', 
        level: '' 
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingTopicId, setEditingTopicId] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const resetForm = () => {
        setForm({ title: '', description: '', contentType: '', level: '' });
        setIsEditMode(false);
        setEditingTopicId(null);
        setError('');
    };

    const loadTopicForEdit = (topic) => {
        setForm({
            title: topic.nombre || '',
            description: topic.descripcion || '',
            contentType: topic.tipo_topicoId?.toString() || '',
            level: topic.nivelId?.toString() || ''
        });
        setIsEditMode(true);
        setEditingTopicId(topic.id);
    };

    const submitTopic = async (selectedFile, selectedImage) => {
        setLoading(true);
        setError('');

        if (!selectedFile) {
            setError('Por favor selecciona un archivo');
            setLoading(false);
            return false;
        }

        try {
            const topicData = {
                nombre: form.title,
                tipo_topicoId: parseInt(form.contentType),
                nivelId: parseInt(form.level)
            };

            const files = [selectedFile];
            if (form.contentType === '1' && selectedImage) {
                files.push(selectedImage);
            }

            if (isEditMode && editingTopicId) {
                //Implementar actualización cuando editar topico este listo
                setError('La funcionalidad de edición estará disponible próximamente');
                setLoading(false);
                return false;
            }

            // Crear nuevo tópico
            await topicsService.createTopic(topicData, files);
            
            resetForm();
            if (onSuccess) await onSuccess();
            
            return true;
        } catch (err) {
            setError(err.message || 'Error al guardar el tópico');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        form,
        loading,
        error,
        isEditMode,
        editingTopicId,
        handleChange,
        resetForm,
        loadTopicForEdit,
        submitTopic,
        setError,
    };
};

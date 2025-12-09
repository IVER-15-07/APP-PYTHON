import { useState, useEffect } from 'react';
import { topicsService } from '../../../../services/topic.api.js';

export const useTopicData = (user) => {
    const [topics, setTopics] = useState([]);
    const [topicTypes, setTopicTypes] = useState([]);
    const [levels, setLevels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTopics = async () => {
        try {
            // Obtener solo los tópicos creados por el usuario actual
            const response = user?.id 
                ? await topicsService.getTopicsByCreator(user.id)
                : await topicsService.getAllTopics();
            const topicsData = response?.data || [];
            setTopics(Array.isArray(topicsData) ? topicsData : []);
        } catch (err) {
            setError(err.message);
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
            setError(err.message);
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
            setError(err.message);
        }
    };

    const fetchAll = async () => {
        setLoading(true);
        setError(null);
        try {
            await Promise.all([
                fetchTopics(),
                fetchTopicTypes(),
                fetchLevels()
            ]);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Error al cargar datos:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchAll();
        }
        // eslint-disable-next-line
    }, [user]);

    return {
        topics,
        topicTypes,
        levels,
        loading,
        error,
        fetchTopics,
        fetchAll,
    };
};

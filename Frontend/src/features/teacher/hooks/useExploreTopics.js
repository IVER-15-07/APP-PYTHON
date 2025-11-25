import { useState, useEffect } from 'react';
import { topicsService } from '../../../../services/topic.api.js';

export const useExploreTopics = () => {
    const [allTopics, setAllTopics] = useState([]);
    const [filteredTopics, setFilteredTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Filtros
    const [selectedCourse, setSelectedCourse] = useState('all');
    const [selectedLevel, setSelectedLevel] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Obtener todos los tópicos
    useEffect(() => {
        const fetchAllTopics = async () => {
            try {
                setLoading(true);
                const response = await topicsService.getAllTopics();
                // Manejar diferentes estructuras de respuesta
                const data = Array.isArray(response) ? response : 
                             Array.isArray(response?.data) ? response.data : 
                             Array.isArray(response?.topics) ? response.topics : [];
                setAllTopics(data);
                setFilteredTopics(data);
                setError(null);
            } catch (err) {
                setError(err.message || 'Error al cargar los tópicos');
                setAllTopics([]);
                setFilteredTopics([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAllTopics();
    }, []);

    // Aplicar filtros
    useEffect(() => {
        let result = [...allTopics];

        // Filtrar por curso
        if (selectedCourse !== 'all') {
            result = result.filter(topic => 
                topic.nivel?.cursoId?.toString() === selectedCourse.toString()
            );
        }

        // Filtrar por nivel
        if (selectedLevel !== 'all') {
            result = result.filter(topic => 
                topic.nivelId?.toString() === selectedLevel.toString()
            );
        }

        // Filtrar por tipo
        if (selectedType !== 'all') {
            result = result.filter(topic => 
                topic.tipo_topicoId?.toString() === selectedType.toString()
            );
        }

        // Filtrar por búsqueda
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(topic =>
                topic.nombre?.toLowerCase().includes(query) ||
                topic.nivel?.nombre?.toLowerCase().includes(query)
            );
        }

        setFilteredTopics(result);
    }, [allTopics, selectedCourse, selectedLevel, selectedType, searchQuery]);

    // Obtener listas únicas para filtros (con protección de array)
    const courses = [...new Map(
        (Array.isArray(allTopics) ? allTopics : [])
            .filter(t => t.nivel?.curso)
            .map(t => [t.nivel.curso.id, t.nivel.curso])
    ).values()];

    const levels = [...new Map(
        (Array.isArray(allTopics) ? allTopics : [])
            .filter(t => t.nivel)
            .map(t => [t.nivel.id, t.nivel])
    ).values()];

    const types = [...new Map(
        (Array.isArray(allTopics) ? allTopics : [])
            .filter(t => t.tipo_topico)
            .map(t => [t.tipo_topico.id, t.tipo_topico])
    ).values()];

    // Agrupar por nivel (con protección de array)
    const topicsByLevel = (Array.isArray(filteredTopics) ? filteredTopics : []).reduce((acc, topic) => {
        const levelName = topic.nivel?.nombre || 'Sin nivel';
        if (!acc[levelName]) {
            acc[levelName] = [];
        }
        acc[levelName].push(topic);
        return acc;
    }, {});

    return {
        // Datos
        allTopics,
        filteredTopics,
        topicsByLevel,
        loading,
        error,
        
        // Filtros disponibles
        courses,
        levels,
        types,
        
        // Estados de filtros
        selectedCourse,
        selectedLevel,
        selectedType,
        searchQuery,
        
        // Setters de filtros
        setSelectedCourse,
        setSelectedLevel,
        setSelectedType,
        setSearchQuery,
        
        // Funciones útiles
        resetFilters: () => {
            setSelectedCourse('all');
            setSelectedLevel('all');
            setSelectedType('all');
            setSearchQuery('');
        },
    };
};

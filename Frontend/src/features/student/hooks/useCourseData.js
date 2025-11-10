import { useState, useEffect } from 'react';
import { coursesService } from '../../../../services/courses.api.js';
import { topicsService } from '../../../../services/topic.api.js';
import { grupoService } from '../services/grupo.api.js';
import { authService } from '../../../../services/auth.api.js';

export const useCourseData = () => {
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const response = await coursesService.getCourses();
        const cursos = response?.data || response || [];
        
        if (cursos.length > 0) {
          setCurso(cursos[0]);
        }
      } catch (err) {
        setError(err.message || 'Error cargando curso');
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, []);

  return { curso, loading, error };
};

export const useGroupData = () => {
  const [grupo, setGrupo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserGroup = async () => {
      try {
        const usuario = authService.obtenerUsuarioActual();
        if (!usuario?.id) return;

        const response = await grupoService.getUserGroup(usuario.id);
        const grupoData = response?.grupo || response?.data?.grupo || null;
        
        if (grupoData) {
          setGrupo(grupoData);
        }
      } catch {
        // Silently fail - user might not have a group yet
      } finally {
        setLoading(false);
      }
    };

    fetchUserGroup();
  }, []);

  const joinGroup = async (codigo) => {
    const usuario = authService.obtenerUsuarioActual();
    const usuarioId = usuario?.id;

    if (!usuarioId) {
      throw new Error('No se encontró el usuario en sesión.');
    }

    const data = await grupoService.joinGroupByCode({ codigo, usuarioId });
    const grupoData = data?.grupo || data?.data?.grupo;
    
    setGrupo(grupoData);
    return data;
  };

  return { grupo, loading, joinGroup };
};

export const useLevelsData = () => {
  const [niveles, setNiveles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLevels = async () => {
      try {
        const res = await topicsService.getLevels();
        const lista = Array.isArray(res)
          ? res
          : res.data?.levels || res.data || res.levels || [];
        
        setNiveles(lista);
      } catch {
        // Silently fail
      } finally {
        setLoading(false);
      }
    };

    loadLevels();
  }, []);

  const fetchTopicsForLevel = async (nivelId) => {
    const res = await grupoService.getTopicsByLevel(nivelId);
    return Array.isArray(res) ? res : res.data?.topics || res.data || [];
  };

  return { niveles, loading, fetchTopicsForLevel };
};

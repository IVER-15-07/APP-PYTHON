import { coursesService } from "../services/courses.service.js";
import { topicService } from "../services/topic.service.js";
import { topicTypeService } from "../services/topic-type.service.js";
import { levelService } from "../services/level.service.js";

export const getMyCourses = async (req, res) => {
    try {
        const cursos = await coursesService.getCourses();
        return res.status(200).json({success: true, data: cursos});
    } catch (err) {
        console.error("Error en getMyCourses:", err);
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || "Error interno del servidor",
            data: null
        });
    }
};

export const createTopicWithResource = async (req, res) => {
    try {
        const data = req.body;
        const files = req.files; // Archivos subidos
        const result = await topicService.createTopicWithResource(data, files);
        return res.status(201).json({success: true, data: result});
    } catch (err) {
        console.error("Error en create topico y recursos ", err);
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || "Error interno del servidor",
            data: null
        });
    }
};

export const getAllTopics = async (req, res) => {
    try {
        const topics = await topicService.getAllTopics();
        return res.status(200).json({success: true, data: topics});
    } catch (err) {
        console.error("Error en getAllTopics:", err);
        return res.status(err.status || 500).json({
            success: false, message: err.message || "Error interno del servidor",
            data: null
        });
    }
};

export const getTopicTypes = async (req, res) => {
    try {
        const types = await topicTypeService.getTopicTypes();
        return res.status(200).json({ success: true, data: types });
    } catch (err) {
        console.error("Error en getTopicTypes:", err);
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || "Error interno del servidor",
            data: null
        });
    }
};

export const getLevels = async (req, res) => {
    try {
        const levels = await levelService.getLevels();
        return res.status(200).json({ success: true, data: levels });
    } catch (err) {
        console.error("Error en getLevels:", err);
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || "Error interno del servidor",
            data: null
        });
    }
};

export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;
        console.log('Course ID:', id);
        console.log('Request body:', req.body);

        const updatedCourse = await coursesService.updateCourse(id, { 
            nombre, 
            descripcion 
        });
        
        res.status(200).json({
            success: true,
            data: updatedCourse,
            message: 'Curso actualizado exitosamente'
        });
    } catch (error) {
        console.error('Error in updateCourse:', error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateTopic = async (req, res) => {
    try {
        const result = await topicService.updateTopicWithResources(req.params.id, req.body, req.files || []);
         return res.status(200).json({success: true, data: result,
        });
    } catch (err) {
        console.error("Error en actualizar el tópico:", err);
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || "Error interno del servidor",
            data: null,
        });
    }
};
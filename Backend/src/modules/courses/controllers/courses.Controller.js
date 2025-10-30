import { coursesService } from "../services/courses.service.js";
import { topicService } from "../services/topic.service.js";

export const getMyCourses = async (req, res) => {
    try {
        const cursos = await coursesService.getCourses();
        return res.status(200).json(cursos);
    } catch (error) {
        console.error("Error al obtener los cursos:", error);
        return res.status(500).json({ error: "Error al obtener los cursos" });
    }
};

export const createTopicWithResource = async (req, res) => {
    try {
        const data = req.body;
        const files = req.files; // Archivos subidos

        const result = await topicService.createTopicWithResource(data, files);
        return res.status(201).json(result);
    } catch (error) {
        console.error("Error al crear el tópico con recurso:", error);
        return res.status(500).json({ error: "Error al crear el tópico con recurso" });
    }
};

export const getAllTopics = async (req, res) => {
    try {
        const topics = await topicService.getAllTopics();
        return res.status(200).json(topics);
    } catch (error) {
        console.error("Error al obtener los tópicos:", error);
        return res.status(500).json({ error: "Error al obtener los tópicos" });
        
    }
};

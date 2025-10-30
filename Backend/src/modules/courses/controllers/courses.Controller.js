import { coursesService } from "../services/courses.service.js";

export const getMyCourses = async (req, res) => {
    try {
        const cursos = await coursesService.getCourses();
        return res.status(200).json(cursos);
    } catch (error) {
        console.error("Error al obtener los cursos:", error);
        return res.status(500).json({ error: "Error al obtener los cursos" });
    }
};

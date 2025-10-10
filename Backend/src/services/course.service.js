import ApiError from "../utils/ApiError.js";
import { courseRepository } from "../repositories/course.repositorio.js";

export const courseService = {
  async createCourse(profesorId, data) {
    if (!data.title || !data.description) {
      throw new ApiError(400, "title y description son requeridos");
    }
    const curso = await courseRepository.create({
      title: data.title,
      description: data.description,
      //level: data.level || "Básico",
      code: data.code || null,
      profesorId: Number(profesorId),
    });
    return curso;
  },

  async getCoursesByProfesor(profesorId) {
    return await courseRepository.findByProfesor(profesorId);
  },
};
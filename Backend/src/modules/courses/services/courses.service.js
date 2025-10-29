import { coursesRepository } from "../repositories/courses.repository.js";


export const coursesService = {
    async getCourses() {
        const cursos = await coursesRepository.getMyCourses();
        return cursos || [];
    }



}
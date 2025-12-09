import { coursesRepository } from "../repositories/courses.repository.js";
import { updateCourse as updateCourseRepo } from "../repositories/updateCourse.repository.js";

export const coursesService = {
    async getCourses() {
        const cursos = await coursesRepository.getMyCourses();
        return cursos || [];
    },

    async getCoursesWithStudentCount() {
        const cursos = await coursesRepository.getCoursesWithStudentCount();
        
        // Calcular el total de estudiantes por curso (excluyendo a TODOS los profesores)
        return cursos.map(curso => ({
            ...curso,
            totalEstudiantes: curso.grupo.reduce((total, grupo) => {
                // Contar solo los estudiantes (rol nombre === 'Estudiante')
                const estudiantesCount = grupo.registro.filter(
                    reg => reg.usuario?.rol_usuario?.nombre === 'Estudiante'
                ).length;
                return total + estudiantesCount;
            }, 0),
            grupos: curso.grupo.map(grupo => ({
                id: grupo.id,
                titulo: grupo.titulo,
                estudiantesInscritos: grupo.registro.filter(
                    reg => reg.usuario?.rol_usuario?.nombre === 'Estudiante'
                ).length
            }))
        }));
    },

    async getCourseWithStudentCount(cursoId) {
        const curso = await coursesRepository.getCourseWithStudentCount(parseInt(cursoId));
        
        if (!curso) {
            throw { status: 404, message: 'Curso no encontrado' };
        }

        return {
            ...curso,
            totalEstudiantes: curso.grupo.reduce((total, grupo) => {
                // Contar solo los estudiantes (rol nombre === 'Estudiante')
                const estudiantesCount = grupo.registro.filter(
                    reg => reg.usuario?.rol_usuario?.nombre === 'Estudiante'
                ).length;
                return total + estudiantesCount;
            }, 0),
            grupos: curso.grupo.map(grupo => ({
                id: grupo.id,
                titulo: grupo.titulo,
                estudiantesInscritos: grupo.registro.filter(
                    reg => reg.usuario?.rol_usuario?.nombre === 'Estudiante'
                ).length
            }))
        };
    },

    async updateCourse(courseId, data) {
        const nombre = (data?.nombre ?? '').toString().trim();
        const descripcion = (data?.descripcion ?? '').toString().trim();

        if (!nombre) throw { status: 400, message: 'Nombre del curso es requerido' };
        if (nombre.length < 5 || nombre.length > 100) throw { status: 400, message: 'Nombre debe tener entre 5 y 100 caracteres' };

        if (!descripcion) throw { status: 400, message: 'Descripción es requerida' };
        if (descripcion.length < 20 || descripcion.length > 500) throw { status: 400, message: 'Descripción debe tener entre 20 y 500 caracteres' };

        const stripTags = s => s.replace(/<\/?[^>]+(>|$)/g, '');
        const escapeAngle = s => s.replace(/[<>]/g, c => (c === '<' ? '&lt;' : '&gt;'));

        const sanitized = {
            nombre: escapeAngle(stripTags(nombre)),
            descripcion: escapeAngle(stripTags(descripcion))
        };

        const updated = await updateCourseRepo(courseId, sanitized);
        return updated;
  },

}
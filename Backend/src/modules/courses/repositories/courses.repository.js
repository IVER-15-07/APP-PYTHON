import prisma from "../../../config/database.js";

export const coursesRepository = {

    getMyCourses: async () => prisma.curso.findMany(
        {
            select: {
                id: true,
                nombre: true,
                descripcion: true,
                nivel: {
                    select: {
                        id: true,
                        nombre: true,
                    },
                },
            },
        }
    ),

    getCoursesWithStudentCount: async () => prisma.curso.findMany({
        select: {
            id: true,
            nombre: true,
            descripcion: true,
            nivel: {
                select: {
                    id: true,
                    nombre: true,
                },
            },
            grupo: {
                select: {
                    id: true,
                    titulo: true,
                    _count: {
                        select: {
                            registro: true
                        }
                    }
                }
            }
        },
    }),

    getCourseWithStudentCount: async (cursoId) => prisma.curso.findUnique({
        where: { id: cursoId },
        select: {
            id: true,
            nombre: true,
            descripcion: true,
            grupo: {
                select: {
                    id: true,
                    titulo: true,
                    _count: {
                        select: {
                            registro: true
                        }
                    }
                }
            }
        },
    }),
}

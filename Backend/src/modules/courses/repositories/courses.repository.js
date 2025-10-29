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



}

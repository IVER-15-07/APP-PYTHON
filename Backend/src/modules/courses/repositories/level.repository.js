import prisma from "../../../config/database.js";

export const levelRepository = {

    getAllLevels: async () => prisma.nivel.findMany({
        select: {
            id: true,
            nombre: true,
            cursoId: true,
        },
        orderBy: {
            id: 'asc'
        }
    }),

};
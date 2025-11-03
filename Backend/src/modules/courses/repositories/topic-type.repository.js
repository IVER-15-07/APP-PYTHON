import prisma from "../../../config/database.js";

export const topicTypeRepository = {

    getAllTopicTypes: async () => prisma.tipo_topico.findMany({
        select: {
            id: true,
            nombre: true,
        },
        orderBy: {
            id: 'asc'
        }
    }),

};
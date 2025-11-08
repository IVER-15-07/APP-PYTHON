import prisma from '../../../config/database.js';

export const topicoRepository = {

    createTopic: (data) =>
        prisma.topico.create({ data }),

    getAllTopics: () =>
        prisma.topico.findMany({
            include: {
                nivel: true,
                tipo_topico: true,
                recursos: true,
            },
        }),


    getTopicById: (id) =>
        prisma.topico.findUnique({
            where: { id: Number(id) },
            include: {
                nivel: true,
                tipo_topico: true,
                recursos: true,
            },
        }),


    updateTopic: (id, data) =>
        prisma.topico.update({
            where: { id: Number(id) },
            data,
        })
}

import prisma from "../../../config/database.js";

export const commentRepository = {

    createComment: (data) => prisma.comentario.create({ data }),

    createanswerComments: (data) => prisma.comentarioRespuesta.create({
        data: data,
        include: { comentario: true },
    }),

    findCommentById: async (id) => {
        return await prisma.comentario.findUnique({
            where: { id: Number(id) }
        });
    },

    getCommentsByTopicId: async (topicoId) => {
        return await prisma.comentario.findMany({
            where: {
                topicoId: Number(topicoId) // Filtramos por el ID del tema/video
            },
        
            include: {
                usuario: { select: { nombre: true, profilePicture: true } },
                respuestas: {
                    include: { usuario: { select: { nombre: true, profilePicture: true } } }
                }
            },
            orderBy: { fecha_pub: 'desc' }
        });
    },

}
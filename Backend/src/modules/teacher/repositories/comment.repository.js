import prisma from "../../../config/database.js";

export const commentRepository = {

    createComment: (data) => prisma.comentario.create({ data }),

    answerComments: (data) => prisma.respuestaComentario.findMany({
        where: { data },
        include: { comentario: true },
    }),

    getCommentsByTeacherId: (teacherId) => prisma.comentario.findMany({
        where: { teacherId },
        include: { respuestas: true },
    }),

    getRespuestasByCommentId: (commentId) => prisma.respuestaComentario.findMany({
        where: { commentId },
    }),


}
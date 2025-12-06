import prisma from "../../../config/database.js";

export const commentRepository = {

    createComment: (data) => prisma.comentario.create({ data }),

    createanswerComments: (data) => prisma.comentarioRespuesta.create({
        data: data,
        include: { comentario: true },
    }),



    getCommentsByTeacherId: (teacherId) => prisma.comentario.findMany({
        where: { teacherId },
        include: {
            usuario: {
                select: { nombre: true }
            },
            respuestas: {
                include: {
                    usuario: {  
                        select: {
                            nombre: true
                        }
                    }
                }
            }
        },
    }),

}
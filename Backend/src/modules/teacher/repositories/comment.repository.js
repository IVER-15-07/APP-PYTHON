import prisma from "../../../config/database.js";

export const commentRepository = {

    createComment: (data) => prisma.comentario.create({ data }),

    createanswerComments: (data) => prisma.comentarioRespuesta.create({
        data: data,
        include: { comentario: true },
    }),



    getCommentsByTeacherId: (teacherId) => prisma.comentario.findMany({
        where: { teacherId },
        orderBy: {
            fecha_pub: 'desc'
        },
        include: {
            usuario: {
                select: { 
                    nombre: true,
                    profilePicture: true
                }
            },
            respuestas: {
                include: {
                    usuario: {
                        select: { 
                            nombre: true,
                            profilePicture: true
                        }
                    }
                },
                orderBy: {
                    fecha_pub: 'desc'
                }
            }
        },
    }),

}
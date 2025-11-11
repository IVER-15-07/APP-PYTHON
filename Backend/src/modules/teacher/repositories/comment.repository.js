import prisma from "../../../config/database.js";

export const commentRepository = {

    createComment: (data) => prisma.comentarios.create({ data }),
    getCommentById: (id) =>
        prisma.comentarios.findUnique({
            where: { id },
            include: { usuario: true, topico: true },
        }),
    listByTopico: (topicoId) =>
        prisma.comentarios.findMany({
            where: { topicoId },
            orderBy: { fecha: "asc" },
            include: { usuario: true },
        }),

    
    findVista: (comentarioId, usuarioId) =>
        prisma.comentarioVisto.findFirst({ where: { comentarioId, usuarioId } }),
    createVista: (comentarioId, usuarioId) =>
        prisma.comentarioVisto.create({ data: { comentarioId, usuarioId } }),
    updateVista: (id, data) =>
        prisma.comentarioVisto.update({ where: { id }, data }),
    countVistas: (comentarioId) =>
        prisma.comentarioVisto.count({ where: { comentarioId } }),

}
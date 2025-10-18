import prisma from "../../../config/database.js";

export const solicitudRepository = {
    createSolicitud: (data) => prisma.solicitudRol.create({ data }),
    findByUsuarioId: (usuarioId) => prisma.solicitudRol.findUnique({ where: { usuarioId } }),
    update: (id, data) => prisma.solicitudRol.update({ where: { id }, data }),

    myrequest: async (usuarioId) => prisma.solicitudRol.findFirst({
        where: { usuarioId, estado: 'pendiente' },
        orderBy: { fecha_solicitud: 'desc' }
    }),

    
}

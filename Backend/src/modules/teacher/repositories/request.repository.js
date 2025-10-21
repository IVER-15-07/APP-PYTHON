import prisma from "../../../config/database.js";

export const solicitudRepository = {
    createSolicitud: (data) => prisma.solicitudRol.create({ data }),
    findByUsuarioId: (usuarioId, rolId) => prisma.solicitudRol.findFirst({ 
        where: { 
            usuarioId,
            rol_usuarioId: rolId 
        } 
    }),
    update: (id, data) => prisma.solicitudRol.update({ where: { id }, data }),

    myrequest: async (usuarioId) => prisma.solicitudRol.findFirst({
        where: { usuarioId, estado: 'pendiente' },
        orderBy: { fecha_solicitud: 'desc' }
    }),

    
}

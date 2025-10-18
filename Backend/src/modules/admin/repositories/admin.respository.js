import prisma from "../../../config/database.js";

export const adminRepository = {

  encontrarPorId: (id) =>
    prisma.solicitudRol.findUnique({
      where: { id },
    }),

    updateSolicitudEstado: (id, data) =>
    prisma.solicitudRol.update({
      where: { id },
      data
    }),

    updateUsuarioRol: (usuarioId, rolId) =>
    prisma.usuario.update({
      where: { id: usuarioId },
      data: { rol_usuarioId: rolId }
    }),

    transaction: (callback) => prisma.$transaction(callback),


  getPendingRoleRequests: () =>
    prisma.solicitudRol.findMany({
      where: { estado: 'pendiente' },
      include: { usuario: true, rol_usuario: true },
      orderBy: { fecha_solicitud: 'desc' }
    })
};
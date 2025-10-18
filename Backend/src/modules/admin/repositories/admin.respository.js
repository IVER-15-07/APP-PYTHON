import prisma from "../../../config/database.js";

export const userRepository = {




  updateRole: (id, rolId) =>
    prisma.usuario.update({
      where: { id },
      data: { rol_usuarioId: rolId }
    }),

  getRoleRequestById: (solicitudId) =>
    prisma.solicitudRol.findUnique({
      where: { id: solicitudId },
      include: { usuario: true, rol_usuario: true }
    }),




  aprobarRoleRequest: async (solicitudId) => {
    const solicitud = await prisma.solicitudRol.findUnique({ where: { id: solicitudId } });
    if (!solicitud) throw new Error('Solicitud no encontrada');
    if (!solicitud.rol_usuarioId) throw new Error('Solicitud no tiene rol asociado');

    // Usar transaction callback para que todas las consultas compartan la misma tx
    const result = await prisma.$transaction(async (tx) => {
      // actualizar el usuario al rol solicitado
      const updatedUsuario = await tx.usuario.update({
        where: { id: solicitud.usuarioId },
        data: { rol_usuarioId: solicitud.rol_usuarioId }
      });

      // marcar la solicitud como aprobada
      const updatedSolicitud = await tx.solicitudRol.update({
        where: { id: solicitudId },
        data: { estado: 'aprobado' }
      });

      // leer de nuevo el usuario (dentro de la tx) para asegurar valores finales
      const usuarioFinal = await tx.usuario.findUnique({ where: { id: solicitud.usuarioId } });

      return { updatedSolicitud, updatedUsuario: usuarioFinal };
    });

    // opcional: log para debug
    console.log('aprobarRoleRequest -> solicitudId:', solicitudId, 'asignado rol_usuarioId:', solicitud.rol_usuarioId, 'a usuarioId:', solicitud.usuarioId);

    return result;
  },

  rechazarRoleRequest: (solicitudId) =>
    prisma.solicitudRol.update({
      where: { id: solicitudId },
      data: { estado: 'rechazado' }
    }),


  

  getPendingRoleRequests: () =>
    prisma.solicitudRol.findMany({
      where: { estado: 'pendiente' },
      include: { usuario: true, rol_usuario: true },
      orderBy: { fecha_solicitud: 'desc' }
    })
};
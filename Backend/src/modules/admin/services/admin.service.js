import { userRepository } from "../repositories/user.repository.js";


export const userService = {

    async changeUserRole(requesterId, targetUserId, newRolId) {
        const requester = await prisma.usuario.findUnique({
            where: { id: requesterId },
            include: { rol_usuario: true },
        });

        if (!requester) throw { status: 401, message: "Solicitante no autenticado" };
        if (!requester.rol_usuario || requester.rol_usuario.nombre !== "Administrador")
            throw { status: 403, message: "No autorizado" };

        const target = await userRepository.findById(targetUserId);
        if (!target) throw { status: 404, message: "Usuario objetivo no encontrado" };

        const rol = await prisma.rol_usuario.findUnique({ where: { id: newRolId } });
        if (!rol) throw { status: 400, message: "Rol inválido" };

        const updated = await userRepository.updateRole(targetUserId, newRolId);
        return updated;
    },


    async approveRequest(requesterId, requestId) {
        const requester = await prisma.usuario.findUnique({
            where: { id: requesterId },
            include: { rol_usuario: true },
        });
        if (!requester) throw { status: 401, message: "Solicitante no autenticado" };
        if (!isAdmin(requester)) throw { status: 403, message: "No autorizado" };

        const solicitud = await roleRequestRepository.findById(requestId);
        if (!solicitud) throw { status: 404, message: "Solicitud no encontrada" };
        if (solicitud.estado !== "pendiente") throw { status: 400, message: "Solicitud ya procesada" };

        // transaction: actualizar rol del usuario y marcar solicitud como aprobado
        await prisma.$transaction([
            prisma.usuario.update({
                where: { id: solicitud.usuarioId },
                data: { rol_usuarioId: solicitud.rolId },
            }),
            prisma.solicitudRol.update({
                where: { id: requestId },
                data: { estado: "aprobado" },
            }),
        ]);

        // devolver el registro actualizado
        return roleRequestRepository.findById(requestId);
    },

    async rejectRequest(requesterId, requestId) {
        const requester = await prisma.usuario.findUnique({
            where: { id: requesterId },
            include: { rol_usuario: true },
        });
        if (!requester) throw { status: 401, message: "Solicitante no autenticado" };
        if (!isAdmin(requester)) throw { status: 403, message: "No autorizado" };

        const solicitud = await roleRequestRepository.findById(requestId);
        if (!solicitud) throw { status: 404, message: "Solicitud no encontrada" };
        if (solicitud.estado !== "pendiente") throw { status: 400, message: "Solicitud ya procesada" };

        const updated = await roleRequestRepository.updateStatus(requestId, "rechazado");
        return updated;
    }
};
import { adminRepository } from "../repositories/admin.respository.js";


export const adminService = {

    async aprobarRequest(solicitudId) {
        const solicitud = await adminRepository.encontrarPorId(solicitudId);
        if (!solicitud) {
            const error = new Error("Solicitud no encontrada");
            error.status = 404;
            throw error;
        }
        if (solicitud.estado !== 'pendiente') {
            const error = new Error("La solicitud ya ha sido procesada");
            error.status = 400;
            throw error;
        }

        const { usuarioId, rol_usuarioId } = solicitud;

        const result = await adminRepository.transaction(async (tx) => {
            const updateUsuario = await tx.usuario.update({
                where: { id: usuarioId },
                data: { rol_usuarioId }

            });


            const updateSolicitud = await tx.solicitudRol.update({
                where: { id: solicitudId },
                data: { estado: 'aprobada' }
            });
            return { updateUsuario, updateSolicitud }

        });
        return result;
        
    },


    async rejectRequest(solicitudId) {
        const solicitud = await adminRepository.encontrarPorId(solicitudId);
        if (!solicitud) {
            const error = new Error("Solicitud no encontrada");
            error.status = 404;
            throw error;
        }
        if (solicitud.estado !== 'pendiente') {
            const error = new Error("La solicitud ya ha sido procesada");
            error.status = 400;
            throw error;
        }

        const updated =await adminRepository.updateSolicitudEstado(solicitudId, { estado: 'rechazada' });
        return updated;
    },

    async getPendingRequests() {
        const pendientes = await adminRepository.getPendingRoleRequests();
        return pendientes || [];
    },
};
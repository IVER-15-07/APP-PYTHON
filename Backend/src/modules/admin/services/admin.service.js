import { userRepository } from "../repositories/admin.respository.js";


export const adminService = {

    async aprobarRequest(solicitudId) {
        const solicitud = await userRepository.getRoleRequestById(solicitudId);
        if (!solicitud) {
            const error = new Error('Solicitud no encontrada');
            error.status = 404;
            throw error;
        }   
        return userRepository.aprobarRoleRequest(solicitudId);
    },

    async rejectRequest(solicitudId) {
        const solicitud = await userRepository.getRoleRequestById(solicitudId);
        if (!solicitud) {
            const error = new Error('Solicitud no encontrada');
            error.status = 404;
            throw error;
        }
        return userRepository.rechazarRoleRequest(solicitudId);
    },

    async getPendingRequests() {
        const pendientes = await userRepository.getPendingRoleRequests();
        return pendientes || [];
    },
};
import { solicitudRepository } from "../repositories/request.repository.js";
import { roleRepository } from "../repositories/role.repository.js";


export const solicitudService = {
    async createSolicitud(usuarioId, rolId) {
        const rol = await roleRepository.findById(rolId);
        if (!rol) {
            throw { status: 400, mesage: "rol invalido " };
        }

        const existing = await solicitudRepository.findByUsuarioId(usuarioId, rolId);
        if (existing) {
            if (existing.estado === 'pendiente') {
                throw { status: 400, message: "Ya existe una solicitud pendiente" };
            }
            // esta  parte del codigo es por si el profesor  quiere pedir o solicitar  un nuevo rol 
            return solicitudRepository.update(existing.id, {

                rol_usuarioId: rolId,
                estad: 'pendiente',
                fecha_solicitud: new Date(),
            });

        }

        return solicitudRepository.createSolicitud({
            usuarioId,
            rol_usuarioId: rolId,
            estado: 'pendiente',
        });

    },

    async getMyRequest(usuarioId) {
        const pendiente = await solicitudRepository.myrequest(usuarioId);
        return pendiente || null;
    },
};

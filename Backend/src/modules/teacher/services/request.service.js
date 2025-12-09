import { solicitudRepository } from "../repositories/request.repository.js";
import { roleRepository } from "../repositories/role.repository.js";
import { teamRepository } from "../repositories/team.repository.js";


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
                estado: 'pendiente',
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


    async createGroupRequest(usuarioId, groupData) {
        const { titulo, descripcion, fecha_ini, fecha_fin, cursoId } = groupData;

        const grupo = await teamRepository.createTeam({
            titulo,
            descripcion: descripcion || "",
            fecha_ini: new Date(fecha_ini),
            fecha_fin: new Date(fecha_fin),
            esAprobado: false,
            codigo: null,
            cursoId: Number(cursoId),
        });

        if (usuarioId) {
            await teamRepository.addCreatorRegistro({ usuarioId, grupoId: grupo.id });
        }

        return grupo;
    },


    async listMyCreatedGroups(usuarioId, estado ) {
        let esAprobado;
        if (estado === 'aprobado') {
            esAprobado = true;
        } else if (estado === 'pendiente') {
            esAprobado = false;
        } else {
            esAprobado = null;
        }

        const grupos = await teamRepository.listCreatedBy(usuarioId, esAprobado);
        
        // Transform to include estudiantesInscritos (excluding the creator)
        return grupos.map(grupo => {
            // Count students excluding the creator (current user)
            const estudiantesInscritos = grupo.registro.filter(
                reg => reg.usuarioId !== Number(usuarioId)
            ).length;
            
            return {
                id: grupo.id,
                titulo: grupo.titulo,
                descripcion: grupo.descripcion,
                fecha_ini: grupo.fecha_ini,
                fecha_fin: grupo.fecha_fin,
                esAprobado: grupo.esAprobado,
                codigo: grupo.codigo,
                curso: grupo.curso,
                estudiantesInscritos
            };
        });
    }

};

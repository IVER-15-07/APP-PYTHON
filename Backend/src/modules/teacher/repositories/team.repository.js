import prisma from "../../../config/database.js";

export const teamRepository = {
    createTeam: (data) => prisma.grupo.create({ data }),

    addCreatorRegistro: ({ usuarioId, grupoId }) => prisma.registro.create({ data: { usuarioId, grupoId } }),




  


}
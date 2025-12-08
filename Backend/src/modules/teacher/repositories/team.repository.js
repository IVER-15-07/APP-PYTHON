import prisma from "../../../config/database.js";

export const teamRepository = {
    createTeam: (data) => prisma.grupo.create({ data }),

    addCreatorRegistro: ({ usuarioId, grupoId }) => prisma.registro.create({ data: { usuarioId, grupoId } }),


   listCreatedBy: (usuarioId, esAprobado) =>
    prisma.grupo.findMany({
      where: {
        registro: { some: { usuarioId: Number(usuarioId) } },
        ...(typeof esAprobado === "boolean" ? { esAprobado } : {}),
      },
      select: {
        id: true,
        titulo: true,
        descripcion: true,
        fecha_ini: true,
        fecha_fin: true,
        esAprobado: true,
        codigo: true,
        curso: { select: { id: true, nombre: true } },
        registro: {
          select: {
            usuarioId: true,
          },
        },
      },
      
      orderBy: { id: "desc" },
    
    }),
}


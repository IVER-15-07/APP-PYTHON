
import prisma from "../../../config/database.js";

export const GroupRepository = {

  findById: (id) => prisma.grupo.findUnique({ where: { id } }),

  listPendingTeams: () => prisma.grupo.findMany({ where: { esAprobado: false }, orderBy: { id: 'desc' } }),


  tokencode: (codigo) => prisma.grupo.findUnique({ where: { codigo: Number(codigo) } }),

  aprobarsetCode: (id, codigo) => prisma.grupo.update({
    where: { id },
    data: { esAprobado: true, codigo },
  }),

};
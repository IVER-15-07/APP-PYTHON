import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const GrupoRepository = {
  findByCodigo: async (codigo) => {
    return prisma.grupo.findUnique({ where: { codigo: parseInt(codigo) } });
  },
  findRegistroByUsuario: async (usuarioId) => {
    return prisma.registro.findFirst({ where: { usuarioId: parseInt(usuarioId) } });
  },
  crearRegistro: async (usuarioId, grupoId) => {
    return prisma.registro.create({ data: { usuarioId, grupoId } });
  },
  getNiveles: async () => {
    return prisma.nivel.findMany();
  },
};

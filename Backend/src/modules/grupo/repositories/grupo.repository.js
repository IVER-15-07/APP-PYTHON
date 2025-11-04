import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const grupoRepository = {
  findByCodigo: (codigo) => {
    return prisma.grupo.findUnique({
      where: { codigo: parseInt(codigo) }
    });
  },

  findRegistroByUsuarioId: (usuarioId) => {
    return prisma.registro.findFirst({
      where: { usuarioId: parseInt(usuarioId) }
    });
  },

  createRegistro: (usuarioId, grupoId) => {
    return prisma.registro.create({
      data: {
        usuarioId: parseInt(usuarioId),
        grupoId: grupoId,
      }
    });
  },

  findNiveles: () => {
    return prisma.nivel.findMany();
  },

  findGroupByUser: (usuarioId) => {
    return prisma.registro.findFirst({
      where: { usuarioId: parseInt(usuarioId) },
      include: { grupo: true },
    });
  },
};

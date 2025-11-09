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

  findById: (id) => {
    return prisma.grupo.findUnique({
      where: { id: parseInt(id) }
    });
  },

  update: (id, payload) => {
    const { titulo, descripcion, fecha_ini, fecha_fin } = payload;
    return prisma.grupo.update({
      where: { id: parseInt(id) },
      data: {
        titulo,
        descripcion,
        fecha_ini: new Date(fecha_ini),
        fecha_fin: new Date(fecha_fin)
      }
    });
  },

  getTopicsByLevel: (nivelId) => {
    return prisma.topico.findMany({
      where: { nivelId: parseInt(nivelId) }
    });
  }
};

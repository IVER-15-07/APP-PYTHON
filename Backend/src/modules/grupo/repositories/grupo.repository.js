// Backend/src/modules/grupo/repositories/grupo.repository.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const findGroupByCode = async (codigo) => {
  // codigo: number
  return prisma.grupo.findUnique({
    where: { codigo: codigo },
  });
};

export const findRegistroByUsuario = async (usuarioId) => {
  return prisma.registro.findFirst({
    where: { usuarioId },
    include: { grupo: true },
  });
};

export const createRegistro = async ({ usuarioId, grupoId }) => {
  return prisma.registro.create({
    data: { usuarioId, grupoId },
  });
};

export const getAllNiveles = async () => {
  return prisma.nivel.findMany();
};

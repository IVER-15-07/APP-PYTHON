import prisma from "../config/database.js";

export const usuarioRepository = {
  findByEmail: (email) => prisma.usuario.findUnique({ where: { email } }),
  findById: (id) => prisma.usuario.findUnique({ where: { id }, include: { rol_usuario: true } }),
  create: (data) => prisma.usuario.create({ data, include: { rol_usuario: true } }),
};

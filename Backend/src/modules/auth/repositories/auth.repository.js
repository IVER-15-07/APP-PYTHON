import prisma from "../../../config/database.js";
// ...existing code...
export const usuarioRepository = {
  findByEmail: (email) => prisma.usuario.findUnique({ where: { email }, include: { rol_usuario: true } }),
  findById: (id) => prisma.usuario.findUnique({ where: { id }, include: { rol_usuario: true } }),
  create: (data) => prisma.usuario.create({ data, include: { rol_usuario: true } }),
};
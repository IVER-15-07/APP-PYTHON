import prisma from "../../../config/database.js";

export const userRepository = {
  findById: (id) =>
    prisma.usuario.findUnique({
         where: { id }, 
         include: { rol_usuario: true } }),

  updateRole: (id, rolId) =>
    prisma.usuario.update({ 
        where: { id }, 
        data: { rol_usuarioId: rolId } }),
};
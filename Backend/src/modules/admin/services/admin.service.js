import { userRepository } from "../repositories/user.repository.js";


export const userService = {
    
  async changeUserRole(requesterId, targetUserId, newRolId) {
    const requester = await prisma.usuario.findUnique({
      where: { id: requesterId },
      include: { rol_usuario: true },
    });

    if (!requester) throw { status: 401, message: "Solicitante no autenticado" };
    if (!requester.rol_usuario || requester.rol_usuario.nombre !== "Administrador")
      throw { status: 403, message: "No autorizado" };

    const target = await userRepository.findById(targetUserId);
    if (!target) throw { status: 404, message: "Usuario objetivo no encontrado" };

    const rol = await prisma.rol_usuario.findUnique({ where: { id: newRolId } });
    if (!rol) throw { status: 400, message: "Rol inválido" };

    const updated = await userRepository.updateRole(targetUserId, newRolId);
    return updated;
  },
};
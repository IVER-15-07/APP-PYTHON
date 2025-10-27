// Backend/src/modules/grupo/services/grupo.service.js
import * as repo from "../repositories/grupo.repository.js";

export const joinGroupByCodeService = async ({ codigo, usuarioId }) => {
  // codigo and usuarioId are numbers
  // 1) buscar grupo por codigo
  const grupo = await repo.findGroupByCode(codigo);
  if (!grupo) {
    const err = new Error("Código inválido.");
    err.status = 404;
    throw err;
  }

  // 2) verificar si usuario ya pertenece a un grupo
  const yaRegistrado = await repo.findRegistroByUsuario(usuarioId);
  if (yaRegistrado) {
    const err = new Error("Ya perteneces a un grupo.");
    err.status = 400;
    throw err;
  }

  // 3) crear registro
  await repo.createRegistro({ usuarioId, grupoId: grupo.id });

  // 4) obtener niveles
  const niveles = await repo.getAllNiveles();

  return { message: "Te has unido correctamente al grupo.", grupo, niveles };
};

export const getUserGroupService = async ({ usuarioId }) => {
  const registro = await repo.findRegistroByUsuario(usuarioId);
  if (!registro) {
    return { grupo: null, niveles: [] };
  }
  const niveles = await repo.getAllNiveles();
  return { grupo: registro.grupo, niveles };
};

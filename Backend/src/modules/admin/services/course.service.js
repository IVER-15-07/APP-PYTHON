import { GroupRepository } from "../repositories/group.repository.js";

async function generateUniqueGroupCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code, exists = true;

  do {

    code = Array.from({ length: 6 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join("");

    exists = !!(await GroupRepository.tokencode(code));
  } while (exists);

  return code;
}

export const groupService = {

  async listPending() {
    return GroupRepository.listPendingTeams();
  },

  async approveAndSetCode({ grupoId }) {


    const found = await GroupRepository.findById(grupoId);
    if (!found) {
      throw { status: 404, message: "Grupo no encontrado" };
    }
    if (found.esAprobado && found.codigo) {
      return { status: 200, message: "Grupo aprobado y código asignado", code: found.codigo };
    }

    const codigoUnico = await generateUniqueGroupCode();
    return GroupRepository.aprobarsetCode(grupoId, codigoUnico);
  },
};








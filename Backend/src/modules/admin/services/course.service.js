import { GroupRepository } from "../repositories/group.repository.js";

/*async function generateUniqueGroupCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code, exists = true;

  do {

    code = Array.from({ length: 6 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join("");

    exists = !!(await GroupRepository.tokencode(code));
  } while (exists);

  return code;
}*/
async function generateUniqueGroupCode() {
  let code, exists = true;

  do {
    // Genera un número entero de 6 dígitos (entre 100000 y 999999)
    code = Math.floor(100000 + Math.random() * 900000);

    // Verifica si ya existe el código
    exists = !!(await GroupRepository.tokencode(code));
  } while (exists);

  return code; // <-- Devuelve un número, no un string
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








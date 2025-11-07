import { grupoRepository } from "../repositories/grupo.repository.js";
import { validateGroupPayload } from "../validations/grupo.validation.js";

export const grupoService = {
  async joinGroupByCode(codigo, usuarioId) {

    const grupo = await grupoRepository.findByCodigo(codigo);
    if (!grupo) throw { status: 404, message: "Código inválido." };

    const yaRegistrado = await grupoRepository.findRegistroByUsuarioId(usuarioId);
    if (yaRegistrado) throw { status: 400, message: "Ya perteneces a un grupo." };

    await grupoRepository.createRegistro(usuarioId, grupo.id);
    const niveles = await grupoRepository.findNiveles();

    return { grupo, niveles };
  },

  async getUserGroup(usuarioId) {
    const registro = await grupoRepository.findGroupByUser(usuarioId);

    if (!registro) {
      return { grupo: null, niveles: [] };
    }

    const niveles = await grupoRepository.findNiveles();
    return { grupo: registro.grupo, niveles };
  },

  async updateGroup(id, data) {
    const grupoExistente = await grupoRepository.findById(id);
    if (!grupoExistente) throw { status: 404, message: "Grupo no encontrado." };

    const payloadSaneado = validateGroupPayload(data);

    const updated = await grupoRepository.update(id, payloadSaneado);

    return updated;
  }
};

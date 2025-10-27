// Backend/src/modules/grupo/controllers/grupo.controller.js
import * as service from "../services/grupo.service.js";

/* Unirse a un grupo mediante código */
export const joinGroupByCode = async (req, res) => {
  const { codigo, usuarioId } = req.body;

  // Validaciones básicas
  if (!codigo || !usuarioId) {
    return res.status(400).json({ message: "Faltan parámetros: codigo y usuarioId." });
  }

  const codigoNum = parseInt(codigo);
  const usuarioIdNum = parseInt(usuarioId);

  if (Number.isNaN(codigoNum) || Number.isNaN(usuarioIdNum)) {
    return res.status(400).json({ message: "codigo y usuarioId deben ser numéricos." });
  }

  try {
    const result = await service.joinGroupByCodeService({
      codigo: codigoNum,
      usuarioId: usuarioIdNum,
    });
    return res.json(result);
  } catch (error) {
    console.error("Error en joinGroupByCode:", error);
    const status = error.status || 500;
    return res.status(status).json({ message: error.message || "Error interno del servidor." });
  }
};

/* Verificar si un usuario ya pertenece a un grupo */
export const getUserGroup = async (req, res) => {
  const { usuarioId } = req.params;
  if (!usuarioId) {
    return res.status(400).json({ message: "Falta parametro usuarioId." });
  }
  const usuarioIdNum = parseInt(usuarioId);
  if (Number.isNaN(usuarioIdNum)) {
    return res.status(400).json({ message: "usuarioId debe ser numérico." });
  }

  try {
    const result = await service.getUserGroupService({ usuarioId: usuarioIdNum });
    return res.json(result);
  } catch (error) {
    console.error("Error en getUserGroup:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

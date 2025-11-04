import { grupoService } from "../services/grupo.service.js";

export const joinGroupByCode = async (req, res) => {
  const { codigo, usuarioId } = req.body;

  try {
    const data = await grupoService.joinGroupByCode(codigo, usuarioId);
    res.json({
      message: "Te has unido correctamente al grupo.",
      ...data
    });

  } catch (error) {
    console.error("Error en joinGroupByCode:", error);
    res.status(error.status || 500).json({ message: error.message || "Error interno del servidor." });
  }
};

export const getUserGroup = async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const data = await grupoService.getUserGroup(usuarioId);
    res.json(data);
  } catch (error) {
    console.error("Error en getUserGroup:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

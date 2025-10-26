import { groupService} from '../services/course.service.js';

export const getGroup = async (req, res) => {
    try {
        const pendingGroups = await groupService.listPending();
        return  res.status(200).json({ success: true, data: pendingGroups });
    } catch (error) {
        console.error("Error en group.Controller:", error);
        const status = error.status || 500;
        res.status(status).json({ success: false,
        message: error.message || "Error interno" });
    }

};

export const approveGroup = async (req, res) => {
  try {
    const grupoId = Number(req.params.id); // ← usar params, no body
    if (!Number.isInteger(grupoId)) {
      return res.status(400).json({ message: "id inválido" });
    }
    const grupo = await groupService.approveAndSetCode({ grupoId });
    return res.json({ success: true, data: grupo });
  } catch (e) {
    console.error("Error en group.Controller:", e);
    return res.status(e.status || 500).json({ message: e.message || "Error al aprobar grupo" });
  }
};

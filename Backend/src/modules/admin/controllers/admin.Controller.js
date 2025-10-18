import { adminService } from "../services/admin.service.js";



export const approve = async (req, res) => {
  const id = parseInt(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
  try {
    const result = await adminService.aprobarRequest(id);
    return res.status(200).json({ message: 'Solicitud aprobada', data: result });

  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ success: false, message: err.message || "Error interno" });
  }
};

export const reject = async (req, res) => {
  const id = parseInt(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
  try {
    const result = await adminService.rejectRequest(id);
    return res.status(200).json({ message: 'Solicitud rechazada', data: result });

  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ success: false, message: err.message || "Error interno" });
  }
};

export const getPendingRoleRequests = async (req, res) => {
  try {
    const roleIdActual = req.user?.rol_usuarioId ?? req.user?.rol?.id ?? req.user?.rol_usuario?.id;
    if (roleIdActual !== 1) return res.status(403).json({ success: false, message: "Acceso denegado" });

    const solicitudes = await adminService.getPendingRequests();
    return res.json({ success: true, data: solicitudes });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ success: false, message: err.message || "Error interno" });
  }
};
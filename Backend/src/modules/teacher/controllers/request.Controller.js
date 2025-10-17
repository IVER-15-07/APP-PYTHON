import { solicitudService } from "../services/request.service.js";

export const createRoleRequest = async (req, res) => {
  try {
    const requesterId = req.user?.id; // necesita middleware auth que ponga req.user
    if (!requesterId) return res.status(401).json({ success: false, message: "No autenticado" });

    const { rolId } = req.body;
    if (!rolId) return res.status(400).json({ success: false, message: "rolId requerido" });

    const solicitud = await solicitudService.createSolicitud(requesterId, rolId);
    return res.json({ success: true, message: "Solicitud creada", data: solicitud });
  } catch (error) {
    console.error("error en solicitudController:", error);
    const status = error.status || 500;
    res.status(status).json({ success: false,
    message: error.message || "Error interno" });
  }

}
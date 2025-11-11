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

export const getMyRequest = async (req, res) => {
    try {
        const usuarioId = req.user?.id;
        if (!usuarioId) return res.status(401).json({ success: false, message: "No autenticado" });

        const solicitud = await solicitudService.getMyRequest(usuarioId);
        return res.json({ success: true, data: solicitud });
    } catch (error) {
        console.error("error en solicitudController:", error);
        const status = error.status || 500;
        res.status(status).json({ success: false,
        message: error.message || "Error interno" });
    }

}

export const GroupRequest = async (req, res) => {
    try {
        const usuarioId = req.user?.id;
        if (!usuarioId) return res.status(401).json({ success: false, message: "No autenticado" });

        const groupData = req.body;
        const grupo = await solicitudService.createGroupRequest(usuarioId, groupData);
        return res.json({ success: true, message: "Grupo creado", data: grupo });
    } catch (error) {
        console.error("error en solicitudController:", error);
        const status = error.status || 500;
        res.status(status).json({ success: false,
        message: error.message || "Error interno" });
    }
}

export const getMyGroupRequests = async (req, res) => {
    try {
        const usuarioId = req.user?.id;
        const { estado } = req.query;
        if (!usuarioId) return res.status(401).json({ success: false, message: "No autenticado" });
        const data = await solicitudService.listMyCreatedGroups(usuarioId, estado);
        return res.json({ success: true, data });
    } catch (error) {
        console.error("error en solicitudController:", error);
        const status = error.status || 500;
        res.status(status).json({ success: false,
        message: error.message || "Error interno" });
    }
}


import { userService } from "../services/user.service.js";

export const changeUserRole = async (req, res) => {
  try {
    const requesterId = req.user?.id; // necesita middleware auth que ponga req.user
    if (!requesterId) return res.status(401).json({ success: false, message: "No autenticado" });

    const targetUserId = parseInt(req.params.id, 10);
    const { rolId } = req.body;
    if (!rolId) return res.status(400).json({ success: false, message: "rolId requerido" });

    const updated = await userService.changeUserRole(requesterId, targetUserId, rolId);
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    res.status(status).json({ success: false, message: err.message || "Error interno" });
  }
};

export const approveRoleRequest = async (req, res) => {
  try {
    const requesterId = req.user?.id;
    if (!requesterId) return res.status(401).json({ success: false, message: "No autenticado" });

    const requestId = parseInt(req.params.id, 10);
    const result = await roleRequestService.approveRequest(requesterId, requestId);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ success: false, message: err.message || "Error interno" });
  }
};

export const rejectRoleRequest = async (req, res) => {
  try {
    const requesterId = req.user?.id;
    if (!requesterId) return res.status(401).json({ success: false, message: "No autenticado" });

    const requestId = parseInt(req.params.id, 10);
    const result = await roleRequestService.rejectRequest(requesterId, requestId);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ success: false, message: err.message || "Error interno" });
  }
};
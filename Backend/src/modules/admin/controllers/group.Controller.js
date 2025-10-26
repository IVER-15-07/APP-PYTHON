import { groupService} from '../services/course.service.js';

export const getCourse = async (req, res) => {
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
        const { grupoId } = req.body;
        if (!grupoId) {
            return res.status(400).json({ success: false, message: "grupoId es requerido" });
        }

        const result = await groupService.approveAndSetCode({ grupoId });
        return res.status(200).json({ success: true, message: "Grupo aprobado", data: result });
    }
    catch (error) {
        console.error("Error en group.Controller:", error);
        const status = error.status || 500;
        res.status(status).json({ success: false,
        message: error.message || "Error interno" });
    }   
}

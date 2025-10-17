import express from "express";
import { changeUserRole, approveRoleRequest, rejectRoleRequest } from "../controllers/admin.Controller.js";
import authMiddleware from "../../auth/middleware/auth.middleware.js"; // ajusta si tu middleware exporta otra cosa

const router = express.Router();

router.patch("/admin/users/:id/role", authMiddleware, changeUserRole);
router.patch("/admin/role-requests/:id/aprobar", authMiddleware, approveRoleRequest);
router.patch("/admin/role-requests/:id/rechazar", authMiddleware, rejectRoleRequest);

export default router;

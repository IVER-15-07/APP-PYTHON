import express from "express";
import { approve, reject, getPendingRoleRequests } from "../controllers/admin.Controller.js";
import { getGroup, approveGroup } from "../controllers/group.Controller.js";
import { verifyToken } from "../../auth/middleware/auth.middleware.js";

const router = express.Router();


router.patch("/admin/role-requests/:id/aprobar", verifyToken, approve);
router.patch("/admin/role-requests/:id/rechazar", verifyToken, reject);
router.get("/admin/role-requests", verifyToken, getPendingRoleRequests);
router.get("/admin/groups/pending", verifyToken, getGroup);
router.patch("/admin/groups/:id/aprobar", verifyToken, approveGroup);

export default router;

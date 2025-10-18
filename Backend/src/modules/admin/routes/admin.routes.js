import express from "express";
import {  approve, reject, getPendingRoleRequests } from "../controllers/admin.Controller.js";
import { verifyToken } from "../../auth/middleware/auth.middleware.js";

const router = express.Router();

//router.patch("/admin/users/:id/role", verifyToken, changeUserRole);
router.patch("/admin/role-requests/:id/aprobar", verifyToken, approve);
router.patch("/admin/role-requests/:id/rechazar", verifyToken, reject);
router.get("/admin/role-requests", verifyToken, getPendingRoleRequests);

export default router;

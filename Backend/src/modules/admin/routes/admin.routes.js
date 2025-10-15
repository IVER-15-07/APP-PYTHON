import express from "express";
import { changeUserRole } from "../controllers/user.controller.js";
import authMiddleware from "../../auth/middleware/auth.middleware.js"; // ajusta si tu middleware exporta otra cosa

const router = express.Router();

router.patch("/admin/users/:id/role", authMiddleware, changeUserRole);

export default router;

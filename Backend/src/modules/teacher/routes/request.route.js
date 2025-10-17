import express from "express";

import { createRoleRequest } from "../controllers/request.Controller.js";
import authMiddleware from "../../auth/middleware/auth.middleware.js"; // ajusta si tu middleware exporta otra cosa
const router = express.Router();

router.post("/role-requests", authMiddleware, createRoleRequest);     

export default router;
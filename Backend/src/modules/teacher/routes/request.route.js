import express from "express";

import { createRoleRequest } from "../controllers/request.Controller.js";
import {verifyToken} from "../../auth/middleware/auth.middleware.js";

const router = express.Router();

router.post("/role-requests", verifyToken, createRoleRequest);

export default router;
import express from "express";

import { createRoleRequest, getMyRequest } from "../controllers/request.Controller.js";
import {verifyToken} from "../../auth/middleware/auth.middleware.js";

const router = express.Router();

router.post("/role-requests", verifyToken, createRoleRequest);
router.get( "/role-requests", verifyToken, getMyRequest);

export default router;
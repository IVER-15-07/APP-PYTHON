import express from "express";

import { createRoleRequest, getMyRequest, GroupRequest } from "../controllers/request.Controller.js";
import {verifyToken} from "../../auth/middleware/auth.middleware.js";

const router = express.Router();

router.post("/role-requests", verifyToken, createRoleRequest);
router.get( "/role-requests", verifyToken, getMyRequest);
router.post("/teacher/group-requests", verifyToken, GroupRequest);

export default router;
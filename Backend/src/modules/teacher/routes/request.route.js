import express from "express";

import { createRoleRequest, getMyRequest, GroupRequest, getMyGroupRequests } from "../controllers/request.Controller.js";
import {verifyToken} from "../../auth/middleware/auth.middleware.js";

const router = express.Router();

router.post("/role-requests", verifyToken, createRoleRequest);
router.get( "/role-requests", verifyToken, getMyRequest);
router.post("/teacher/group-requests", verifyToken, GroupRequest);

router.get("/teacher/group-requests", verifyToken, getMyGroupRequests);



export default router;
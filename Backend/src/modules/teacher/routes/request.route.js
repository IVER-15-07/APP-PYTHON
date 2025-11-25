import express from "express";

import { createRoleRequest, getMyRequest, GroupRequest, getMyGroupRequests } from "../controllers/request.Controller.js";
import {verifyToken} from "../../auth/middleware/auth.middleware.js";
//import { commentController } from "../controllers/comentario.controller.js";

const router = express.Router();

router.post("/role-requests", verifyToken, createRoleRequest);
router.get( "/role-requests", verifyToken, getMyRequest);
router.post("/teacher/group-requests", verifyToken, GroupRequest);

router.get("/teacher/group-requests", verifyToken, getMyGroupRequests);
//comentarios
//router.post("/comments", commentController.crear);
//router.post("/comments/:id/replies", commentController.responder);
//router.get("/comments/:id", commentController.obtener);
//router.get("/topics/:topicoId/comments", commentController.listarPorTopico);
//router.post("/comments/:id/seen", commentController.marcarVisto);


export default router;
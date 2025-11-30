import express from "express";

import { createRoleRequest, getMyRequest, GroupRequest, getMyGroupRequests } from "../controllers/request.Controller.js";
import {verifyToken} from "../../auth/middleware/auth.middleware.js";
import { crearComentario, responder, obtener , listarPorTopico } from "../controllers/comentario.Controller.js";

const router = express.Router();

router.post("/role-requests", verifyToken, createRoleRequest);
router.get( "/role-requests", verifyToken, getMyRequest);
router.post("/teacher/group-requests", verifyToken, GroupRequest);

router.get("/teacher/group-requests", verifyToken, getMyGroupRequests);
//comentarios
router.post("/comments", crearComentario);
router.post("/comments/:id/replies", responder);
router.get("/comments/:id", obtener);
router.get("/topics/:topicoId/comments", listarPorTopico);
//router.post("/comments/:id/seen", commentController.marcarVisto);


export default router;
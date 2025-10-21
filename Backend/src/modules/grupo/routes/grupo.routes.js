import { Router } from "express";
import { joinGroupByCode, getUserGroup } from "../controllers/grupo.controller.js";

const router = Router();

// Ruta para unirse a un grupo por código
router.post("/join-by-code", joinGroupByCode);

// Ruta para obtener el grupo actual del usuario
router.get("/user/:usuarioId", getUserGroup);

export default router;

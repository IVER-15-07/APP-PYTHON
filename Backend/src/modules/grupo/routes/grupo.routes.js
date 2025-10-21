import express from "express";
import { joinGroupByCode } from "../controllers/grupo.controller.js";

const router = express.Router();

// Ruta para unirse a un grupo
router.post("/join-by-code", joinGroupByCode);

export default router;

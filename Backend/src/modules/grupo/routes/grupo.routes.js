// Backend/src/modules/grupo/routes/grupo.routes.js
import { Router } from "express";
import { joinGroupByCode, getUserGroup } from "../controllers/grupo.controller.js";

const router = Router();

router.post("/join-by-code", joinGroupByCode);
router.get("/user/:usuarioId", getUserGroup);

export default router;

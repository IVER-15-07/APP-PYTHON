import { Router } from "express";
import { joinGroupByCode, getUserGroup, updateGroup } from "../controllers/grupo.controller.js";

const router = Router();

router.post("/join-by-code", joinGroupByCode);
router.get("/user/:usuarioId", getUserGroup);
router.put("/groups/:id", updateGroup);


export default router;

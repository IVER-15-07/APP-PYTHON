import { Router } from "express";
import { joinGroupByCode, getUserGroup, updateGroup, getTopicsByLevel } from "../controllers/grupo.controller.js";
import { verifyToken } from "../../auth/middleware/auth.middleware.js";
const router = Router();

router.post("/join-by-code", joinGroupByCode);


router.get("/user/:id", verifyToken, getUserGroup);
router.get("/topics/nivel/:id", getTopicsByLevel);

router.put("/groups/:id", verifyToken, updateGroup);

export default router;

import {Router} from "express";
import { register, login, firebaseLogin, me } from "../controllers/auth.Controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.post("/firebase-login", firebaseLogin);
router.get("/me", verifyToken, me);

export default router;

import express from "express";
import { getCourse } from "../controllers/course.Controller.js";

const router = express.Router();

router.get("/course", getCourse);

export default router;
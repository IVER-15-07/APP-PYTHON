import Router from "express";
import { createCourse, getMyCourses } from "../controllers/course.controller";

const router = Router();

router.post("/profesor/cursos", createCourse);
router.get("/profesor/cursos", getMyCourses);

export default router;
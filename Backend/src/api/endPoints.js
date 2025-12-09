// Backend/src/api/endPoints.js
import express from "express";

import authRoutes from '../modules/auth/routes/auth.routes.js';

//import studentRoutes from '@/modules/student/routes/student.routes.js';

import teacherRoutes from '../modules/teacher/routes/request.route.js';
import evaluationRoutes from '../modules/teacher/routes/evaluation.route.js';
import parametersRoutes from '../modules/teacher/routes/parameters.route.js';
import admin from '../modules/admin/routes/admin.routes.js';    
import coursesRoutes from '../modules/courses/routes/courses.routes.js';
import grupoRoutes from '../modules/grupo/routes/grupo.routes.js';
const router = express.Router();

router.use('/', admin);
router.use('/', authRoutes);
router.use('/', coursesRoutes);
router.use('/', teacherRoutes);
router.use('/', evaluationRoutes);
router.use('/', parametersRoutes);
router.use('/', grupoRoutes);
export default router;
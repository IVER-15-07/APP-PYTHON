// Backend/src/api/endPoints.js
import express from "express";

import authRoutes from '../modules/auth/routes/auth.routes.js';

//import studentRoutes from '@/modules/student/routes/student.routes.js';

import teacherRoutes from '../modules/teacher/routes/request.route.js';
import admin from '../modules/admin/routes/admin.routes.js';    
import coursesRoutes from '../modules/courses/routes/courses.routes.js';

const router = express.Router();

router.use('/', admin);
router.use('/', authRoutes);
router.use('/', coursesRoutes);
router.use('/', teacherRoutes);



export default router;
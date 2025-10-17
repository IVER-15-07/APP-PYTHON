// Backend/src/api/endPoints.js
import express from "express";

import authRoutes from '../modules/auth/routes/auth.routes.js';

//import studentRoutes from '@/modules/student/routes/student.routes.js';
import courseRoutes from '../modules/admin/routes/course.routes.js';
import teacherRoutes from '../modules/teacher/routes/request.route.js';

const router = express.Router();

// Rutas de autenticación
router.use('/', authRoutes);
router.use('/', courseRoutes);
router.use('/', teacherRoutes);

// Rutas de usuarios (protegidas)
//router.use('/api', usuarioRoutes);

export default router;
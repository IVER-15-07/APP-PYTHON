// Backend/src/api/endPoints.js
import express from "express";

import authRoutes from '../modules/auth/routes/auth.routes.js';
//import studentRoutes from '@/modules/student/routes/student.routes.js';
//import adminRoutes from '../routes/usuario.routes.js';
//import teacherRoutes from '../routes/teacher.routes.js';

const router = express.Router();

// Rutas de autenticación
router.use('/', authRoutes);

// Rutas de usuarios (protegidas)
//router.use('/api', usuarioRoutes);

export default router;
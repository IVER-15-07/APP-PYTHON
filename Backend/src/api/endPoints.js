// Backend/src/api/endPoints.js
import express from "express";

import authRoutes from '../routes/auth.routes.js';

const router = express.Router();

// Rutas de autenticación
router.use('/', authRoutes);

// Rutas de usuarios (protegidas)
//router.use('/api', usuarioRoutes);

export default router;
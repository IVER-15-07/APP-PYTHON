// Backend/src/api/endPoints.js
import express from "express";
import usuarioRoutes from '../routes/ususario.routes.js';
import authRoutes from '../routes/auth.routes.js';

const router = express.Router();

// Rutas de autenticación
router.use('/auth', authRoutes);

// Rutas de usuarios (protegidas)
router.use('/api', usuarioRoutes);

export default router;
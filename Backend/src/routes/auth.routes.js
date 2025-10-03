// Backend/src/routes/auth.routes.js
import express from 'express';
import { firebaseController } from '../controllers/firebaseController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Verificar token de Firebase y crear/obtener usuario
router.post('/firebase-login', firebaseController.verificarYCrearUsuario);

// Logout
router.post('/logout', firebaseController.logout);

// Verificar autenticación (ruta protegida)
router.get('/me', verificarToken, firebaseController.verificarAuth);

export default router;
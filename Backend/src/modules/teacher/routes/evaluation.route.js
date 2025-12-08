import express from 'express';
import { evaluationController } from '../controllers/evaluation.controller.js';
import { verifyToken } from '../../auth/middleware/auth.middleware.js';

const router = express.Router();

// Crear plantilla (profesor)
router.post('/evaluations', evaluationController.crearPlantilla);

// Obtener plantilla
router.get('/evaluations/:id', verifyToken, evaluationController.obtenerPlantilla);

// Responder evaluación (estudiante)
router.post('/evaluations/:id/submit', verifyToken, evaluationController.responderEvaluacion);

export default router;

import express from 'express';
import { evaluationController } from '../controllers/evaluation.controller.js';
import { verifyToken } from '../../auth/middleware/auth.middleware.js';

const router = express.Router();

// Listar plantillas (profesor)
router.get('/evaluations', evaluationController.obtenerPlantillas);

// Crear plantilla (profesor) - permite pruebas locales sin token
// Si quieres exigir autenticación, vuelve a añadir `verifyToken` aquí.
router.post('/evaluations', evaluationController.crearPlantilla);

// Obtener plantilla
router.get('/evaluations/:id', verifyToken, evaluationController.obtenerPlantilla);

// Responder evaluación (estudiante)
router.post('/evaluations/:id/submit', verifyToken, evaluationController.responderEvaluacion);

export default router;

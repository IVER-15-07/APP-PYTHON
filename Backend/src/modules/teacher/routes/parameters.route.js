import express from 'express';
import { getParameters } from '../controllers/parameters.controller.js';

const router = express.Router();

// Obtener tipos de parámetros (tipos de pregunta)
router.get('/parameters', getParameters);

export default router;

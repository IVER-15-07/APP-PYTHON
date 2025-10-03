import express from 'express'
import { usuarioController } from '../controllers/usuarioController.js'

const router = express.Router()

// Rutas para usuarios
router.get('/usuarios', usuarioController.obtenerTodos)           // GET /api/usuarios
router.get('/usuarios/:id', usuarioController.obtenerPorId)       // GET /api/usuarios/1
router.post('/usuarios', usuarioController.crear)                 // POST /api/usuarios
router.put('/usuarios/:id', usuarioController.actualizar)         // PUT /api/usuarios/1
router.delete('/usuarios/:id', usuarioController.eliminar)        // DELETE /api/usuarios/1

export default router
import { usuarioService } from '../services/usuarioService.js'

export const usuarioController = {
    // GET /api/usuarios
    async obtenerTodos(req, res) {
        try {
            const usuarios = await usuarioService.obtenerTodos()
            
            res.status(200).json({
                exito: true,
                mensaje: 'Usuarios obtenidos correctamente',
                datos: usuarios
            })
        } catch (error) {
            res.status(500).json({
                exito: false,
                mensaje: error.message
            })
        }
    },

    // GET /api/usuarios/:id
    async obtenerPorId(req, res) {
        try {
            const { id } = req.params
            const usuario = await usuarioService.obtenerPorId(id)
            
            res.status(200).json({
                exito: true,
                mensaje: 'Usuario encontrado',
                datos: usuario
            })
        } catch (error) {
            const codigoEstado = error.message.includes('no encontrado') ? 404 : 400
            res.status(codigoEstado).json({
                exito: false,
                mensaje: error.message
            })
        }
    },

    // POST /api/usuarios
    async crear(req, res) {
        try {
            const nuevoUsuario = await usuarioService.crear(req.body)
            
            res.status(201).json({
                exito: true,
                mensaje: 'Usuario creado correctamente',
                datos: nuevoUsuario
            })
        } catch (error) {
            const codigoEstado = error.message.includes('ya está registrado') ? 409 : 400
            res.status(codigoEstado).json({
                exito: false,
                mensaje: error.message
            })
        }
    },

    // PUT /api/usuarios/:id
    async actualizar(req, res) {
        try {
            const { id } = req.params
            const usuarioActualizado = await usuarioService.actualizar(id, req.body)
            
            res.status(200).json({
                exito: true,
                mensaje: 'Usuario actualizado correctamente',
                datos: usuarioActualizado
            })
        } catch (error) {
            const codigoEstado = error.message.includes('no encontrado') ? 404 : 400
            res.status(codigoEstado).json({
                exito: false,
                mensaje: error.message
            })
        }
    },

    // DELETE /api/usuarios/:id
    async eliminar(req, res) {
        try {
            const { id } = req.params
            const resultado = await usuarioService.eliminar(id)
            
            res.status(200).json({
                exito: true,
                mensaje: resultado.mensaje
            })
        } catch (error) {
            const codigoEstado = error.message.includes('no encontrado') ? 404 : 500
            res.status(codigoEstado).json({
                exito: false,
                mensaje: error.message
            })
        }
    }
}
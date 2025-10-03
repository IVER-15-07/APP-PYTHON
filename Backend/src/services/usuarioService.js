import { usuarioRepository } from '../repositories/usuarioRepositorio.js'

export const usuarioService = {
    // Obtener todos los usuarios
    async obtenerTodos() {
        try {
            const usuarios = await usuarioRepository.obtenerTodos()
            return usuarios
        } catch (error) {
            throw new Error(`Error al obtener usuarios: ${error.message}`)
        }
    },

    // Obtener usuario por ID
    async obtenerPorId(id) {
        try {
            // Validar que el ID sea un número
            if (!id || isNaN(id)) {
                throw new Error('ID inválido')
            }

            const usuario = await usuarioRepository.obtenerPorId(id)
            
            if (!usuario) {
                throw new Error('Usuario no encontrado')
            }

            // No devolver la contraseña
            const { contrasena, ...usuarioSinContrasena } = usuario
            return usuarioSinContrasena
        } catch (error) {
            throw new Error(error.message)
        }
    },

    // Crear usuario
    async crear(datosUsuario) {
        try {
            // Validaciones de negocio
            const { nombre, email, contrasena, rol_usuarioId, cursoId } = datosUsuario

            // Validar campos obligatorios
            if (!nombre || !email || !contrasena) {
                throw new Error('Nombre, email y contraseña son obligatorios')
            }

            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(email)) {
                throw new Error('Formato de email inválido')
            }

            // Verificar que el email no exista
            const usuarioExistente = await usuarioRepository.obtenerPorEmail(email)
            if (usuarioExistente) {
                throw new Error('El email ya está registrado')
            }

            // Crear el usuario
            const nuevoUsuario = await usuarioRepository.crear({
                nombre,
                email,
                contrasena, // En producción: hashear la contraseña
                rol_usuarioId: parseInt(rol_usuarioId),
                cursoId: parseInt(cursoId)
            })

            // No devolver la contraseña
            const { contrasena: _, ...usuarioSinContrasena } = nuevoUsuario
            return usuarioSinContrasena

        } catch (error) {
            throw new Error(error.message)
        }
    },

    // Actualizar usuario
    async actualizar(id, datosUsuario) {
        try {
            // Verificar que el usuario existe
            const usuarioExistente = await this.obtenerPorId(id)
            if (!usuarioExistente) {
                throw new Error('Usuario no encontrado')
            }

            // Si se quiere cambiar el email, verificar que no esté en uso
            if (datosUsuario.email) {
                const usuarioConEmail = await usuarioRepository.obtenerPorEmail(datosUsuario.email)
                if (usuarioConEmail && usuarioConEmail.id !== parseInt(id)) {
                    throw new Error('El email ya está en uso')
                }
            }

            const usuarioActualizado = await usuarioRepository.actualizar(id, datosUsuario)
            
            // No devolver la contraseña
            const { contrasena, ...usuarioSinContrasena } = usuarioActualizado
            return usuarioSinContrasena

        } catch (error) {
            throw new Error(error.message)
        }
    },

    // Eliminar usuario
    async eliminar(id) {
        try {
            // Verificar que el usuario existe
            await this.obtenerPorId(id)

            // Eliminar usuario
            await usuarioRepository.eliminar(id)
            return { mensaje: 'Usuario eliminado correctamente' }

        } catch (error) {
            throw new Error(error.message)
        }
    }
}
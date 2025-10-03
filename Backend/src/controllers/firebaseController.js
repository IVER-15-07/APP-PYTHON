// Backend/src/controllers/firebaseController.js
import { firebaseAdmin } from '../config/firebaseAdmin.js';
import { usuarioRepository } from '../repositories/usuarioRepositorio.js';
import jwt from 'jsonwebtoken';

export const firebaseController = {
  // Verificar token de Firebase y crear/obtener usuario
  async verificarYCrearUsuario(req, res) {
    try {
      const { firebaseToken, userData } = req.body;

      if (!firebaseToken) {
        return res.status(400).json({
          exito: false,
          mensaje: 'Token de Firebase requerido'
        });
      }

      // Verificar token de Firebase
      let decodedToken;
      try {
        decodedToken = await firebaseAdmin.auth().verifyIdToken(firebaseToken);
      } catch (error) {
        console.error('Error verificando token:', error);
        return res.status(401).json({
          exito: false,
          mensaje: 'Token de Firebase inválido'
        });
      }

      const { uid, email, name, picture } = decodedToken;

      // Buscar usuario existente por email
      let usuario = await usuarioRepository.buscarPorEmail(email);

      if (!usuario) {
        // Crear nuevo usuario
        try {
          usuario = await usuarioRepository.crear({
            nombre: name || userData?.name || 'Usuario Firebase',
            email: email,
            firebaseUid: uid,
            profilePicture: picture || userData?.photoURL || null,
            provider: 'firebase',
            contrasena: null, // No necesita contraseña para Firebase
            rol_usuarioId: 1, // Estudiante por defecto
            cursoId: 1 // Curso por defecto
          });
          
          console.log('Nuevo usuario creado:', usuario.id);
        } catch (createError) {
          console.error('Error creando usuario:', createError);
          return res.status(500).json({
            exito: false,
            mensaje: 'Error al crear usuario en la base de datos'
          });
        }
      } else {
        // Actualizar UID de Firebase si no existe
        if (!usuario.firebaseUid) {
          usuario = await usuarioRepository.actualizar(usuario.id, {
            firebaseUid: uid,
            provider: 'firebase',
            profilePicture: picture || usuario.profilePicture
          });
        }
      }

      // Generar JWT personalizado para tu aplicación
      const token = jwt.sign(
        {
          id: usuario.id,
          email: usuario.email,
          firebaseUid: uid,
          rol: usuario.rol_usuario?.nombre || 'estudiante'
        },
        process.env.JWT_SECRET || 'tu_jwt_secret_temporal',
        { expiresIn: '24h' }
      );

      res.json({
        exito: true,
        mensaje: 'Autenticación exitosa con Firebase',
        token,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          profilePicture: usuario.profilePicture,
          rol: usuario.rol_usuario?.nombre || 'estudiante',
          provider: usuario.provider
        }
      });

    } catch (error) {
      console.error('Error en autenticación Firebase:', error);
      
      res.status(500).json({
        exito: false,
        mensaje: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Logout (opcional, principalmente limpia del lado del cliente)
  async logout(req, res) {
    try {
      // Firebase logout se maneja principalmente en el frontend
      // Aquí puedes agregar lógica adicional si necesitas
      
      res.json({
        exito: true,
        mensaje: 'Logout exitoso'
      });
    } catch (error) {
      console.error('Error en logout:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error al hacer logout'
      });
    }
  },

  // Verificar estado de autenticación
  async verificarAuth(req, res) {
    try {
      // Este endpoint usará el middleware de autenticación
      const usuario = req.usuario; // Viene del middleware
      
      res.json({
        exito: true,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          profilePicture: usuario.profilePicture,
          rol: usuario.rol_usuario?.nombre,
          provider: usuario.provider
        }
      });
    } catch (error) {
      console.error('Error verificando auth:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error al verificar autenticación'
      });
    }
  }
};
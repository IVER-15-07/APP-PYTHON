// Backend/src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import { usuarioRepository } from '../repositories/usuarioRepositorio.js';

export const verificarToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Token no proporcionado'
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_jwt_secret_temporal');
      
      // Buscar usuario en la base de datos
      const usuario = await usuarioRepository.buscarPorId(decoded.id);
      
      if (!usuario) {
        return res.status(401).json({
          exito: false,
          mensaje: 'Usuario no encontrado'
        });
      }

      // Agregar usuario a la request
      req.usuario = usuario;
      next();
      
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          exito: false,
          mensaje: 'Token expirado'
        });
      }
      
      return res.status(401).json({
        exito: false,
        mensaje: 'Token inválido'
      });
    }

  } catch (error) {
    console.error('Error en middleware de auth:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

export const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Usuario no autenticado'
      });
    }

    const rolUsuario = req.usuario.rol_usuario?.nombre;
    
    if (!rolesPermitidos.includes(rolUsuario)) {
      return res.status(403).json({
        exito: false,
        mensaje: 'No tienes permisos para realizar esta acción'
      });
    }

    next();
  };
};
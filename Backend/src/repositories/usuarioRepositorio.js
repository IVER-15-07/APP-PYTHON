import prisma from '../config/database.js'

export const usuarioRepository = {
    // Obtener todos los usuarios
    async obtenerTodos() {
        return await prisma.usuario.findMany({
            include: {
                rol_usuario: true,  // Incluir la relación
                curso: true
            }
        })
    },

    // Obtener por ID
    async obtenerPorId(id) {
        return await prisma.usuario.findUnique({
            where: { id: parseInt(id) },
            include: {
                rol_usuario: true,
                curso: true
            }
        })
    },

    // Obtener por email
    async obtenerPorEmail(email) {
        return await prisma.usuario.findUnique({
            where: { email }
        })
    },

    // Crear usuario
    async crear(datosUsuario) {
        return await prisma.usuario.create({
            data: datosUsuario,
            include: {
                rol_usuario: true,
                curso: true
            }
        })
    },

    // Actualizar usuario
    async actualizar(id, datosUsuario) {
        return await prisma.usuario.update({
            where: { id: parseInt(id) },
            data: datosUsuario,
            include: {
                rol_usuario: true,
                curso: true
            }
        })
    },

    // Eliminar usuario
    async eliminar(id) {
        return await prisma.usuario.delete({
            where: { id: parseInt(id) }
        })
    },


    async buscarPorEmail(email) {
    return await prisma.usuario.findUnique({
      where: { email },
      include: {
        rol_usuario: true,
        curso: true
      }
    });
  },

  async buscarPorId(id) {
    return await prisma.usuario.findUnique({
      where: { id: parseInt(id) },
      include: {
        rol_usuario: true,
        curso: true
      }
    });
  },

  async buscarPorFirebaseUid(firebaseUid) {
    return await prisma.usuario.findUnique({
      where: { firebaseUid },
      include: {
        rol_usuario: true,
        curso: true
      }
    });
  },

  async crear(datos) {
    return await prisma.usuario.create({
      data: datos,
      include: {
        rol_usuario: true,
        curso: true
      }
    });
  },

  async actualizar(id, datos) {
    return await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: datos,
      include: {
        rol_usuario: true,
        curso: true
      }
    });
  },

  async eliminar(id) {
    return await prisma.usuario.delete({
      where: { id: parseInt(id) }
    });
  },

  async obtenerTodos() {
    return await prisma.usuario.findMany({
      include: {
        rol_usuario: true,
        curso: true
      }
    });
  }


}
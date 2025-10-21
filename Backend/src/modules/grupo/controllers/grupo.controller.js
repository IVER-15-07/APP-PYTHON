import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Unirse a un grupo mediante código
 */
export const joinGroupByCode = async (req, res) => {
  const { codigo, usuarioId } = req.body;

  try {
    // Buscar grupo por código
    const grupo = await prisma.grupo.findUnique({
      where: { codigo: parseInt(codigo) },
    });

    if (!grupo) {
      return res.status(404).json({ message: "Código inválido." });
    }

    // Verificar si el usuario ya pertenece a un grupo
    const yaRegistrado = await prisma.registro.findFirst({
      where: { usuarioId: parseInt(usuarioId) },
    });

    if (yaRegistrado) {
      return res.status(400).json({ message: "Ya perteneces a un grupo." });
    }

    // Crear nuevo registro en la tabla Registro
    await prisma.registro.create({
      data: {
        usuarioId: parseInt(usuarioId),
        grupoId: grupo.id,
      },
    });

    // Obtener niveles
    const niveles = await prisma.nivel.findMany();

    res.json({
      message: "Te has unido correctamente al grupo.",
      grupo,
      niveles,
    });
  } catch (error) {
    console.error("Error en joinGroupByCode:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

/**
 * Verificar si un usuario ya pertenece a un grupo
 */
export const getUserGroup = async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const registro = await prisma.registro.findFirst({
      where: { usuarioId: parseInt(usuarioId) },
      include: { grupo: true },
    });

    if (!registro) {
      return res.json({ grupo: null, niveles: [] });
    }

    const niveles = await prisma.nivel.findMany();

    res.json({
      grupo: registro.grupo,
      niveles,
    });
  } catch (error) {
    console.error("Error en getUserGroup:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};





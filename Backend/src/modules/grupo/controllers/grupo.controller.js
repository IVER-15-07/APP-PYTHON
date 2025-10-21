// Backend/src/modules/grupo/controllers/grupo.controller.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const joinGroupByCode = async (req, res) => {
  const { codigo, id_usuario } = req.body;

  try {
    // Buscar grupo por código
    const grupo = await prisma.grupo.findUnique({
      where: { codigo: parseInt(codigo) },
    });

    if (!grupo) {
      return res.status(404).json({ message: "Código inválido." });
    }

    // Verificar si el usuario ya pertenece a ese grupo
    const yaRegistrado = await prisma.registro.findFirst({
      where: {
        usuarioId: parseInt(id_usuario),
        grupoId: grupo.id,
      },
    });

    if (yaRegistrado) {
      return res.status(400).json({ message: "Ya perteneces a este grupo." });
    }

    // Insertar nuevo registro
    await prisma.registro.create({
      data: {
        usuarioId: parseInt(id_usuario),
        grupoId: grupo.id,
      },
    });

    // Obtener niveles (puedes ajustar según tu lógica)
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




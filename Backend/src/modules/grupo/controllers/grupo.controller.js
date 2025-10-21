import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ✅ Controlador para unirse a un grupo por código y obtener los niveles
export const joinGroupByCode = async (req, res) => {
  const { codigo } = req.body;

  try {
    const grupo = await prisma.grupo.findUnique({
      where: { codigo: parseInt(codigo) },
    });

    if (!grupo) {
      return res.status(404).json({ message: "Código inválido." });
    }

    // Si existe el grupo, devolvemos todos los niveles
    const niveles = await prisma.nivel.findMany();

    res.json({
      message: "Te has unido correctamente al grupo.",
      grupo: grupo,
      niveles: niveles,
    });
  } catch (error) {
    console.error("Error en joinGroupByCode:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};



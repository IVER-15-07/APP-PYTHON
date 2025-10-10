import prisma from "../config/database.js";

export const courseRepository = {
  create: (data) =>
    prisma.curso.create({ data }),

  findByProfesor: (profesorId) =>
    prisma.curso.findMany({
      where: { profesorId: Number(profesorId) },
      orderBy: { createdAt: "desc" },
    }),
};
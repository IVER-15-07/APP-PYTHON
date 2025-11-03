import prisma from '../../../config/database.js';

export const updateCourse = async (courseId, courseData) => {
  return await prisma.curso.update({
    where: { id: Number(courseId) },
    data: {
      nombre: courseData.nombre,
      descripcion: courseData.descripcion,
    },
  });
};

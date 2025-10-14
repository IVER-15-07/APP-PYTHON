
import prisma from "../../../config/database.js";

export const courseRepository = {
  findAll: async () => {
    return prisma.grupo_Topico.findMany({
      
      orderBy: { id: "asc" }
    });
  },


};
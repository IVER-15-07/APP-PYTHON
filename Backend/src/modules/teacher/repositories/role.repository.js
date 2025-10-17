import prisma from "../../../config/database.js";

export const roleRepository = {

     findById: (id) => prisma.rol_usuario.findUnique({ where: { id } }),
 
           

};
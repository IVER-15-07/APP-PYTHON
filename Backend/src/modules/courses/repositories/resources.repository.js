import prisma from "../../../config/database.js";
export const recursosRepository = {
  createResource: (data) => prisma.recursos.create({ data }),
  createManyResources: (dataArray) => prisma.recursos.createMany({ data: dataArray }),
};
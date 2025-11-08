import prisma from "../../../config/database.js";
export const recursosRepository = {
  createResource: (data) => prisma.recursos.create({ data }),
  createManyResources: (dataArray) => prisma.recursos.createMany({ data: dataArray }),

  findById: (id) =>
    prisma.recursos.findUnique({
      where: { id: Number(id) },
    }),

    findByTopicId: (topicId) =>
    prisma.recursos.findMany({
      where: { topicoId: Number(topicId) },
    }),

  updateResource: (id, data) =>
    prisma.recursos.update({
      where: { id: Number(id) },
      data,
    }),


    deleteResource: (id) =>
    prisma.recursos.delete({
      where: { id: Number(id) },
    }),

    deleteByIds : (ids) =>
    prisma.recursos.deleteMany({
      where: { id: { in: ids.map(Number) } },
    }),

    findSingleByTopicId : (id) =>
    prisma.recursos.findFirst({
      where: { topicoId: Number(id) },
    }),


};
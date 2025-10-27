import prisma from "../../../config/database.js";

export const topicoRepository = {

     createTopico: (data) => prisma.topico.create({
        data
    }), 

    findTopicoById: (id) => prisma.topico.findUnique({
        where: { id }
    }),



}
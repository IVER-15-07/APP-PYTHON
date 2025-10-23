import prisma from "../../../config/database.js";

export const pendingRepository = {
  invalidateAllByEmail: (email) =>
    prisma.registroPendiente.updateMany({
      where: { email, usado: false },
      data: { usado: true },
    }),

  create: (data) => prisma.registroPendiente.create({ data }),

  findValidByEmailAndCode: (email, code) =>
    prisma.registroPendiente.findFirst({
      where: { email, code, usado: false, expira: { gt: new Date() } },
    }),

  marcaUsada: (id) =>
    prisma.registroPendiente.update({ where: { id }, data: { usado: true } }),
};
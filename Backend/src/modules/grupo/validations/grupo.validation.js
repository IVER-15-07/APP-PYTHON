import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const GrupoRepository = {
  findByCodigo: async (codigo) => {
    return prisma.grupo.findUnique({ where: { codigo: parseInt(codigo) } });
  },
  findRegistroByUsuario: async (usuarioId) => {
    return prisma.registro.findFirst({ where: { usuarioId: parseInt(usuarioId) } });
  },
  crearRegistro: async (usuarioId, grupoId) => {
    return prisma.registro.create({ data: { usuarioId, grupoId } });
  },
  getNiveles: async () => {
    return prisma.nivel.findMany();
  },
};

export const validateGroupPayload = ({ titulo, descripcion, fecha_ini, fecha_fin }) => {
  if (titulo == null || String(titulo).trim().length < 5) {
    throw { status: 400, message: "El título debe tener al menos 5 caracteres." };
  }

  if (descripcion == null || String(descripcion).trim().length < 15) {
    throw { status: 400, message: "La descripción debe tener al menos 15 caracteres." };
  }

  if (!fecha_ini || !fecha_fin) {
    throw { status: 400, message: "Las fechas de inicio y fin son obligatorias." };
  }

  const inicio = new Date(fecha_ini);
  const fin = new Date(fecha_fin);

  if (Number.isNaN(inicio.getTime()) || Number.isNaN(fin.getTime())) {
    throw { status: 400, message: "Formato de fecha inválido. Usa ISO (YYYY-MM-DD)." };
  }

  const hoy = new Date();
  const hoySinHora = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  const inicioSinHora = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate());

  if (inicioSinHora < hoySinHora) {
    throw { status: 400, message: "La fecha de inicio no puede ser menor a la fecha actual." };
  }

  if (fin < inicio) {
    throw { status: 400, message: "La fecha de finalización no puede ser menor a la fecha de inicio." };
  }

  const msEnAnio = 1000 * 60 * 60 * 24 * 365;
  if ((fin - inicio) > msEnAnio) {
    throw { status: 400, message: "La duración del curso no puede ser mayor a 1 año." };
  }

  return {
    titulo: String(titulo).trim(),
    descripcion: String(descripcion).trim(),
    fecha_ini: inicio.toISOString(),
    fecha_fin: fin.toISOString()
  };
};


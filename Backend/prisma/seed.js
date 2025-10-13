// prisma/seed.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Insertando datos semilla...");
await prisma.rol_usuario.upsert({
    where: { nombre: "Administrador" },
    update: {},
    create: { nombre: "Administrador" },
  });

  await prisma.rol_usuario.upsert({
    where: { nombre: "Profesor ejecutor" },
    update: {},
    create: { nombre: "Profesor ejecutor" },
  });

  await prisma.rol_usuario.upsert({
    where: { nombre: "Profesor editor" },
    update: {},
    create: { nombre: "Profesor editor" },
  });

  await prisma.rol_usuario.upsert({
    where: { nombre: "Estudiante" },
    update: {},
    create: { nombre: "Estudiante" },
  });

  console.log("✅ Datos semilla insertados correctamente.");
}
main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

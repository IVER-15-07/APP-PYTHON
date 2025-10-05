// prisma/seed.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Insertando datos semilla...");
  await prisma.rol_usuario.upsert({
    where: { nombre: "Estudiante" },
    update: {},
    create: { nombre: "Estudiante" }
  });

  await prisma.rol_usuario.upsert({
    where: { nombre: "Profesor" },
    update: {},
    create: { nombre: "Profesor" }
  });

  console.log("✅ Datos semilla insertados correctamente.");
}
main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

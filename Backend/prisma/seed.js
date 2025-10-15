// prisma/seed.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import seedRoles from "./seeds/role.js";
import seedCursos from "./seeds/course.js";
import seedEstados from "./seeds/state.js";
import seedAdmin from "./seeds/admin.js";



async function main() {
  console.log(" 🌱 Iniciando seed...");

  await seedRoles(prisma);
  await seedCursos(prisma);
  await seedEstados(prisma);
  await seedAdmin(prisma);


  console.log("🌟 Seed completado");
}
main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

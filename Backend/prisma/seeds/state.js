export default async function seedEstados(prisma) {
  const estados = [
    { nombre: "progreso" },
    { nombre: "completado" },
    { nombre: "pendiente" },
  ];

  for (const e of estados) {
    await prisma.estado.upsert({
      where: { nombre: e.nombre },
      update: {},
      create: e,
    });
  }

  console.log("Seed de estados completado ✅");
}
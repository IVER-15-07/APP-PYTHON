export default async function seedParametros(prisma) {
  
  await prisma.parametro.upsert({
    where: { nombre: "Selección Múltiple" },
    update: {},
    create: { nombre: "Selección Múltiple" },
  });

  await prisma.parametro.upsert({
    where: { nombre: "Selección Simple" },
    update: {},
    create: { nombre: "Selección Simple" },
  });

  await prisma.parametro.upsert({
    where: { nombre: "Verdadero Falso" },
    update: {},
    create: { nombre: "Verdadero Falso" },
  });

  await prisma.parametro.upsert({
    where: { nombre: "Respuesta Corta" },
    update: {},
    create: { nombre: "Respuesta Corta" },
  });

  console.log("✅ Parámetros creados correctamente");
}
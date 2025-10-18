 export default async function seedRoles(prisma) {
 
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

  await prisma.rol_usuario.upsert({
    where: { nombre: "usuario" },
    update: {},
    create: { nombre: "usuario" },
  });
}
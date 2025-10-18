import bcrypt from "bcryptjs";

export default async function seedAdmin(prisma) {
  // email y contraseña del admin
  const email = "admin@gmail.com";
  const plainPassword = "adminSecreto123";

  // buscar rol administrador
  const rol = await prisma.rol_usuario.findFirst({ where: { nombre: "Administrador" } });
  if (!rol) {
    throw new Error("No se encontró el rol 'Administrador'. Ejecuta seedRoles primero.");
  }

  // hashear contraseña
  const hashed = await bcrypt.hash(plainPassword, 10);

  // upsert del usuario admin por email
  await prisma.usuario.upsert({
    where: { email },
    update: {
      nombre: "Administrador",
      contrasena: hashed,
      rol_usuarioId: rol.id
    },
    create: {
      nombre: "Administrador",
      email,
      contrasena: hashed,
      rol_usuarioId: rol.id
    }
  });

  console.log("Seed admin completado ✅ (email: %s, pass: %s)", email, plainPassword);
}
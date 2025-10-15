// ...existing code...
export default async function seedCursos(prisma) {
  // 1) Crear o recuperar el curso (por nombre)
  const cursoData = {
    nombre: "Introducción a Python"
  };

  // upsert por nombre (nombre es UNIQUE en tu schema)
  const curso = await prisma.curso.upsert({
    where: { nombre: cursoData.nombre },
    update: {},
    create: cursoData,
  });

  // 2) Niveles que quieres asignar al curso creado
  const niveles = [
    "Primeros Pasos",
    "Operadores",
    "Estructura de Control de flujo",
    "Funciones y Excepciones",
    "Estructuras de Datos",
    "Clases y Objetos"
  ];

  // 3) Crear niveles vinculados al curso (si no existen para ese curso)
  for (const nombre of niveles) {
    const exists = await prisma.nivel.findFirst({
      where: {
        nombre,
        cursoId: curso.id
      }
    });

    if (!exists) {
      await prisma.nivel.create({
        data: {
          nombre,
          cursoId: curso.id
        }
      });
    }
  }

  console.log(`Seed: curso (${curso.nombre}) y ${niveles.length} niveles asegurados (cursoId=${curso.id}).`);
}
// ...existing code...
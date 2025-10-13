export default async function seedGrupoTopico(prisma) {
  const grupos = [
    { nombreNivel: "Primeros Pasos" },
    { nombreNivel: "Operadores" },
    { nombreNivel: "Estructura de Control de flujo" },
    { nombreNivel: "Funciones y Excepciones" },
    { nombreNivel: "Estructuras de Datos" },
    { nombreNivel: "Clases y Objetos" },
  ];

  for (const g of grupos) {
    await prisma.grupo_Topico.create({
      data: g, // Prisma asignará id automáticamente
    });
  }

  console.log("Seed de Grupo_Topico completado ✅");
}
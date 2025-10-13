export default async function seedCursos(prisma) {

  const grupos = [
    { nombreNivel: "Primeros Pasos" },
    { nombreNivel: "Operadores" },
    { nombreNivel: "Estructura de Control de flujo" },
    { nombreNivel: "Funciones y Excepciones" },
    { nombreNivel: "Estructuras de Datos" },
    { nombreNivel: "Clases y Objetos" },
    
  ];

  // Insertar/actualizar de forma programática
  for (const g of grupos) {
    await prisma.grupo_Topico.upsert({
      where: { nombreNivel: g.nombreNivel },
      update: {},
      create: g,
    });
  }
}
export default async function typeExamSeed(prisma) {

    try {
        await prisma.tipo_evaluacion.createMany({
            data: [
                { nombre: "evaluacion" },
                { nombre: "diagnostico" },
            ],
            skipDuplicates: true,
        });
        console.log("Tipos de evaluacion insertados correctamente ✅");
    } catch (error) {
        console.error("❌ Error al insertar tipos de evaluacion:", error);
    }
}
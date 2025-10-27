export default async function seedTypeTopics(prisma) {
    try {
        await prisma.tipo_topico.createMany({
            data: [
                { nombre: "texto" },
                { nombre: "video" },
                { nombre: "slide" },
            ],
            skipDuplicates: true,
        });

        console.log("Tipos de tópico insertados correctamente ✅");
    } catch (error) {
        console.error("❌ Error al insertar tipos de tópico:", error);
    }

}
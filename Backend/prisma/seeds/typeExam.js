export default async function typeParametro(prisma) {
    try {
        await prisma.parametro.createMany({
            data: [
                { nombre: "seleccion multiple" },
                { nombre: "complementacion" },
            ],
            skipDuplicates: true,


        });
        console.log("Tipos de  parametro insertados correctamente ✅");

    } catch (error) {
        console.error("❌ Error al insertar tipos de parametro:", error);
    }

}
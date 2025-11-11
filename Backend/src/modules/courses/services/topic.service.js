import cloudinary from "../../../config/cloudinary.js";
import { topicoRepository } from "../repositories/topico.repository.js";
import { recursosRepository } from "../repositories/resources.repository.js";

export const topicService = {

    async createTopicWithResource(data, files) {
        try {
    
            const newTopic = await topicoRepository.createTopic({
                nombre: data.nombre,
                descripcion: data.descripcion,
                tipo_topicoId: Number(data.tipo_topicoId),
                nivelId: Number(data.nivelId),
            });

            if (!files || files.length === 0) {
                throw new Error("Se requiere al menos un archivo para crear un recurso");
            }

            const recurso = {
                nombre: `recursos_topico_${newTopic.id}`,
                url: null,          // ← URL PRINCIPAL (según tipo_topicoId)
                imagenurl: null,    // ← Adjunto: Imagen/miniatura
                audiourl: null,     // ← Adjunto: Audio
                subtitulo: null,    // ← Adjunto: Subtítulos
                publicId: null,
                topicoId: newTopic.id,
            };

            let archivoPrincipal = null;
            let archivoImagen = null;
            let archivoAudio = null;
            let archivoSubtitulo = null;
            for (const file of files) {
                const isImage = file.mimetype.startsWith("image/");
                const isAudio = file.mimetype.startsWith("audio/");
                const isVideo = file.mimetype.startsWith("video/");
                const isText = file.mimetype.startsWith("text/") || file.mimetype === "application/x-subrip";
                const isPdf = file.mimetype === "application/pdf";
                const isDoc = file.mimetype === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
                    file.mimetype === "application/vnd.ms-powerpoint";

                // Clasificar según tipo de archivo
                if (isImage) {
                    archivoImagen = file;
                } else if (isAudio) {
                    archivoAudio = file;
                } else if (isText) {
                    archivoSubtitulo = file;
                } else if (isPdf || isDoc || isVideo) {
                    // Estos pueden ser principales
                    archivoPrincipal = file;
                }
            }

            const tipoTopicoId = newTopic.tipo_topicoId;

            let archivoParaUrl = null;

            if (tipoTopicoId === 1) {
                // Tipo VIDEO: buscar video o audio
                archivoParaUrl = archivoPrincipal || archivoAudio;
            } else if (tipoTopicoId === 2) {
                // Tipo TEXTO: buscar PDF
                archivoParaUrl = archivoPrincipal;
            } else if (tipoTopicoId === 3) {
                // Tipo SLIDES: buscar presentación
                archivoParaUrl = archivoPrincipal;
            }

            if (!archivoParaUrl) {
                throw new Error("No se encontró un archivo principal válido para el tipo de tópico");
            }

            // 6️⃣ Subir archivo PRINCIPAL (para url)
            const isPdf = archivoParaUrl.mimetype === "application/pdf";
            const isVideoOrAudio = archivoParaUrl.mimetype.startsWith("video/") || archivoParaUrl.mimetype.startsWith("audio/");
            const isDoc = archivoParaUrl.mimetype.includes("presentation");

            const resourceTypePrincipal = isVideoOrAudio ? "video" : (isPdf || isDoc ? "raw" : "image");

            const uploadPrincipal = await cloudinary.uploader.upload(archivoParaUrl.path, {
                resource_type: resourceTypePrincipal,
                folder: "recursos",
                type: "upload",
            });

            recurso.url = uploadPrincipal.secure_url;
            recurso.publicId = uploadPrincipal.public_id;

            console.log(`✅ Archivo principal subido: ${archivoParaUrl.originalname} → ${recurso.url}`);

            // 7️⃣ Subir archivos ADJUNTOS (imagen, audio, subtítulo)

            // Subir IMAGEN (si existe y no es la principal)
            if (archivoImagen) {
                const uploadImagen = await cloudinary.uploader.upload(archivoImagen.path, {
                    resource_type: "image",
                    folder: "recursos",
                    type: "upload",
                });
                recurso.imagenurl = uploadImagen.secure_url;
                console.log(`✅ Imagen adjunta subida: ${archivoImagen.originalname}`);
            }

            // Subir AUDIO (si existe y no es la principal)
            if (archivoAudio && archivoAudio !== archivoParaUrl) {
                const uploadAudio = await cloudinary.uploader.upload(archivoAudio.path, {
                    resource_type: "video",
                    folder: "recursos",
                    type: "upload",
                });
                recurso.audiourl = uploadAudio.secure_url;
                console.log(`✅ Audio adjunto subido: ${archivoAudio.originalname}`);
            }

            // Subir SUBTÍTULO (si existe)
            if (archivoSubtitulo) {
                const uploadSubtitulo = await cloudinary.uploader.upload(archivoSubtitulo.path, {
                    resource_type: "raw",
                    folder: "recursos",
                    type: "upload",
                });
                recurso.subtitulo = uploadSubtitulo.secure_url;
                console.log(`✅ Subtítulo adjunto subido: ${archivoSubtitulo.originalname}`);
            }

            // 8️⃣ Crear recurso en la base de datos
            const recursoCreado = await recursosRepository.createResource(recurso);

            console.log("📦 Recurso creado:", {
                url: recurso.url,
                imagenurl: recurso.imagenurl,
                audiourl: recurso.audiourl,
                subtitulo: recurso.subtitulo
            });

            return {
                message: "Tópico y recurso creados exitosamente",
                topic: newTopic,
                resource: recursoCreado,
            };
        } catch (error) {

            throw new Error(`Error al crear tópico y recurso: ${error.message}`);
        }
    },

    async getAllTopics() {
        const topics = await topicoRepository.getAllTopics();
        return topics;
    },

    async updateTopicWithResources(topicId, data, files) {
        const id = Number(topicId);

        // Obtener tópico
        const topic = await topicoRepository.getTopicById(id);
        if (!topic) throw new Error("Tópico no encontrado");

        // Actualizar solo los campos que vienen
        const updateData = {};
        if (data.nombre !== undefined) updateData.nombre = data.nombre;
        if (data.descripcion !== undefined) updateData.descripcion = data.descripcion;
        if (data.tipo_topicoId !== undefined) updateData.tipo_topicoId = Number(data.tipo_topicoId);
        if (data.nivelId !== undefined) updateData.nivelId = Number(data.nivelId);

        if (Object.keys(updateData).length > 0) {
            await topicoRepository.updateTopic(id, updateData);
        }

        // Obtener recurso existente
        const recurso = await recursosRepository.findSingleByTopicId(id);
        if (!recurso) throw new Error("El recurso del tópico no existe");

        const patch = {};

        // Map de tipos MIME a campos en la base
        const typeMap = [
            { test: mimetype => mimetype.startsWith("image/"), field: "imagenurl", cloudType: "image" },
            { test: mimetype => mimetype.startsWith("audio/"), field: "audiourl", cloudType: "video" },
            { test: mimetype => mimetype.startsWith("text/") || mimetype === "application/x-subrip" || mimetype === "application/octet-stream", field: "subtitulo", cloudType: "image" },
        ];

        for (const file of (files || [])) {
            for (const { test, field, cloudType } of typeMap) {
                if (test(file.mimetype)) {
                    const upload = await cloudinary.uploader.upload(file.path, {
                        resource_type: cloudType,
                        public_id: recurso.publicId,
                        overwrite: true,
                        invalidate: true,
                    });
                    patch[field] = upload.secure_url;
                    patch.publicId = upload.public_id;
                }
            }
        }

        // Actualizar URL principal según data.main
        if (data.main && patch[data.main] || recurso[data.main]) {
            patch.url = patch[data.main] || recurso[data.main];
        }

        if (Object.keys(patch).length > 0) {
            await recursosRepository.updateResource(recurso.id, patch);
        }

        const updated = await topicoRepository.getTopicById(id);
        return { message: "Tópico y recurso actualizado", topic: updated };
    },


   async getTopicForStudent(id) {
    const topic = await topicoRepository.getTopicById(Number(id));
    if (!topic) {
        throw new Error("Tópico no encontrado");
    }

    // Normalizar recursos
    const recursos = Array.isArray(topic.recursos)
        ? topic.recursos
        : topic.recursos
        ? [topic.recursos]
        : [];

    // Extraer los campos relevantes
    const pick = (field) => recursos.find((r) => r[field])?.[field] || null;

    const url = pick("url");
    const imagen = pick("imagenurl");
    const audio = pick("audiourl");
    const subtitulo = pick("subtitulo");
    const publicId = pick("publicId");

    // Seleccionar urlPrincipal correctamente según tipo_topico
    let principal = null;
    const tipo = topic.tipo_topico?.nombre?.toLowerCase();

    switch (tipo) {
        case "video":
            principal = url || audio || imagen || subtitulo || null;
            break;
        case "texto":
            principal = url || subtitulo || imagen || audio || null;
            break;
        case "slides":
            principal = url || imagen || audio || subtitulo || null;
            break;
        default:
            principal = url || imagen || audio || subtitulo || null;
    }

    // Armar estructura final
    return {
        id: topic.id,
        nombre: topic.nombre,
        descripcion: topic.descripcion,
        nivel: topic.nivel?.nombre || null,
        tipo: topic.tipo_topico?.nombre || null,
        recurso: {
            publicId,
            urlPrincipal: principal,
         
            imagen,
            audio,
            subtitulo,
            media: [
                
                imagen && { tipo: "imagen", url: imagen },
                audio && { tipo: "audio", url: audio },
                subtitulo && { tipo: "subtitulo", url: subtitulo },
            ].filter(Boolean),
        },
    };
}


}


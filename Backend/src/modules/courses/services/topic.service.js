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
                url: null,
                imagenurl: null,
                audiourl: null,
                subtitulo: null,
                publicId: null,
                topicoId: newTopic.id,
            }

            for (const file of files) {
                const isImage = file.mimetype.startsWith("image/");
                const isAudio = file.mimetype.startsWith("audio/");
                const isText = file.mimetype.startsWith("text/") || file.mimetype === "application/x-subrip";
                const isPdf = file.mimetype === "application/pdf";

                const upload = await cloudinary.uploader.upload(file.path, {
                    resource_type: isAudio ? "video" : (isPdf || isText ? "raw" : "image"),
                    folder: "recursos",
                });

                if (!recurso.publicId) {
                    recurso.publicId = upload.public_id;
                }
                if (!recurso.url) {
                    recurso.url = upload.secure_url;
                }
                if (isImage) {
                    recurso.imagenurl = upload.secure_url;
                }
                if (isAudio) {
                    recurso.audiourl = upload.secure_url;
                }
                if (isText) {
                    recurso.subtitulo = upload.secure_url;
                }
            }

            const recursoCreado = await recursosRepository.createResource(recurso);
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
            { test: mimetype => mimetype.startsWith("text/") || mimetype === "application/x-subrip" || mimetype === "application/octet-stream", field: "subtitulo", cloudType: "raw" },
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

        const recursos = Array.isArray(topic.recursos) ? topic.recursos : (topic.recursos ? [topic.recursos] : []);
        let imagen = null, audio = null, subtitulo = null, principal = null, publicId = null;

        if (recursos.length === 1) {
            const recurso = recursos[0];
            imagen = recurso.imagenurl || null;
            audio = recurso.audiourl || null;
            subtitulo = recurso.subtitulo || null;
            principal = recurso.url || imagen || audio || subtitulo || null;
            publicId = recurso.publicId || null;
        } else {
            const pick = (field) => recursos.find(r => r[field])?.[field] || null;

            imagen = pick('imagenurl');
            audio = pick('audiourl');
            subtitulo = pick('subtitulo');
            principal = recursos.find(r => r.url)?.url || imagen || audio || subtitulo || null;
            publicId = recursos.find(r => r.publicId)?.publicId || null;
        }

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
            }

        };
    }

}


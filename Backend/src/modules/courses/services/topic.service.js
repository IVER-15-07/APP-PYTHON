import cloudinary from "../../../config/cloudinary.js";
import { topicoRepository } from "../repositories/topico.repository.js";
import { recursosRepository } from "../repositories/resources.repository.js";

export const topicService = {

    async createTopicWithResource(data, files) {
        try {
            const newTopic = await topicoRepository.createTopic({
                nombre: data.nombre,
                aprobado: data.aprobado === 'true' || data.aprobado === true,
                tipo_topicoId: Number(data.tipo_topicoId),
                nivelId: Number(data.nivelId),
            });

            if (!files || files.length === 0) {
                throw new Error("debe subir al menos un archivo.");
            }
            const recursos = [];
            for (const file of files) {

                const upload = await cloudinary.uploader.upload(file.path, {
                    resource_type: "auto",
                    folder: "recursos",

                });

                const recursoData = {
                    nombre: file.originalname,
                    url: upload.secure_url,
                    topicoId: newTopic.id,
                };

                if (file.mimetype.startsWith("image/")) {
                    recursoData.imagenurl = upload.secure_url;
                } else if (file.mimetype.startsWith("audio/")) {
                    recursoData.audiourl = upload.secure_url;
                } else if (file.mimetype.startsWith("text/")) {
                    recursoData.subtitulo = upload.secure_url;
                }

                recursos.push(recursoData);
            }

            await recursosRepository.createManyResources(recursos);

            return { message: "Tópico y recursos creados exitosamente", topic: newTopic, recursos };

        } catch (error) {
            console.error("Error al crear el tópico con recurso:", error);
            throw new Error(error.message || "Error al crear el tópico con recurso");

        }
    },

    async getAllTopics() {
        const topics = await topicoRepository.getAllTopics();
        return topics;
    }

};


import cloudinary from "../../../config/cloudinary.js";
import { topicoRepository } from "../repositories/topico.repository.js";
import { recursosRepository } from "../repositories/resources.repository.js";

export const topicService = {

    async createTopicWithResource(data, files) {
        try {
            const newTopic = await topicoRepository.createTopic({
                nombre: data.nombre,

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
                    publicId: upload.public_id,
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
    },

    async updateTopicWithResources(topicId, data, files) {
        const id = Number(topicId);
        const topic = await topicoRepository.getTopicById(id);
        if (!topic) throw new Error("Tópico no encontrado");

        // 🔹 1. Actualizar info del tópico
        const updateData = {};
        if (data.nombre) updateData.nombre = data.nombre;
        if (data.tipo_topicoId) updateData.tipo_topicoId = Number(data.tipo_topicoId);
        if (data.nivelId) updateData.nivelId = Number(data.nivelId);
        if (Object.keys(updateData).length > 0)
            await topicoRepository.updateTopic(id, updateData);

        // 🔹 2. Eliminar recursos marcados
        let idsAEliminar = [];
        if (data.deleteResourceIds) {
            try {
                idsAEliminar = Array.isArray(data.deleteResourceIds)
                    ? data.deleteResourceIds.map(Number)
                    : JSON.parse(data.deleteResourceIds);
            } catch {
                throw new Error("Error al procesar deleteResourceIds");
            }
        }

        for (const recursoId of idsAEliminar) {
            const recurso = await recursosRepository.findById(recursoId);
            if (recurso?.publicId) {
                await cloudinary.uploader.destroy(recurso.publicId, {
                    resource_type: "auto",
                });
            }
            await recursosRepository.deleteResource(recursoId);
        }

        // 🔹 3. Reemplazar archivos existentes
        
        const updatedFiles = files.filter(f => f.fieldname === "updatedFiles");
        for (const file of updatedFiles) {
            const recursoId = Number(file.originalname.split("__")[0]); // ej: "4__nombre.png"
            const recursoExistente = await recursosRepository.findById(recursoId);
            if (!recursoExistente) continue;

            const recursoType = file.mimetype.startsWith("image/")
                ? "image"
                : file.mimetype.startsWith("audio/")
                    ? "video"
                    : "raw";

            // Sobrescribir en Cloudinary
            const upload = await cloudinary.uploader.upload(file.path, {
                public_id: recursoExistente.publicId,
                resource_type: recursoType,
                overwrite: true,
                invalidate: true,
            });

            const updatedRecurso = {
                nombre: file.originalname.split("__")[1], // nombre limpio
                url: upload.secure_url,
                imagenurl: null,
                audiourl: null,
                subtitulo: null,
            };

            if (file.mimetype.startsWith("image/"))
                updatedRecurso.imagenurl = upload.secure_url;
            else if (file.mimetype.startsWith("audio/"))
                updatedRecurso.audiourl = upload.secure_url;
            else if (file.mimetype.startsWith("text/") || file.mimetype === "application/pdf")
                updatedRecurso.subtitulo = upload.secure_url;

            await recursosRepository.updateResource(recursoId, updatedRecurso);
        }

        // 🔹 4. Agregar archivos nuevos
        const newFiles = files.filter(f => f.fieldname === "newFiles");
        if (newFiles.length > 0) {
            const nuevosRecursos = [];
            for (const file of newFiles) {
                const upload = await cloudinary.uploader.upload(file.path, {
                    resource_type: "auto",
                    folder: "recursos",
                });

                const dataRecurso = {
                    nombre: file.originalname,
                    url: upload.secure_url,
                    publicId: upload.public_id,
                    topicoId: id,
                    imagenurl: null,
                    audiourl: null,
                    subtitulo: null,
                };

                if (file.mimetype.startsWith("image/"))
                    dataRecurso.imagenurl = upload.secure_url;
                else if (file.mimetype.startsWith("audio/"))
                    dataRecurso.audiourl = upload.secure_url;
                else if (file.mimetype.startsWith("text/") || file.mimetype === "application/pdf")
                    dataRecurso.subtitulo = upload.secure_url;

                nuevosRecursos.push(dataRecurso);
            }

            await recursosRepository.createManyResources(nuevosRecursos);
        }

        const updatedTopic = await topicoRepository.getTopicById(id);
        return { message: "Tópico y recursos actualizados", topic: updatedTopic };
    }

}




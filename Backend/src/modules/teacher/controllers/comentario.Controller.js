import { commentService } from "../services/comment.service.js";

export async function crearComentario(req, res) {
    try {
        const data = req.body;
        const comentario = await commentService.crearComentario(data);
        return res.json({ success: true, message: "Comentario creado", data: comentario });
    } catch (error) {
        console.error("error en commentController:", error);
        const status = error.status || 500;
        res.status(status).json({
            success: false,
            message: error.message || "Error interno"
        });
    }
};

export async function responderComentario(req, res) {
    try {
        const data = req.body;
        const reply = await commentService.responderComentario(data);
        return res.json({ success: true, message: "Respuesta creada", data: reply });
    } catch (error) {
        console.error("error al responder  comentario:", error);
        const status = error.status || 500;
        res.status(status).json({
            success: false,
            message: error.message || "Error interno"
        });
    }
};

export async function getComentarios(req, res) {
    try {
        const topicId = req.params.topicId;
        const comentario = await commentService.getCommentsByTopicId(Number(topicId));
        return res.json({ success: true, data: comentario });
    } catch (error) {
        console.error("error al obtener los comentarios:", error);
        const status = error.status || 500;
        res.status(status).json({
            success: false,
            message: error.message || "Error interno"
        });
    }
}; 

import { commentService } from "../services/comment.service.js";

export async function crearComentario(req, res) {
    try {
        const input = req.body;
        const comentario = await commentService.crearComentario(input);
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

export async function responder(req, res) {
    try {
        const commentId = req.params.id;
        const input = req.body;
        const reply = await commentService.responderComentario(commentId, input);
        return res.json({ success: true, message: "Respuesta creada", data: reply });
    } catch (error) {
        console.error("error en commentController:", error);
        const status = error.status || 500;
        res.status(status).json({
            success: false,
            message: error.message || "Error interno"
        });
    }
};

export async function obtener(req, res) {
    try {
        const commentId = req.params.id;
        const comentario = await commentService.obtenerComentario(commentId);
        return res.json({ success: true, data: comentario });
    } catch (error) {
        console.error("error en commentController:", error);
        const status = error.status || 500;
        res.status(status).json({
            success: false,
            message: error.message || "Error interno"
        });
    }
};  
export async function listarPorTopico(req, res) {
    try {
        const topicoId = req.params.topicoId;
        const comentarios = await commentService.listarComentariosPorTopico(topicoId);
        return res.json({ success: true, data: comentarios });
    } catch (error) {
        console.error("error en commentController:", error);
        const status = error.status || 500;
        res.status(status).json({
            success: false,
            message: error.message || "Error interno"
        });
    }
};
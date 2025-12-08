import { commentRepository } from "../repositories/comment.repository.js";
import { getIO } from "../../../websocket/socket.config.js";

export const commentService = {

  async crearComentario(data) {
    const newComment = await commentRepository.createComment(data);
    
    // Emitir evento WebSocket a todos los clientes suscritos al profesor
    try {
      const io = getIO();
      io.to(`teacher_${data.teacherId}`).emit("new_comment", {
        event: "comment_created",
        comment: newComment,
        timestamp: new Date().toISOString(),
      });
      console.log(` Nuevo comentario emitido para profesor ${data.teacherId}`);
    } catch (error) {
      console.warn(" Socket.io no disponible para emitir evento:", error.message);
    }
    
    return newComment;
  },

  async responderComentario(data) {
    const answer = await commentRepository.createanswerComments(data);
    
    // Emitir evento WebSocket a todos los clientes suscritos al profesor
    try {
      const io = getIO();
      io.to(`teacher_${data.teacherId}`).emit("comment_answered", {
        event: "comment_answer_created",
        answer: answer,
        timestamp: new Date().toISOString(),
      });
      console.log(` Respuesta de comentario emitida para profesor ${data.teacherId}`);
    } catch (error) {
      console.warn(" Socket.io no disponible para emitir evento:", error.message);
    }
    
    return answer;
  },

  async getCommentsByTeacherId(teacherId) {
    const comments = await commentRepository.getCommentsByTeacherId(teacherId);
    
    // Emitir evento WebSocket para notificar que se solicitaron los comentarios
    try {
      const io = getIO();
      io.to(`teacher_${teacherId}`).emit("comments_fetched", {
        event: "comments_retrieved",
        comments: comments,
        teacherId: teacherId,
        commentsCount: comments.length,
        timestamp: new Date().toISOString(),
      });
      console.log(` Comentarios obtenidos para profesor ${teacherId}`);
    } catch (error) {
      console.warn(" Socket.io no disponible para emitir evento:", error.message);
    }
    
    return comments;
  },

}
import { commentRepository } from "../repositories/comment.repository.js";
import { getIO } from "../../../websocket/socket.config.js";

export const commentService = {

  async crearComentario(data) {
   return await commentRepository.createComment(data);
  },

  async responderComentario(data) {
    return await commentRepository.createanswerComments(data);
  },

  async getCommentsByTopicId(topicoId) {
    const comments = await commentRepository.getCommentsByTopicId(topicoId);

    // Emitir por WebSocket para que el frontend reciba en tiempo real
    try {
      const io = getIO();
      io.emit("comments_fetched", {
        event: "comments_fetched",
        topicId: Number(topicoId),
        comments,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.warn("⚠️ Socket.io no disponible al emitir comments_fetched:", error.message);
    }

    return comments;
  },

}
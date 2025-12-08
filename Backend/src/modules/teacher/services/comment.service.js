import { commentRepository } from "../repositories/comment.repository.js";

import { getIO } from "../../../websocket/socket.config.js"; 

export const commentService = {

  async crearComentario(data) {
    const nuevoComentario = await commentRepository.createComment(data);
    try {
      const io = getIO();
      const roomName = `topico_${data.topicoId}`;
      io.to(roomName).emit("new_comment", nuevoComentario);
      console.log(` Enviado new_comment a la sala: ${roomName}`);
    } catch (error) {
      console.warn(" No se pudo emitir el socket (¿Servidor no iniciado?):", error.message);
    }

    return nuevoComentario;
  },

  async responderComentario(data) {
    const nuevaRespuesta = await commentRepository.createanswerComments(data);
    const topicoId = nuevaRespuesta.comentario?.topicoId;
    if (topicoId) {
      try {
        const io = getIO();
        const roomName = `topico_${topicoId}`;
        io.to(roomName).emit("new_reply", nuevaRespuesta);
        console.log(` Enviado new_reply a la sala: ${roomName}`);
      } catch (error) {
        console.warn(" No se pudo emitir el socket:", error.message);
      }
    }

    return nuevaRespuesta;
  },


  async getCommentsByTopicId(topicoId) {
    return await commentRepository.getCommentsByTopicId(topicoId);
  },

};
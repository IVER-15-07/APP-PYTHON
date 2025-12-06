import { commentRepository } from "../repositories/comment.repository.js";


export const commentService = {

  async crearComentario(data) {
    return await commentRepository.createComment(data);
  },



}
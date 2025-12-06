import { commentRepository } from "../repositories/comment.repository.js";


export const commentService = {

  async crearComentario(data) {
    return await commentRepository.createComment(data);
  },

  async responderComentario(data) {
    return await commentRepository.createanswerComments(data);
  },

  async getCommentsByTeacherId(teacherId) {
    return await commentRepository.getCommentsByTeacherId(teacherId);
  },



}
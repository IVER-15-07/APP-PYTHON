import { commentRepository } from "../repositories/comment.repository.js";


export const commentService = {
    async crearComentario(input) {
    const { contenido, usuarioId, topicoId } = input || {};
    if (!input || typeof input !== "object") throw new Error("data is required");
    if (!contenido) throw new Error("contenido is required");
    if (!usuarioId) throw new Error("usuarioId is required");
    if (!topicoId) throw new Error("topicoId is required");
    return commentRepository.createComment({ contenido, usuarioId, topicoId });
  },

  async responderComentario(parentId, input) {
    if (!parentId) throw new Error("parentId is required");
   
    return commentRepository.replyToComment(parentId, input);
  },

  async obtenerPorId(id) {
    if (!id) throw new Error("id is required");
    const c = await commentRepository.getCommentById(id);
    if (!c) throw new Error("Comentario no encontrado");
    const vistas = await commentRepository.countVistas(id);
    return { ...c, vistas };
  },

  async listarPorTopico(topicoId) {
    if (!topicoId) throw new Error("topicoId is required");
    return commentRepository.listByTopico(topicoId);
  },

  async marcarVisto(comentarioId, usuarioId) {
    if (!comentarioId) throw new Error("comentarioId is required");
    if (!usuarioId) throw new Error("usuarioId is required");
    const existing = await commentRepository.findVista(comentarioId, usuarioId);
    if (existing) {
      return commentRepository.updateVista(existing.id, { vistoEn: new Date() });
    }
    return commentRepository.createVista(comentarioId, usuarioId);
  },
}
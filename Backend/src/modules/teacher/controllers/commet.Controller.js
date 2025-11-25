import { commentService } from "../services/comment.service.js";

export const commentController = {
  crear: async (req, res, next) => {
    try {
      const { contenido, usuarioId, topicoId } = req.body;
      const data = await commentService.crearComentario({ contenido, usuarioId, topicoId });
      res.status(201).json(data);
    } catch (e) { next(e); }
  },

  responder: async (req, res, next) => {
    try {
      const parentId = Number(req.params.id);
      const { contenido, usuarioId, topicoId } = req.body;
      const data = await commentService.responderComentario(parentId, { contenido, usuarioId, topicoId });
      res.status(201).json(data);
    } catch (e) { next(e); }
  },

  obtener: async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const data = await commentService.obtenerPorId(id);
      res.json(data);
    } catch (e) { next(e); }
  },

  listarPorTopico: async (req, res, next) => {
    try {
      const topicoId = Number(req.params.topicoId);
      const data = await commentService.listarPorTopico(topicoId);
      res.json(data);
    } catch (e) { next(e); }
  },

  marcarVisto: async (req, res, next) => {
    try {
      const comentarioId = Number(req.params.id);
      const { usuarioId } = req.body;
      await commentService.marcarVisto(comentarioId, usuarioId);
      res.status(204).end();
    } catch (e) { next(e); }
  },
};
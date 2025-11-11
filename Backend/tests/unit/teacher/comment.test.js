import { commentService } from "../../../src/modules/teacher/services/comment.service.js";
import { commentRepository } from "../../../src/modules/teacher/repositories/comment.repository.js";

jest.mock("../../../src/modules/teacher/repositories/comment.repository.js");

describe("commentService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("crearComentario", () => {
    it("crea comentario con datos válidos", async () => {
      const input = { contenido: "Hola", usuarioId: 1, topicoId: 2 };
      const created = { id: 10, ...input, fecha: new Date().toISOString() };
      commentRepository.createComment.mockResolvedValue(created);

      const result = await commentService.crearComentario(input);

      expect(commentRepository.createComment).toHaveBeenCalledWith(input);
      expect(result).toBe(created);
    });

    it("falla sin data", async () => {
      await expect(commentService.crearComentario()).rejects.toThrow("data is required");
      expect(commentRepository.createComment).not.toHaveBeenCalled();
    });

    it("falla sin contenido", async () => {
      await expect(commentService.crearComentario({ usuarioId: 1, topicoId: 2 }))
        .rejects.toThrow("contenido is required");
    });

    it("falla sin usuarioId", async () => {
      await expect(commentService.crearComentario({ contenido: "Hola", topicoId: 2 }))
        .rejects.toThrow("usuarioId is required");
    });

    it("falla sin topicoId", async () => {
      await expect(commentService.crearComentario({ contenido: "Hola", usuarioId: 1 }))
        .rejects.toThrow("topicoId is required");
    });
  });

  describe("responderComentario", () => {
    it("falla sin parentId", async () => {
      await expect(commentService.responderComentario(undefined, { contenido: "x" }))
        .rejects.toThrow("parentId is required");
      expect(commentRepository.replyToComment).not.toHaveBeenCalled();
    });

    it("llama al repository con los parámetros correctos", async () => {
      const parentId = 5;
      const input = { contenido: "Respuesta", usuarioId: 3, topicoId: 2 };
      const reply = { id: 22, parentId, ...input };
      commentRepository.replyToComment.mockResolvedValue(reply);

      const result = await commentService.responderComentario(parentId, input);

      expect(commentRepository.replyToComment).toHaveBeenCalledWith(parentId, input);
      expect(result).toBe(reply);
    });
  });

  describe("obtenerPorId", () => {
    it("retorna comentario con conteo de vistas", async () => {
      const id = 7;
      const comentario = { id, contenido: "X", usuarioId: 1, topicoId: 2 };
      commentRepository.getCommentById.mockResolvedValue(comentario);
      commentRepository.countVistas.mockResolvedValue(3);

      const result = await commentService.obtenerPorId(id);

      expect(commentRepository.getCommentById).toHaveBeenCalledWith(id);
      expect(commentRepository.countVistas).toHaveBeenCalledWith(id);
      expect(result).toEqual({ ...comentario, vistas: 3 });
    });

    it("falla sin id", async () => {
      await expect(commentService.obtenerPorId()).rejects.toThrow("id is required");
    });

    it("falla si no existe", async () => {
      commentRepository.getCommentById.mockResolvedValue(null);
      await expect(commentService.obtenerPorId(99)).rejects.toThrow("Comentario no encontrado");
    });
  });

  describe("listarPorTopico", () => {
    it("lista por topicoId", async () => {
      const topicoId = 2;
      const rows = [{ id: 1 }, { id: 2 }];
      commentRepository.listByTopico.mockResolvedValue(rows);

      const result = await commentService.listarPorTopico(topicoId);

      expect(commentRepository.listByTopico).toHaveBeenCalledWith(topicoId);
      expect(result).toBe(rows);
    });

    it("falla sin topicoId", async () => {
      await expect(commentService.listarPorTopico()).rejects.toThrow("topicoId is required");
    });
  });

  describe("marcarVisto", () => {
    it("actualiza si ya existe vista", async () => {
      const comentarioId = 1, usuarioId = 2;
      commentRepository.findVista.mockResolvedValue({ id: 10 });
      commentRepository.updateVista.mockResolvedValue({ id: 10, comentarioId, usuarioId });

      const result = await commentService.marcarVisto(comentarioId, usuarioId);

      expect(commentRepository.findVista).toHaveBeenCalledWith(comentarioId, usuarioId);
      expect(commentRepository.updateVista).toHaveBeenCalledWith(10, { vistoEn: expect.any(Date) });
      expect(result).toEqual({ id: 10, comentarioId, usuarioId });
    });

    it("crea si no existe vista", async () => {
      const comentarioId = 3, usuarioId = 4;
      commentRepository.findVista.mockResolvedValue(null);
      commentRepository.createVista.mockResolvedValue({ id: 11, comentarioId, usuarioId });

      const result = await commentService.marcarVisto(comentarioId, usuarioId);

      expect(commentRepository.findVista).toHaveBeenCalledWith(comentarioId, usuarioId);
      expect(commentRepository.createVista).toHaveBeenCalledWith(comentarioId, usuarioId);
      expect(result).toEqual({ id: 11, comentarioId, usuarioId });
    });

    it("falla sin comentarioId", async () => {
      await expect(commentService.marcarVisto(undefined, 1)).rejects.toThrow("comentarioId is required");
    });

    it("falla sin usuarioId", async () => {
      await expect(commentService.marcarVisto(1, undefined)).rejects.toThrow("usuarioId is required");
    });
  });
});

import { commentService } from "../../../src/modules/teacher/services/comment.service.js";
import { commentRepository } from "../../../src/modules/teacher/repositories/comment.repository.js";
import { getIO } from "../../../src/websocket/socket.config.js";

jest.mock("../../../src/modules/teacher/repositories/comment.repository.js");
jest.mock("../../../src/websocket/socket.config.js", () => ({
  getIO: jest.fn(),
}));

describe("commentService (websocket emissions)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("crearComentario -> guarda y emite 'new_comment' a la sala del tópico", async () => {
    const input = { contenido: "Hola", usuarioId: 1, topicoId: 2 };
    const nuevoComentario = { id: 100, ...input, fecha_pub: new Date().toISOString() };

    commentRepository.createComment.mockResolvedValue(nuevoComentario);

    const mockEmit = jest.fn();
    const mockTo = jest.fn(() => ({ emit: mockEmit }));
    getIO.mockReturnValue({ to: mockTo });

    const result = await commentService.crearComentario(input);

    expect(commentRepository.createComment).toHaveBeenCalledWith(input);
    expect(getIO).toHaveBeenCalled();
    expect(mockTo).toHaveBeenCalledWith(`topico_${input.topicoId}`);
    expect(mockEmit).toHaveBeenCalledWith("new_comment", nuevoComentario);
    expect(result).toBe(nuevoComentario);
  });

  test("responderComentario -> guarda y emite 'new_reply' cuando viene topicoId", async () => {
    const data = { contenido: "Respuesta", usuarioId: 3, comentarioId: 55 };
    const nuevaRespuesta = {
      id: 200,
      ...data,
      comentario: { id: 55, topicoId: 7 }
    };

    commentRepository.createanswerComments.mockResolvedValue(nuevaRespuesta);

    const mockEmit = jest.fn();
    const mockTo = jest.fn(() => ({ emit: mockEmit }));
    getIO.mockReturnValue({ to: mockTo });

    const result = await commentService.responderComentario(data);

    expect(commentRepository.createanswerComments).toHaveBeenCalledWith(data);
    expect(getIO).toHaveBeenCalled();
    expect(mockTo).toHaveBeenCalledWith(`topico_${nuevaRespuesta.comentario.topicoId}`);
    expect(mockEmit).toHaveBeenCalledWith("new_reply", nuevaRespuesta);
    expect(result).toBe(nuevaRespuesta);
  });

  test("responderComentario -> no emite si no hay topicoId en la respuesta", async () => {
    const data = { contenido: "Respuesta sin tópico", usuarioId: 4, comentarioId: 66 };
    const respSinTopico = { id: 201, ...data, comentario: { id: 66 } }; // sin topicoId

    commentRepository.createanswerComments.mockResolvedValue(respSinTopico);

    // configuramos getIO pero esperamos que NO se llame
    const mockIo = { to: jest.fn(() => ({ emit: jest.fn() })) };
    getIO.mockReturnValue(mockIo);

    const result = await commentService.responderComentario(data);

    expect(commentRepository.createanswerComments).toHaveBeenCalledWith(data);
    expect(getIO).not.toHaveBeenCalled(); // no debería invocar getIO si no hay topicoId
    expect(result).toBe(respSinTopico);
  });

  test("getCommentsByTopicId -> devuelve lo que retorna el repositorio", async () => {
    const topicoId = 3;
    const comments = [{ id: 1 }, { id: 2 }];
    commentRepository.getCommentsByTopicId.mockResolvedValue(comments);

    const result = await commentService.getCommentsByTopicId(topicoId);

    expect(commentRepository.getCommentsByTopicId).toHaveBeenCalledWith(topicoId);
    expect(result).toBe(comments);
  });
});
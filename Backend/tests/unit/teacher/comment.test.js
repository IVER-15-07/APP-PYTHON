import { commentRepository } from "../../../src/modules/teacher/repositories/comment.repository";

jest.mock("../../../src/modules/teacher/repositories/comment.repository.js");


describe("Comment Repository", () => {
  let idCounter;
  let store;

  beforeEach(() => {
    idCounter = 1;
    store = [];

    commentRepository.createComment.mockImplementation((data) => {
      if (!data || typeof data !== "object") throw new Error("data is required");
      const { contenido, usuarioId } = data;
      if (!contenido) throw new Error("contenido is required");
      if (!usuarioId) throw new Error("usuarioId is required");
      const newComment = {
        id: idCounter++,
        contenido,
        usuarioId,
        parentId: null,
        replies: []
      };
      store.push(newComment);
      return Promise.resolve(newComment);
    });

    // Provide mock reply method (replyToComment)
    commentRepository.replyToComment = jest.fn((parentId, data) => {
      if (!parentId) throw new Error("parentId is required");
      const parent = store.find(c => c.id === parentId);
      if (!parent) throw new Error("Parent comment not found");
      if (!data || typeof data !== "object") throw new Error("data is required");
      const { contenido, usuarioId } = data;
      if (!contenido) throw new Error("contenido is required");
      if (!usuarioId) throw new Error("usuarioId is required");
      const reply = {
        id: idCounter++,
        contenido,
        usuarioId,
        parentId: parentId,
        replies: []
      };
      parent.replies.push(reply);
      store.push(reply);
      return Promise.resolve(reply);
    });

    commentRepository.getCommentById = jest.fn((id) =>
      Promise.resolve(store.find(c => c.id === id) || null)
    );
  });

  it("should create a comment", async () => {
    const commentData = { contenido: "This is a test comment", usuarioId: 1 };
    const createdComment = await commentRepository.createComment(commentData);
    expect(createdComment).toHaveProperty("id");
    expect(createdComment.contenido).toBe(commentData.contenido);
    expect(createdComment.usuarioId).toBe(commentData.usuarioId);
    expect(createdComment.parentId).toBeNull();
  });

  it("should fail creating a comment without contenido", async () => {
    await expect(commentRepository.createComment({ usuarioId: 2 }))
      .rejects.toThrow("contenido is required");
  });

  it("should fail creating a comment without usuarioId", async () => {
    await expect(commentRepository.createComment({ contenido: "Hola" }))
      .rejects.toThrow("usuarioId is required");
  });

  it("should reply to a comment", async () => {
    const parent = await commentRepository.createComment({ contenido: "Root", usuarioId: 1 });
    const reply = await commentRepository.replyToComment(parent.id, { contenido: "Reply", usuarioId: 2 });
    expect(reply).toHaveProperty("id");
    expect(reply.parentId).toBe(parent.id);
    expect(reply.contenido).toBe("Reply");
    expect(parent.replies.length).toBe(1);
    expect(parent.replies[0].id).toBe(reply.id);
  });

  it("should fail replying to non existing comment", async () => {
    await expect(
      commentRepository.replyToComment(999, { contenido: "Test", usuarioId: 3 })
    ).rejects.toThrow("Parent comment not found");
  });

  it("should build nested reply structure", async () => {
    const root = await commentRepository.createComment({ contenido: "Root", usuarioId: 1 });
    const r1 = await commentRepository.replyToComment(root.id, { contenido: "Level1", usuarioId: 2 });
    const r2 = await commentRepository.replyToComment(r1.id, { contenido: "Level2", usuarioId: 3 });
    expect(r1.parentId).toBe(root.id);
    expect(r2.parentId).toBe(r1.id);
    const fetchedRoot = await commentRepository.getCommentById(root.id);
    expect(fetchedRoot.replies[0].id).toBe(r1.id);
    expect(fetchedRoot.replies[0].replies[0].id).toBe(r2.id);
  });

  it("should validate reply missing contenido", async () => {
    const parent = await commentRepository.createComment({ contenido: "Base", usuarioId: 5 });
    await expect(
      commentRepository.replyToComment(parent.id, { usuarioId: 6 })
    ).rejects.toThrow("contenido is required");
  });

  it("should validate reply missing usuarioId", async () => {
    const parent = await commentRepository.createComment({ contenido: "Base", usuarioId: 7 });
    await expect(
      commentRepository.replyToComment(parent.id, { contenido: "Sin usuario" })
    ).rejects.toThrow("usuarioId is required");
  });
});
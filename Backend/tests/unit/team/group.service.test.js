import { grupoService } from "../../../src/modules/grupo/services/grupo.service.js";
import { grupoRepository } from "../../../src/modules/grupo/repositories/grupo.repository.js";
import { validateGroupPayload } from "../../../src/modules/grupo/validations/grupo.validation.js";

jest.mock("../../../src/modules/grupo/repositories/grupo.repository.js", () => ({
  __esModule: true,
  grupoRepository: {
    findByCodigo: jest.fn(),
    findRegistroByUsuarioId: jest.fn(),
    createRegistro: jest.fn(),
    findNiveles: jest.fn(),
    findGroupByUser: jest.fn(),
    getTopicsByLevel: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
  },
}));

jest.mock("../../../src/modules/grupo/validations/grupo.validation.js", () => ({
  __esModule: true,
  validateGroupPayload: jest.fn(),
}));

describe("grupoService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("joinGroupByCode", () => {
    test("lanza error si el código es inválido", async () => {
      grupoRepository.findByCodigo.mockResolvedValue(null);
      await expect(grupoService.joinGroupByCode("XYZ", 1))
        .rejects.toEqual({ status: 404, message: "Código inválido." });
    });

    test("lanza error si el usuario ya pertenece a un grupo", async () => {
      grupoRepository.findByCodigo.mockResolvedValue({ id: 7 });
      grupoRepository.findRegistroByUsuarioId.mockResolvedValue({ id: 99 });
      await expect(grupoService.joinGroupByCode("ABC", 2))
        .rejects.toEqual({ status: 400, message: "Ya perteneces a un grupo." });
    });

    test("registra y retorna grupo + niveles", async () => {
      const mockGrupo = { id: 3, titulo: "G1" };
      const mockNiveles = [{ id: 1 }, { id: 2 }];
      grupoRepository.findByCodigo.mockResolvedValue(mockGrupo);
      grupoRepository.findRegistroByUsuarioId.mockResolvedValue(null);
      grupoRepository.createRegistro.mockResolvedValue({});
      grupoRepository.findNiveles.mockResolvedValue(mockNiveles);

      const out = await grupoService.joinGroupByCode("CODE123", 5);

      expect(grupoRepository.createRegistro).toHaveBeenCalledWith(5, 3);
      expect(out).toEqual({ grupo: mockGrupo, niveles: mockNiveles });
    });
  });

  describe("getUserGroup", () => {
    test("retorna grupo null si no hay registro", async () => {
      grupoRepository.findGroupByUser.mockResolvedValue(null);
      const out = await grupoService.getUserGroup(10);
      expect(out).toEqual({ grupo: null });
    });

    test("retorna el grupo si existe registro", async () => {
      grupoRepository.findGroupByUser.mockResolvedValue({ grupo: { id: 8, titulo: "Grupo 8" } });
      const out = await grupoService.getUserGroup(4);
      expect(out).toEqual({ grupo: { id: 8, titulo: "Grupo 8" } });
    });
  });

  describe("getTopicsByLevel", () => {
    test("delegado al repositorio y retorna array", async () => {
      const mockTopics = [{ id: 1 }, { id: 2 }];
      grupoRepository.getTopicsByLevel.mockResolvedValue(mockTopics);
      const out = await grupoService.getTopicsByLevel(3);
      expect(grupoRepository.getTopicsByLevel).toHaveBeenCalledWith(3);
      expect(out).toEqual(mockTopics);
    });
  });

  describe("updateGroup", () => {
    test("lanza error si el grupo no existe", async () => {
      grupoRepository.findById.mockResolvedValue(null);
      await expect(grupoService.updateGroup(99, { titulo: "Nuevo" }))
        .rejects.toEqual({ status: 404, message: "Grupo no encontrado." });
    });

    test("sanitiza payload y actualiza", async () => {
      grupoRepository.findById.mockResolvedValue({ id: 5, titulo: "Old" });
      validateGroupPayload.mockImplementation(p => ({ titulo: p.titulo.trim() }));
      grupoRepository.update.mockResolvedValue({ id: 5, titulo: "Nuevo" });

      const out = await grupoService.updateGroup(5, { titulo: " Nuevo " });

      expect(validateGroupPayload).toHaveBeenCalledWith({ titulo: " Nuevo " });
      expect(grupoRepository.update).toHaveBeenCalledWith(5, { titulo: "Nuevo" });
      expect(out).toEqual({ id: 5, titulo: "Nuevo" });
    });
  });
});
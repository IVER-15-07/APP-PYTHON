import { solicitudService } from "../../../src/modules/teacher/services/request.service.js";
import { solicitudRepository } from "../../../src/modules/teacher/repositories/request.repository.js";
import { roleRepository } from "../../../src/modules/teacher/repositories/role.repository.js";

// 🔹 Mockeamos los repositorios (para no tocar la base de datos real)
jest.mock("../../../src/modules/teacher/repositories/request.repository.js");
jest.mock("../../../src/modules/teacher/repositories/role.repository.js");

describe("solicitudService", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Limpia los mocks entre cada test
  });


  describe("createSolicitud", () => {
    // 🧪 Caso 1: Rol inválido
    test("debería lanzar error si el rol no existe", async () => {
      roleRepository.findById.mockResolvedValue(null); // Simula que no se encuentra el rol

      await expect(solicitudService.createSolicitud(1, 999))
        .rejects.toEqual({ status: 400, mesage: "rol invalido " });
    });

    // 🧪 Caso 2: Solicitud ya pendiente
    test("debería lanzar error si ya existe una solicitud pendiente", async () => {
      roleRepository.findById.mockResolvedValue({ id: 2 });
      solicitudRepository.findByUsuarioId.mockResolvedValue({ estado: "pendiente" });

      await expect(solicitudService.createSolicitud(1, 2))
        .rejects.toEqual({ status: 400, message: "Ya existe una solicitud pendiente" });
    });

    // 🧪 Caso 3: Solicitud previa pero no pendiente → actualiza
    test("debería actualizar si ya existe una solicitud previa no pendiente", async () => {
      roleRepository.findById.mockResolvedValue({ id: 3 });
      solicitudRepository.findByUsuarioId.mockResolvedValue({ id: 10, estado: "rechazado" });
      solicitudRepository.update.mockResolvedValue({ id: 10, estado: "pendiente" });

      const result = await solicitudService.createSolicitud(1, 3);

      expect(solicitudRepository.update).toHaveBeenCalledWith(10, expect.objectContaining({
        rol_usuarioId: 3,
        estad: "pendiente",
      }));

      expect(result).toEqual({ id: 10, estado: "pendiente" });
    });

    // 🧪 Caso 4: No existe solicitud previa → crea una nueva
    test("debería crear una nueva solicitud si no existe ninguna previa", async () => {
      roleRepository.findById.mockResolvedValue({ id: 4 });
      solicitudRepository.findByUsuarioId.mockResolvedValue(null);
      solicitudRepository.createSolicitud.mockResolvedValue({ id: 20, estado: "pendiente" });

      const result = await solicitudService.createSolicitud(1, 4);

      expect(solicitudRepository.createSolicitud).toHaveBeenCalledWith({
        usuarioId: 1,
        rol_usuarioId: 4,
        estado: "pendiente",
      });

      expect(result).toEqual({ id: 20, estado: "pendiente" });
    });
  });


  describe("getMyRequest", () => {
    // 🧪 Caso 5: getMyRequest devuelve algo
    test("debería devolver la solicitud si existe", async () => {
      solicitudRepository.myrequest.mockResolvedValue({ id: 5, estado: "pendiente" });

      const result = await solicitudService.getMyRequest(1);
      expect(result).toEqual({ id: 5, estado: "pendiente" });
    });

    // 🧪 Caso 6: getMyRequest devuelve null
    test("debería devolver null si no hay solicitud", async () => {
      solicitudRepository.myrequest.mockResolvedValue(null);

      const result = await solicitudService.getMyRequest(1);
      expect(result).toBeNull();
    });
  });
});

import { solicitudService } from "../../../src/modules/teacher/services/request.service.js";
import { solicitudRepository } from "../../../src/modules/teacher/repositories/request.repository.js";
import { roleRepository } from "../../../src/modules/teacher/repositories/role.repository.js";
import { teamRepository } from '../../../src/modules/teacher/repositories/team.repository.js';

jest.mock("../../../src/modules/teacher/repositories/request.repository.js");
jest.mock("../../../src/modules/teacher/repositories/role.repository.js");
jest.mock('../../../src/modules/teacher/repositories/team.repository.js', () => ({
  teamRepository: {
    createTeam: jest.fn(),
    addCreatorRegistro: jest.fn(),
    listCreatedBy: jest.fn(),
  },
}));
describe("solicitudService", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Limpia los mocks entre cada test
  });


  describe("createSolicitud", () => {
    test("debería lanzar error si el rol no existe", async () => {
      roleRepository.findById.mockResolvedValue(null); // Simula que no se encuentra el rol

      await expect(solicitudService.createSolicitud(1, 999))
        .rejects.toEqual({ status: 400, mesage: "rol invalido " });
    });

    test("debería lanzar error si ya existe una solicitud pendiente", async () => {
      roleRepository.findById.mockResolvedValue({ id: 2 });
      solicitudRepository.findByUsuarioId.mockResolvedValue({ estado: "pendiente" });

      await expect(solicitudService.createSolicitud(1, 2))
        .rejects.toEqual({ status: 400, message: "Ya existe una solicitud pendiente" });
    });

    test("debería actualizar si ya existe una solicitud previa no pendiente", async () => {
      roleRepository.findById.mockResolvedValue({ id: 3 });
      solicitudRepository.findByUsuarioId.mockResolvedValue({ id: 10, estado: "rechazado" });
      solicitudRepository.update.mockResolvedValue({ id: 10, estado: "pendiente" });

      const result = await solicitudService.createSolicitud(1, 3);

      expect(solicitudRepository.update).toHaveBeenCalledWith(10, expect.objectContaining({
        rol_usuarioId: 3,
        estado: "pendiente",
      }));

      expect(result).toEqual({ id: 10, estado: "pendiente" });
    });

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

    test("debería devolver la solicitud si existe", async () => {
      solicitudRepository.myrequest.mockResolvedValue({ id: 5, estado: "pendiente" });

      const result = await solicitudService.getMyRequest(1);
      expect(result).toEqual({ id: 5, estado: "pendiente" });
    });

    test("debería devolver null si no hay solicitud", async () => {
      solicitudRepository.myrequest.mockResolvedValue(null);

      const result = await solicitudService.getMyRequest(1);
      expect(result).toBeNull();
    });
  });


  describe('solicitudService.createGroupRequest', () => {
    beforeEach(() => jest.clearAllMocks());

    test('crea grupo con esAprobado=false y codigo=null', async () => {
      const mockGrupo = {
        id: 5,
        titulo: 'Grupo Test',
        descripcion: 'Descripción del grupo',
        fecha_ini: new Date('2025-01-01'),
        fecha_fin: new Date('2025-12-31'),
        esAprobado: false,
        codigo: null,
        cursoId: 2,
      };
      teamRepository.createTeam.mockResolvedValue(mockGrupo);
      teamRepository.addCreatorRegistro.mockResolvedValue({});

      const groupData = {
        titulo: 'Grupo Test',
        descripcion: 'Descripción del grupo',
        fecha_ini: '2025-01-01',
        fecha_fin: '2025-12-31',
        cursoId: 2,
      };

      const result = await solicitudService.createGroupRequest(1, groupData);

      expect(teamRepository.createTeam).toHaveBeenCalledWith({
        titulo: 'Grupo Test',
        descripcion: 'Descripción del grupo',
        fecha_ini: new Date('2025-01-01'),
        fecha_fin: new Date('2025-12-31'),
        esAprobado: false,
        codigo: null,
        cursoId: 2,
      });
      expect(teamRepository.addCreatorRegistro).toHaveBeenCalledWith({
        usuarioId: 1,
        grupoId: 5,
      });
      expect(result).toEqual(mockGrupo);
    });

    test('usa descripción vacía si no se proporciona', async () => {
      const mockGrupo = { id: 6, titulo: 'Sin desc', descripcion: '', esAprobado: false };
      teamRepository.createTeam.mockResolvedValue(mockGrupo);
      teamRepository.addCreatorRegistro.mockResolvedValue({});

      const result = await solicitudService.createGroupRequest(2, {
        titulo: 'Sin desc',
        fecha_ini: '2025-02-01',
        fecha_fin: '2025-03-01',
        cursoId: 3,
      });

      expect(teamRepository.createTeam).toHaveBeenCalledWith(
        expect.objectContaining({ descripcion: '' })
      );
      expect(result.descripcion).toBe('');
    });

    test('no registra al creador si usuarioId es null/undefined', async () => {
      const mockGrupo = { id: 7, titulo: 'Grupo sin creador', esAprobado: false };
      teamRepository.createTeam.mockResolvedValue(mockGrupo);

      await solicitudService.createGroupRequest(null, {
        titulo: 'Grupo sin creador',
        descripcion: '',
        fecha_ini: '2025-01-01',
        fecha_fin: '2025-12-31',
        cursoId: 1,
      });

      expect(teamRepository.addCreatorRegistro).not.toHaveBeenCalled();
    });

    test('convierte fecha_ini y fecha_fin a objetos Date', async () => {
      const mockGrupo = { id: 8, esAprobado: false };
      teamRepository.createTeam.mockResolvedValue(mockGrupo);
      teamRepository.addCreatorRegistro.mockResolvedValue({});

      await solicitudService.createGroupRequest(3, {
        titulo: 'Fechas',
        descripcion: '',
        fecha_ini: '2025-06-15',
        fecha_fin: '2025-07-20',
        cursoId: 4,
      });

      expect(teamRepository.createTeam).toHaveBeenCalledWith(
        expect.objectContaining({
          fecha_ini: new Date('2025-06-15'),
          fecha_fin: new Date('2025-07-20'),
        })
      );
    });

    test('convierte cursoId a número', async () => {
      const mockGrupo = { id: 9, esAprobado: false, cursoId: 5 };
      teamRepository.createTeam.mockResolvedValue(mockGrupo);
      teamRepository.addCreatorRegistro.mockResolvedValue({});

      await solicitudService.createGroupRequest(4, {
        titulo: 'Curso ID',
        descripcion: '',
        fecha_ini: '2025-01-01',
        fecha_fin: '2025-12-31',
        cursoId: '5', // string
      });

      expect(teamRepository.createTeam).toHaveBeenCalledWith(
        expect.objectContaining({ cursoId: 5 })
      );
    });
  });

  describe('solicitudService.listMyCreatedGroups', () => {
    beforeEach(() => jest.clearAllMocks());

    test('filtra por esAprobado=true cuando estado="aprobado"', async () => {
      const mockGroups = [{ id: 1, titulo: 'Grupo 1', esAprobado: true }];
      teamRepository.listCreatedBy.mockResolvedValue(mockGroups);

      const result = await solicitudService.listMyCreatedGroups(1, 'aprobado');

      expect(teamRepository.listCreatedBy).toHaveBeenCalledWith(1, true);
      expect(result).toEqual(mockGroups);
    });

    test('filtra por esAprobado=false cuando estado="pendiente"', async () => {
      const mockGroups = [{ id: 2, titulo: 'Grupo 2', esAprobado: false }];
      teamRepository.listCreatedBy.mockResolvedValue(mockGroups);

      const result = await solicitudService.listMyCreatedGroups(1, 'pendiente');

      expect(teamRepository.listCreatedBy).toHaveBeenCalledWith(1, false);
      expect(result).toEqual(mockGroups);
    });

    test('no filtra (pasa null) cuando estado no es "aprobado" ni "pendiente"', async () => {
      const mockGroups = [
        { id: 3, esAprobado: true },
        { id: 4, esAprobado: false },
      ];
      teamRepository.listCreatedBy.mockResolvedValue(mockGroups);

      const result = await solicitudService.listMyCreatedGroups(1, 'todos');

      expect(teamRepository.listCreatedBy).toHaveBeenCalledWith(1, null);
      expect(result).toEqual(mockGroups);
    });

    test('retorna array vacío si no hay grupos', async () => {
      teamRepository.listCreatedBy.mockResolvedValue([]);

      const result = await solicitudService.listMyCreatedGroups(2, 'aprobado');

      expect(result).toEqual([]);
    });

    test('estado undefined devuelve todos (esAprobado=null)', async () => {
      const mockGroups = [{ id: 5 }, { id: 6 }];
      teamRepository.listCreatedBy.mockResolvedValue(mockGroups);

      const result = await solicitudService.listMyCreatedGroups(3);

      expect(teamRepository.listCreatedBy).toHaveBeenCalledWith(3, null);
      expect(result).toEqual(mockGroups);
    });


  });
});

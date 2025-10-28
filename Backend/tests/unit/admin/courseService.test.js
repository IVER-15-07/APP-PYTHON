import { solicitudService } from '../../../src/modules/teacher/services/request.service.js';
import { teamRepository } from '../../../src/modules/teacher/repositories/team.repository.js';

jest.mock('../../../src/modules/teacher/repositories/team.repository.js', () => ({
  teamRepository: {
    createTeam: jest.fn(),
    addCreatorRegistro: jest.fn(),
    listCreatedBy: jest.fn(),
  },
}));

describe('solicitudService.createGroupRequest', () => {
  beforeEach(() => jest.clearAllMocks());

  test('crea grupo con esAprobado=false y codigo=null', async () => {
    const mockGrupo = { id: 5, titulo: 'Grupo Test', esAprobado: false, codigo: null };
    teamRepository.createTeam.mockResolvedValue(mockGrupo);
    teamRepository.addCreatorRegistro.mockResolvedValue({});

    const groupData = {
      titulo: 'Grupo Test',
      descripcion: 'Descripción',
      fecha_ini: '2025-01-01',
      fecha_fin: '2025-12-31',
      cursoId: 2,
    };

    const res = await solicitudService.createGroupRequest(1, groupData);

    expect(teamRepository.createTeam).toHaveBeenCalledWith({
      titulo: 'Grupo Test',
      descripcion: 'Descripción',
      fecha_ini: new Date('2025-01-01'),
      fecha_fin: new Date('2025-12-31'),
      esAprobado: false,
      codigo: null,
      cursoId: 2,
    });
    expect(teamRepository.addCreatorRegistro).toHaveBeenCalledWith({ usuarioId: 1, grupoId: 5 });
    expect(res).toEqual(mockGrupo);
  });

  test('no registra al creador si usuarioId es null', async () => {
    const mockGrupo = { id: 6, esAprobado: false };
    teamRepository.createTeam.mockResolvedValue(mockGrupo);

    const res = await solicitudService.createGroupRequest(null, {
      titulo: 'Test',
      descripcion: '',
      fecha_ini: '2025-01-01',
      fecha_fin: '2025-12-31',
      cursoId: 3,
    });

    expect(teamRepository.addCreatorRegistro).not.toHaveBeenCalled();
    expect(res).toEqual(mockGrupo);
  });
});

describe('solicitudService.listMyCreatedGroups', () => {
  beforeEach(() => jest.clearAllMocks());

  test('filtra por esAprobado=true cuando estado="aprobado"', async () => {
    const mockGroups = [{ id: 1, esAprobado: true }];
    teamRepository.listCreatedBy.mockResolvedValue(mockGroups);

    const res = await solicitudService.listMyCreatedGroups(1, 'aprobado');

    expect(teamRepository.listCreatedBy).toHaveBeenCalledWith(1, true);
    expect(res).toEqual(mockGroups);
  });

  test('filtra por esAprobado=false cuando estado="pendiente"', async () => {
    const mockGroups = [{ id: 2, esAprobado: false }];
    teamRepository.listCreatedBy.mockResolvedValue(mockGroups);

    const res = await solicitudService.listMyCreatedGroups(1, 'pendiente');

    expect(teamRepository.listCreatedBy).toHaveBeenCalledWith(1, false);
    expect(res).toEqual(mockGroups);
  });

  test('no filtra cuando estado no es "aprobado" ni "pendiente"', async () => {
    const mockGroups = [{ id: 3 }, { id: 4 }];
    teamRepository.listCreatedBy.mockResolvedValue(mockGroups);

    const res = await solicitudService.listMyCreatedGroups(1, 'otro');

    expect(teamRepository.listCreatedBy).toHaveBeenCalledWith(1, null);
    expect(res).toEqual(mockGroups);
  });

  test('retorna vacío si el repo devuelve []', async () => {
    teamRepository.listCreatedBy.mockResolvedValue([]);

    const res = await solicitudService.listMyCreatedGroups(1, 'aprobado');

    expect(res).toEqual([]);
  });
});
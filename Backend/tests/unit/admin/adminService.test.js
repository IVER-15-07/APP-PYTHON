// tests/unit/admin/adminService.test.js
import { adminService } from '../../../src/modules/admin/services/admin.service.js';
import { adminRepository } from '../../../src/modules/admin/repositories/admin.respository.js';

jest.mock('../../../src/modules/admin/repositories/admin.respository.js', () => ({
  adminRepository: {
    encontrarPorId: jest.fn(),
    transaction: jest.fn(),
    updateSolicitudEstado: jest.fn(),
    getPendingRoleRequests: jest.fn(),
  },
}));

describe('adminService.aprobarRequest', () => {
  beforeEach(() => jest.clearAllMocks());

  test('lanza 404 si la solicitud no existe', async () => {
    adminRepository.encontrarPorId.mockResolvedValue(null);

    await expect(adminService.aprobarRequest(123))
      .rejects.toMatchObject({ status: 404, message: 'Solicitud no encontrada' });
  });

  test('lanza 400 si la solicitud no está pendiente', async () => {
    adminRepository.encontrarPorId.mockResolvedValue({ id: 1, estado: 'aprobada' });

    await expect(adminService.aprobarRequest(1))
      .rejects.toMatchObject({ status: 400, message: 'La solicitud ya ha sido procesada' });
  });

  test('aprueba: actualiza usuario y solicitud dentro de transacción', async () => {
    const solicitudId = 10;
    const usuarioId = 5;
    const rol_usuarioId = 3;

    adminRepository.encontrarPorId.mockResolvedValue({
      id: solicitudId,
      estado: 'pendiente',
      usuarioId,
      rol_usuarioId,
    });

    adminRepository.transaction.mockImplementation(async (cb) => {
      const tx = {
        usuario: {
          update: jest.fn().mockResolvedValue({ id: usuarioId, rol_usuarioId }),
        },
        solicitudRol: {
          update: jest.fn().mockResolvedValue({ id: solicitudId, estado: 'aprobada' }),
        },
      };
      return await cb(tx);
    });

    const result = await adminService.aprobarRequest(solicitudId);

    expect(result).toEqual({
      updateUsuario: { id: usuarioId, rol_usuarioId },
      updateSolicitud: { id: solicitudId, estado: 'aprobada' },
    });
  });
});

describe('adminService.rejectRequest', () => {
  beforeEach(() => jest.clearAllMocks());

  test('lanza 404 si no existe', async () => {
    adminRepository.encontrarPorId.mockResolvedValue(null);

    await expect(adminService.rejectRequest(9))
      .rejects.toMatchObject({ status: 404, message: 'Solicitud no encontrada' });
  });

  test('lanza 400 si no está pendiente', async () => {
    adminRepository.encontrarPorId.mockResolvedValue({ id: 9, estado: 'rechazada' });

    await expect(adminService.rejectRequest(9))
      .rejects.toMatchObject({ status: 400, message: 'La solicitud ya ha sido procesada' });
  });

  test('rechaza: actualiza estado a rechazada', async () => {
    adminRepository.encontrarPorId.mockResolvedValue({ id: 9, estado: 'pendiente' });
    adminRepository.updateSolicitudEstado.mockResolvedValue({ id: 9, estado: 'rechazada' });

    const res = await adminService.rejectRequest(9);

    expect(adminRepository.updateSolicitudEstado).toHaveBeenCalledWith(9, { estado: 'rechazada' });
    expect(res).toEqual({ id: 9, estado: 'rechazada' });
  });
});

describe('adminService.getPendingRequests', () => {
  beforeEach(() => jest.clearAllMocks());

  test('retorna pendientes cuando hay', async () => {
    const rows = [{ id: 1 }, { id: 2 }];
    adminRepository.getPendingRoleRequests.mockResolvedValue(rows);

    const res = await adminService.getPendingRequests();

    expect(res).toEqual(rows);
  });

  test('retorna [] cuando no hay resultados', async () => {
    adminRepository.getPendingRoleRequests.mockResolvedValue(null);

    const res = await adminService.getPendingRequests();

    expect(res).toEqual([]);
  });
});
import { solicitudService } from '../../src/modules/teacher/services/request.service.js';
import { solicitudRepository } from '../../src/modules/teacher/repositories/request.repository.js';
import { roleRepository } from '../../src/modules/teacher/repositories/role.repository.js';

// Mock de los repositorios
jest.mock('../../src/modules/teacher/repositories/request.repository.js');
jest.mock('../../src/modules/teacher/repositories/role.repository.js');

describe('Solicitud Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createSolicitud', () => {
    const usuarioId = 1;
    const rolId = 2;

    test('debe crear una nueva solicitud exitosamente', async () => {
      // Arrange
      const mockRol = { id: 2, nombre: 'Profesor' };
      const mockSolicitud = {
        id: 1,
        usuarioId: 1,
        rol_usuarioId: 2,
        estado: 'pendiente',
        fecha_solicitud: expect.any(Date),
      };

      roleRepository.findById.mockResolvedValue(mockRol);
      solicitudRepository.findByUsuarioId.mockResolvedValue(null);
      solicitudRepository.createSolicitud.mockResolvedValue(mockSolicitud);

      // Act
      const result = await solicitudService.createSolicitud(usuarioId, rolId);

      // Assert
      expect(roleRepository.findById).toHaveBeenCalledWith(rolId);
      expect(solicitudRepository.findByUsuarioId).toHaveBeenCalledWith(usuarioId);
      expect(solicitudRepository.createSolicitud).toHaveBeenCalledWith({
        usuarioId,
        rol_usuarioId: rolId,
        estado: 'pendiente',
      });
      expect(result).toEqual(mockSolicitud);
    });

    test('debe lanzar error si el rol no existe', async () => {
      // Arrange
      roleRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(solicitudService.createSolicitud(usuarioId, rolId))
        .rejects
        .toEqual({ status: 400, mesage: 'rol invalido ' });

      expect(roleRepository.findById).toHaveBeenCalledWith(rolId);
      expect(solicitudRepository.findByUsuarioId).not.toHaveBeenCalled();
      expect(solicitudRepository.createSolicitud).not.toHaveBeenCalled();
    });

    test('debe lanzar error si ya existe una solicitud pendiente', async () => {
      // Arrange
      const mockRol = { id: 2, nombre: 'Profesor' };
      const existingSolicitud = {
        id: 1,
        usuarioId: 1,
        rol_usuarioId: 2,
        estado: 'pendiente',
      };

      roleRepository.findById.mockResolvedValue(mockRol);
      solicitudRepository.findByUsuarioId.mockResolvedValue(existingSolicitud);

      // Act & Assert
      await expect(solicitudService.createSolicitud(usuarioId, rolId))
        .rejects
        .toEqual({ status: 400, message: 'Ya existe una solicitud pendiente' });

      expect(roleRepository.findById).toHaveBeenCalledWith(rolId);
      expect(solicitudRepository.findByUsuarioId).toHaveBeenCalledWith(usuarioId);
      expect(solicitudRepository.createSolicitud).not.toHaveBeenCalled();
      expect(solicitudRepository.update).not.toHaveBeenCalled();
    });

    test('debe actualizar solicitud existente si NO está pendiente (rechazada)', async () => {
      // Arrange
      const mockRol = { id: 2, nombre: 'Profesor' };
      const existingSolicitud = {
        id: 5,
        usuarioId: 1,
        rol_usuarioId: 2,
        estado: 'rechazada',
      };
      const updatedSolicitud = {
        ...existingSolicitud,
        estado: 'pendiente',
        fecha_solicitud: expect.any(Date),
      };

      roleRepository.findById.mockResolvedValue(mockRol);
      solicitudRepository.findByUsuarioId.mockResolvedValue(existingSolicitud);
      solicitudRepository.update.mockResolvedValue(updatedSolicitud);

      // Act
      const result = await solicitudService.createSolicitud(usuarioId, rolId);

      // Assert
      expect(roleRepository.findById).toHaveBeenCalledWith(rolId);
      expect(solicitudRepository.findByUsuarioId).toHaveBeenCalledWith(usuarioId);
      expect(solicitudRepository.update).toHaveBeenCalledWith(
        existingSolicitud.id,
        {
          rol_usuarioId: rolId,
          estad: 'pendiente',
          fecha_solicitud: expect.any(Date),
        }
      );
      expect(solicitudRepository.createSolicitud).not.toHaveBeenCalled();
      expect(result).toEqual(updatedSolicitud);
    });

    test('debe actualizar solicitud existente si está aprobada (nuevo rol)', async () => {
      // Arrange
      const mockRol = { id: 3, nombre: 'Coordinador' };
      const existingSolicitud = {
        id: 5,
        usuarioId: 1,
        rol_usuarioId: 2,
        estado: 'aprobada',
      };
      const updatedSolicitud = {
        ...existingSolicitud,
        rol_usuarioId: 3,
        estado: 'pendiente',
        fecha_solicitud: expect.any(Date),
      };

      roleRepository.findById.mockResolvedValue(mockRol);
      solicitudRepository.findByUsuarioId.mockResolvedValue(existingSolicitud);
      solicitudRepository.update.mockResolvedValue(updatedSolicitud);

      // Act
      const result = await solicitudService.createSolicitud(usuarioId, 3);

      // Assert
      expect(solicitudRepository.update).toHaveBeenCalledWith(
        existingSolicitud.id,
        {
          rol_usuarioId: 3,
          estad: 'pendiente',
          fecha_solicitud: expect.any(Date),
        }
      );
      expect(result).toEqual(updatedSolicitud);
    });

    test('debe manejar múltiples usuarios creando solicitudes simultáneamente', async () => {
      // Arrange
      const mockRol = { id: 2, nombre: 'Profesor' };
      const mockSolicitud1 = {
        id: 1,
        usuarioId: 1,
        rol_usuarioId: 2,
        estado: 'pendiente',
      };
      const mockSolicitud2 = {
        id: 2,
        usuarioId: 2,
        rol_usuarioId: 2,
        estado: 'pendiente',
      };

      roleRepository.findById.mockResolvedValue(mockRol);
      solicitudRepository.findByUsuarioId.mockResolvedValue(null);
      solicitudRepository.createSolicitud
        .mockResolvedValueOnce(mockSolicitud1)
        .mockResolvedValueOnce(mockSolicitud2);

      // Act
      const [result1, result2] = await Promise.all([
        solicitudService.createSolicitud(1, rolId),
        solicitudService.createSolicitud(2, rolId),
      ]);

      // Assert
      expect(result1.usuarioId).toBe(1);
      expect(result2.usuarioId).toBe(2);
      expect(solicitudRepository.createSolicitud).toHaveBeenCalledTimes(2);
    });
  });

  describe('getMyRequest', () => {
    const usuarioId = 1;

    test('debe retornar la solicitud pendiente del usuario', async () => {
      // Arrange
      const mockSolicitud = {
        id: 1,
        usuarioId: 1,
        rol_usuarioId: 2,
        estado: 'pendiente',
        fecha_solicitud: new Date(),
      };

      solicitudRepository.myrequest.mockResolvedValue(mockSolicitud);

      // Act
      const result = await solicitudService.getMyRequest(usuarioId);

      // Assert
      expect(solicitudRepository.myrequest).toHaveBeenCalledWith(usuarioId);
      expect(result).toEqual(mockSolicitud);
    });

    test('debe retornar null si el usuario no tiene solicitudes', async () => {
      // Arrange
      solicitudRepository.myrequest.mockResolvedValue(null);

      // Act
      const result = await solicitudService.getMyRequest(usuarioId);

      // Assert
      expect(solicitudRepository.myrequest).toHaveBeenCalledWith(usuarioId);
      expect(result).toBeNull();
    });

    test('debe retornar null si myrequest retorna undefined', async () => {
      // Arrange
      solicitudRepository.myrequest.mockResolvedValue(undefined);

      // Act
      const result = await solicitudService.getMyRequest(usuarioId);

      // Assert
      expect(solicitudRepository.myrequest).toHaveBeenCalledWith(usuarioId);
      expect(result).toBeNull();
    });

    test('debe manejar errores del repositorio', async () => {
      // Arrange
      const error = new Error('Error de base de datos');
      solicitudRepository.myrequest.mockRejectedValue(error);

      // Act & Assert
      await expect(solicitudService.getMyRequest(usuarioId))
        .rejects
        .toThrow('Error de base de datos');

      expect(solicitudRepository.myrequest).toHaveBeenCalledWith(usuarioId);
    });

    test('debe retornar solicitud con todos sus campos', async () => {
      // Arrange
      const mockSolicitud = {
        id: 1,
        usuarioId: 1,
        rol_usuarioId: 2,
        estado: 'pendiente',
        fecha_solicitud: new Date('2024-01-15'),
        usuario: {
          id: 1,
          nombre: 'Juan Pérez',
          email: 'juan@example.com',
        },
        rol: {
          id: 2,
          nombre: 'Profesor',
        },
      };

      solicitudRepository.myrequest.mockResolvedValue(mockSolicitud);

      // Act
      const result = await solicitudService.getMyRequest(usuarioId);

      // Assert
      expect(result).toEqual(mockSolicitud);
      expect(result.usuario).toBeDefined();
      expect(result.rol).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    test('createSolicitud - debe manejar rolId inválido (0)', async () => {
      // Arrange
      roleRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(solicitudService.createSolicitud(1, 0))
        .rejects
        .toEqual({ status: 400, mesage: 'rol invalido ' });
    });

    test('createSolicitud - debe manejar usuarioId inválido', async () => {
      // Arrange
      const mockRol = { id: 2, nombre: 'Profesor' };
      roleRepository.findById.mockResolvedValue(mockRol);
      solicitudRepository.findByUsuarioId.mockResolvedValue(null);
      solicitudRepository.createSolicitud.mockResolvedValue({
        id: 1,
        usuarioId: null,
        rol_usuarioId: 2,
        estado: 'pendiente',
      });

      // Act
      const result = await solicitudService.createSolicitud(null, 2);

      // Assert
      expect(result.usuarioId).toBeNull();
    });

    test('getMyRequest - debe manejar usuarioId 0', async () => {
      // Arrange
      solicitudRepository.myrequest.mockResolvedValue(null);

      // Act
      const result = await solicitudService.getMyRequest(0);

      // Assert
      expect(result).toBeNull();
      expect(solicitudRepository.myrequest).toHaveBeenCalledWith(0);
    });
  });
});
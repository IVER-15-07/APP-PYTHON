import { createRoleRequest, getMyRequest } from '../../src/modules/teacher/controllers/request.controller.js';
import { solicitudService } from '../../src/modules/teacher/services/request.service.js';

// Mock del servicio
jest.mock('../../src/modules/teacher/services/request.service.js');

describe('Request Controller', () => {
  let req, res;

  beforeEach(() => {
    // Reset de mocks antes de cada test
    jest.clearAllMocks();

    // Mock de req y res
    req = {
      body: {},
      user: null,
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    // Mock de console.error para evitar logs en tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe('createRoleRequest', () => {
    test('debe crear una solicitud exitosamente', async () => {
      // Arrange
      req.user = { id: 1 };
      req.body = { rolId: 2 };

      const mockSolicitud = {
        id: 1,
        requesterId: 1,
        rolId: 2,
        estado: 'pendiente',
        createdAt: new Date(),
      };

      solicitudService.createSolicitud.mockResolvedValue(mockSolicitud);

      // Act
      await createRoleRequest(req, res);

      // Assert
      expect(solicitudService.createSolicitud).toHaveBeenCalledWith(1, 2);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Solicitud creada',
        data: mockSolicitud,
      });
      expect(res.status).not.toHaveBeenCalled();
    });

    test('debe retornar 401 si no hay usuario autenticado', async () => {
      // Arrange
      req.user = null;
      req.body = { rolId: 2 };

      // Act
      await createRoleRequest(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'No autenticado',
      });
      expect(solicitudService.createSolicitud).not.toHaveBeenCalled();
    });

    test('debe retornar 401 si req.user no tiene id', async () => {
      // Arrange
      req.user = {};
      req.body = { rolId: 2 };

      // Act
      await createRoleRequest(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'No autenticado',
      });
    });

    test('debe retornar 400 si falta rolId', async () => {
      // Arrange
      req.user = { id: 1 };
      req.body = {};

      // Act
      await createRoleRequest(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'rolId requerido',
      });
      expect(solicitudService.createSolicitud).not.toHaveBeenCalled();
    });

    test('debe retornar 400 si rolId es null', async () => {
      // Arrange
      req.user = { id: 1 };
      req.body = { rolId: null };

      // Act
      await createRoleRequest(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'rolId requerido',
      });
    });

    test('debe manejar errores del servicio con status personalizado', async () => {
      // Arrange
      req.user = { id: 1 };
      req.body = { rolId: 2 };

      const customError = new Error('Rol no válido');
      customError.status = 404;
      solicitudService.createSolicitud.mockRejectedValue(customError);

      // Act
      await createRoleRequest(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Rol no válido',
      });
      expect(console.error).toHaveBeenCalled();
    });

    test('debe manejar errores genéricos con status 500', async () => {
      // Arrange
      req.user = { id: 1 };
      req.body = { rolId: 2 };

      const genericError = new Error('Error de base de datos');
      solicitudService.createSolicitud.mockRejectedValue(genericError);

      // Act
      await createRoleRequest(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error de base de datos',
      });
    });

    test('debe usar mensaje por defecto si el error no tiene mensaje', async () => {
      // Arrange
      req.user = { id: 1 };
      req.body = { rolId: 2 };

      solicitudService.createSolicitud.mockRejectedValue({});

      // Act
      await createRoleRequest(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error interno',
      });
    });
  });

  describe('getMyRequest', () => {
    test('debe obtener la solicitud del usuario exitosamente', async () => {
      // Arrange
      req.user = { id: 1 };

      const mockSolicitud = {
        id: 1,
        requesterId: 1,
        rolId: 2,
        estado: 'pendiente',
        createdAt: new Date(),
      };

      solicitudService.getMyRequest.mockResolvedValue(mockSolicitud);

      // Act
      await getMyRequest(req, res);

      // Assert
      expect(solicitudService.getMyRequest).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockSolicitud,
      });
      expect(res.status).not.toHaveBeenCalled();
    });

    test('debe retornar 401 si no hay usuario autenticado', async () => {
      // Arrange
      req.user = null;

      // Act
      await getMyRequest(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'No autenticado',
      });
      expect(solicitudService.getMyRequest).not.toHaveBeenCalled();
    });

    test('debe retornar 401 si req.user no tiene id', async () => {
      // Arrange
      req.user = {};

      // Act
      await getMyRequest(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'No autenticado',
      });
    });

    test('debe retornar solicitud null si el usuario no tiene solicitud', async () => {
      // Arrange
      req.user = { id: 1 };
      solicitudService.getMyRequest.mockResolvedValue(null);

      // Act
      await getMyRequest(req, res);

      // Assert
      expect(solicitudService.getMyRequest).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: null,
      });
    });

    test('debe manejar errores del servicio con status personalizado', async () => {
      // Arrange
      req.user = { id: 1 };

      const customError = new Error('Usuario no encontrado');
      customError.status = 404;
      solicitudService.getMyRequest.mockRejectedValue(customError);

      // Act
      await getMyRequest(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Usuario no encontrado',
      });
      expect(console.error).toHaveBeenCalled();
    });

    test('debe manejar errores genéricos con status 500', async () => {
      // Arrange
      req.user = { id: 1 };

      const genericError = new Error('Error de conexión');
      solicitudService.getMyRequest.mockRejectedValue(genericError);

      // Act
      await getMyRequest(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error de conexión',
      });
    });
  });
});
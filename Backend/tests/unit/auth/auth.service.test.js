// tests/unit/auth/auth.service.test.js
import { authService } from '../../../src/modules/auth/services/auth.service.js';
import { usuarioRepository } from '../../../src/modules/auth/repositories/auth.repository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mocks de dependencias
jest.mock('bcrypt', () => ({ hash: jest.fn(), compare: jest.fn() }));
jest.mock('jsonwebtoken', () => ({ sign: jest.fn() }));
jest.mock('../../../src/modules/auth/repositories/auth.repository.js', () => ({
  usuarioRepository: {
    findByEmail: jest.fn(),
    create: jest.fn(),
  },
}));

// Mock de firebase admin (usar prefijo "mock" para variables fuera del factory)
const mockVerifyIdToken = jest.fn();
jest.mock('../../../src/config/firebaseAdmin.js', () => {
  const mock = {
    auth: () => ({ verifyIdToken: mockVerifyIdToken }),
    apps: [true],
  };
  return { __esModule: true, default: mock };
});

describe('authService.register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('lanza 400 si faltan campos requeridos', async () => {
    await expect(
      authService.register({ nombre: 'A', email: 'a@a.com' })
    ).rejects.toEqual({
      status: 400,
      message: 'Nombre, email, contrasena y rol_usuarioId son requeridos',
    });
  });

  test('lanza 400 si el email ya existe', async () => {
    usuarioRepository.findByEmail.mockResolvedValue({ id: 1, email: 'a@a.com' });

    await expect(
      authService.register({ nombre: 'A', email: 'a@a.com', contrasena: '123', rol_usuarioId: 1 })
    ).rejects.toEqual({ status: 400, message: 'Email ya registrado' });
  });

  test('registra usuario y retorna token', async () => {
    usuarioRepository.findByEmail.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashed-123');
    const user = {
      id: 1,
      nombre: 'A',
      email: 'a@a.com',
      rol_usuarioId: 1,
      provider: 'local',
    };
    usuarioRepository.create.mockResolvedValue(user);
    jwt.sign.mockReturnValue('mock.jwt');

    const res = await authService.register({
      nombre: 'A',
      email: 'a@a.com',
      contrasena: '123',
      rol_usuarioId: 1,
    });

    expect(bcrypt.hash).toHaveBeenCalledWith('123', 10);
    expect(usuarioRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        nombre: 'A',
        email: 'a@a.com',
        contrasena: 'hashed-123',
        rol_usuarioId: 1,
        provider: 'local',
      })
    );
    expect(jwt.sign).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1, email: 'a@a.com' }),
      expect.any(String),
      expect.objectContaining({ expiresIn: expect.any(String) })
    );
    expect(res).toEqual({ user, token: 'mock.jwt' });
  });
});

describe('authService.login', () => {
  beforeEach(() => jest.clearAllMocks());

  test('lanza 400 si faltan email o contrasena', async () => {
    await expect(authService.login({ email: '', contrasena: '' }))
      .rejects.toEqual({ status: 400, message: 'Email y contrasena son requeridos' });
  });

  test('lanza 401 si usuario no existe', async () => {
    usuarioRepository.findByEmail.mockResolvedValue(null);

    await expect(authService.login({ email: 'x@x.com', contrasena: '123' }))
      .rejects.toEqual({ status: 401, message: 'Credenciales inválidas' });
  });

  test('lanza 400 si provider no es local', async () => {
    usuarioRepository.findByEmail.mockResolvedValue({ id: 1, email: 'x@x.com', provider: 'firebase' });

    await expect(authService.login({ email: 'x@x.com', contrasena: '123' }))
      .rejects.toEqual({ status: 400, message: 'Cuenta registrada con proveedor externo' });
  });

  test('lanza 401 si contraseña inválida', async () => {
    usuarioRepository.findByEmail.mockResolvedValue({ id: 1, email: 'x@x.com', contrasena: 'hashed', provider: 'local' });
    bcrypt.compare.mockResolvedValue(false);

    await expect(authService.login({ email: 'x@x.com', contrasena: 'bad' }))
      .rejects.toEqual({ status: 401, message: 'Credenciales inválidas' });
  });

  test('retorna user y token cuando login es válido', async () => {
    const user = { id: 1, email: 'x@x.com', contrasena: 'hashed', provider: 'local', rol_usuarioId: 3 };
    usuarioRepository.findByEmail.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('mock.jwt');

    const res = await authService.login({ email: 'x@x.com', contrasena: '123' });

    expect(bcrypt.compare).toHaveBeenCalledWith('123', 'hashed');
    expect(jwt.sign).toHaveBeenCalled();
    expect(res).toEqual({ user, token: 'mock.jwt' });
  });
});

describe('authService.firebaseLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('lanza 400 si falta idToken', async () => {
    await expect(authService.firebaseLogin({ idToken: '' }))
      .rejects.toEqual({ status: 400, message: 'firebaseToken requerido' });
  });

  test('login firebase con usuario existente', async () => {
    const decoded = { email: 'f@f.com', name: 'Firebase User', picture: 'http://pic' };
    mockVerifyIdToken.mockResolvedValue(decoded);
    const user = {
      id: 99,
      nombre: 'Firebase User',
      email: 'f@f.com',
      rol_usuarioId: 2,
      profilePicture: 'http://pic',
      provider: 'firebase',
    };
    usuarioRepository.findByEmail.mockResolvedValue(user);
    jwt.sign.mockReturnValue('mock.jwt');

    const res = await authService.firebaseLogin({ idToken: 'valid' });

    expect(usuarioRepository.findByEmail).toHaveBeenCalledWith('f@f.com');
    expect(jwt.sign).toHaveBeenCalled();
    expect(res).toEqual({
      token: 'mock.jwt',
      usuario: {
        id: 99,
        nombre: 'Firebase User',
        email: 'f@f.com',
        rol_usuarioId: 2,
        profilePicture: 'http://pic',
      },
    });
  });

  test('login firebase crea usuario si no existe (roleId por defecto = 2)', async () => {
    const decoded = { email: 'new@f.com', name: 'New F', picture: null };
    mockVerifyIdToken.mockResolvedValue(decoded);
    usuarioRepository.findByEmail.mockResolvedValue(null);
    const created = {
      id: 101,
      nombre: 'New F',
      email: 'new@f.com',
      rol_usuarioId: 2,
      profilePicture: null,
      provider: 'firebase',
    };
    usuarioRepository.create.mockResolvedValue(created);
    jwt.sign.mockReturnValue('mock.jwt');

    const res = await authService.firebaseLogin({ idToken: 'valid' });

    expect(usuarioRepository.create).toHaveBeenCalledWith({
      nombre: 'New F',
      email: 'new@f.com',
      contrasena: null,
      rol_usuarioId: 2,
      profilePicture: null,
      provider: 'firebase',
    });
    expect(res.usuario).toEqual({
      id: 101,
      nombre: 'New F',
      email: 'new@f.com',
      rol_usuarioId: 2,
      profilePicture: null,
    });
  });

  test('login firebase crea usuario con roleId proporcionado', async () => {
    const decoded = { email: 'role@f.com', name: 'Role F', picture: null };
    mockVerifyIdToken.mockResolvedValue(decoded);
    usuarioRepository.findByEmail.mockResolvedValue(null);
    const created = { id: 102, nombre: 'Role F', email: 'role@f.com', rol_usuarioId: 4, profilePicture: null, provider: 'firebase' };
    usuarioRepository.create.mockResolvedValue(created);
    jwt.sign.mockReturnValue('mock.jwt');

    const res = await authService.firebaseLogin({ idToken: 'valid', roleId: 4 });

    expect(usuarioRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'role@f.com', rol_usuarioId: 4 })
    );
    expect(res.usuario.rol_usuarioId).toBe(4);
  });

  test('propaga error con status 400 y mensaje desde verifyIdToken', async () => {
    const err = new Error('Invalid token');
    mockVerifyIdToken.mockRejectedValue(err);

    await expect(authService.firebaseLogin({ idToken: 'bad' }))
      .rejects.toEqual({ status: 400, message: 'Invalid token' });
  });
});

import { authService } from '../../../src/modules/auth/services/auth.service.js';
import { usuarioRepository } from '../../../src/modules/auth/repositories/auth.repository.js';
import { userRepository } from '../../../src/modules/auth/repositories/user.repository.js';
import { pendingRepository } from '../../../src/modules/auth/repositories/pending.repository.js';
import { sendVerificationCode } from '../../../src/modules/auth/utils/mailer.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import admin from '../../../src/config/firebaseAdmin.js';

// Mocks de dependencias
jest.mock('bcrypt', () => ({ hash: jest.fn(), compare: jest.fn() }));
jest.mock('jsonwebtoken', () => ({ sign: jest.fn() }));
jest.mock('../../../src/modules/auth/repositories/user.repository.js');
jest.mock('../../../src/modules/auth/repositories/pending.repository.js');
jest.mock('../../../src/modules/auth/utils/mailer.js');
jest.mock('bcrypt');
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

describe('modules/auth authService => register', () => {
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

describe('modules/auth authService => login', () => {
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

describe('modules/auth authService => firebaseLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('lanza 400 si falta idToken', async () => {
    await expect(authService.firebaseLogin({}))
      .rejects.toEqual({ status: 400, message: 'idToken requerido' });
  });

  test('lanza 400 si el token no tiene email', async () => {
    admin.auth().verifyIdToken.mockResolvedValue({ uid: 'abc123' }); // sin email

    await expect(authService.firebaseLogin({ idToken: 'tokenABC' }))
      .rejects.toEqual({ status: 400, message: 'Email no disponible en token' });
  });

  test('retorna usuario existente sin crear nuevo (conserva rol existente)', async () => {
    admin.auth().verifyIdToken.mockResolvedValue({
      email: 'existing@test.com',
      name: 'Existing User',
      picture: 'http://pic.com/photo.jpg',
    });
    const existingUser = {
      id: 10,
      email: 'existing@test.com',
      nombre: 'Existing User',
      rol_usuarioId: 3, // rol profesor ejecutor
      profilePicture: 'http://pic.com/photo.jpg',
      provider: 'firebase',
    };
    usuarioRepository.findByEmail.mockResolvedValue(existingUser);
    jwt.sign.mockReturnValue('mock.token.existing');

    const res = await authService.firebaseLogin({ idToken: 'tokenXYZ', roleId: 5 });

    expect(usuarioRepository.findByEmail).toHaveBeenCalledWith('existing@test.com');
    expect(usuarioRepository.create).not.toHaveBeenCalled(); // NO crea nuevo
    expect(jwt.sign).toHaveBeenCalledWith(
      expect.objectContaining({ id: 10, email: 'existing@test.com', rol_usuarioId: 3 }),
      expect.any(String),
      expect.any(Object)
    );
    expect(res).toEqual({
      success: true,
      data: {
        token: 'mock.token.existing',
        usuario: existingUser,
      },
    });
  });

  test('crea usuario nuevo con rol=5 si no se especifica roleId', async () => {
    admin.auth().verifyIdToken.mockResolvedValue({
      email: 'new@test.com',
      name: 'New User',
      picture: null,
    });
    usuarioRepository.findByEmail.mockResolvedValue(null);
    const newUser = {
      id: 20,
      email: 'new@test.com',
      nombre: 'New User',
      contrasena: null,
      rol_usuarioId: 5,
      profilePicture: null,
      provider: 'firebase',
    };
    usuarioRepository.create.mockResolvedValue(newUser);
    jwt.sign.mockReturnValue('mock.token.new');

    const res = await authService.firebaseLogin({ idToken: 'tokenABC' }); // sin roleId

    expect(usuarioRepository.create).toHaveBeenCalledWith({
      email: 'new@test.com',
      nombre: 'New User',
      contrasena: null,
      rol_usuarioId: 5, // default
      profilePicture: null,
      provider: 'firebase',
    });
    expect(res).toEqual({
      success: true,
      data: {
        token: 'mock.token.new',
        usuario: newUser,
      },
    });
  });

  test('crea usuario nuevo con rol=4 si roleId=4', async () => {
    admin.auth().verifyIdToken.mockResolvedValue({
      email: 'student@test.com',
      name: 'Student',
      picture: 'http://avatar.com/s.jpg',
    });
    usuarioRepository.findByEmail.mockResolvedValue(null);
    const newStudent = {
      id: 30,
      email: 'student@test.com',
      nombre: 'Student',
      contrasena: null,
      rol_usuarioId: 4,
      profilePicture: 'http://avatar.com/s.jpg',
      provider: 'firebase',
    };
    usuarioRepository.create.mockResolvedValue(newStudent);
    jwt.sign.mockReturnValue('mock.token.student');

    const res = await authService.firebaseLogin({ idToken: 'tokenSTUDENT', roleId: 4 });

    expect(usuarioRepository.create).toHaveBeenCalledWith({
      email: 'student@test.com',
      nombre: 'Student',
      contrasena: null,
      rol_usuarioId: 4,
      profilePicture: 'http://avatar.com/s.jpg',
      provider: 'firebase',
    });
    expect(res.data.usuario.rol_usuarioId).toBe(4);
  });

  test('crea usuario con rol=5 si roleId es diferente de 4', async () => {
    admin.auth().verifyIdToken.mockResolvedValue({
      email: 'other@test.com',
      name: 'Other',
    });
    usuarioRepository.findByEmail.mockResolvedValue(null);
    const newUser = {
      id: 40,
      email: 'other@test.com',
      nombre: 'Other',
      rol_usuarioId: 5,
      provider: 'firebase',
    };
    usuarioRepository.create.mockResolvedValue(newUser);
    jwt.sign.mockReturnValue('mock.token.other');

    const res = await authService.firebaseLogin({ idToken: 'tokenOTHER', roleId: 99 });

    expect(usuarioRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ rol_usuarioId: 5 })
    );
    expect(res.data.usuario.rol_usuarioId).toBe(5);
  });

  test('lanza error si verifyIdToken falla', async () => {
    admin.auth().verifyIdToken.mockRejectedValue(new Error('Token inválido'));

    await expect(authService.firebaseLogin({ idToken: 'badToken' }))
      .rejects.toThrow('Token inválido');
  });

  describe('modules/auth authService => send Code', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('lanza 400 si falta nombre', async () => {
      await expect(authService.registerSendCode({ email: 'test@test.com', contrasena: '123' }))
        .rejects.toEqual({ status: 400, message: 'Faltan campos' });
    });

    test('lanza 400 si falta email', async () => {
      await expect(authService.registerSendCode({ nombre: 'Test', contrasena: '123' }))
        .rejects.toEqual({ status: 400, message: 'Faltan campos' });
    });

    test('lanza 400 si falta contrasena', async () => {
      await expect(authService.registerSendCode({ nombre: 'Test', email: 'test@test.com' }))
        .rejects.toEqual({ status: 400, message: 'Faltan campos' });
    });

    test('lanza 400 si el email ya está registrado', async () => {
      userRepository.findByEmail.mockResolvedValue({ id: 1, email: 'existing@test.com' });

      await expect(authService.registerSendCode({
        nombre: 'Test',
        email: 'existing@test.com',
        contrasena: '123456',
      })).rejects.toEqual({ status: 400, message: 'Email ya registrado' });
    });

    test('invalida códigos previos del mismo email', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword');
      pendingRepository.invalidateAllByEmail.mockResolvedValue();
      pendingRepository.create.mockResolvedValue({ id: 10 });
      sendVerificationCode.mockResolvedValue();

      await authService.registerSendCode({
        nombre: 'New User',
        email: 'new@test.com',
        contrasena: 'password123',
        rol_usuarioId: 4,
      });

      expect(pendingRepository.invalidateAllByEmail).toHaveBeenCalledWith('new@test.com');
    });

    test('hashea la contraseña con bcrypt', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword123');
      pendingRepository.invalidateAllByEmail.mockResolvedValue();
      pendingRepository.create.mockResolvedValue({ id: 10 });
      sendVerificationCode.mockResolvedValue();

      await authService.registerSendCode({
        nombre: 'User',
        email: 'user@test.com',
        contrasena: 'mypassword',
      });

      expect(bcrypt.hash).toHaveBeenCalledWith('mypassword', 10);
    });

    test('crea registro pendiente con código de 6 dígitos y expiración 15 min', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashed');
      pendingRepository.invalidateAllByEmail.mockResolvedValue();
      pendingRepository.create.mockResolvedValue({ id: 10 });
      sendVerificationCode.mockResolvedValue();

      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);

      await authService.registerSendCode({
        nombre: 'Test User',
        email: 'test@test.com',
        contrasena: 'pass123',
        rol_usuarioId: 5,
      });

      expect(pendingRepository.create).toHaveBeenCalledWith({
        email: 'test@test.com',
        nombre: 'Test User',
        contrasenaHash: 'hashed',
        rol_usuarioId: 5,
        code: expect.stringMatching(/^\d{6}$/), // 6 dígitos
        expira: new Date(now + 15 * 60 * 1000),
      });

      Date.now.mockRestore();
    });

    test('usa rol_usuarioId=5 por defecto si no se proporciona', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashed');
      pendingRepository.invalidateAllByEmail.mockResolvedValue();
      pendingRepository.create.mockResolvedValue({ id: 10 });
      sendVerificationCode.mockResolvedValue();

      await authService.registerSendCode({
        nombre: 'Default Role',
        email: 'default@test.com',
        contrasena: 'pass',
      });

      expect(pendingRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ rol_usuarioId: 5 })
      );
    });

    test('envía el código de verificación por email', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashed');
      pendingRepository.invalidateAllByEmail.mockResolvedValue();
      pendingRepository.create.mockResolvedValue({ id: 10 });
      sendVerificationCode.mockResolvedValue();

      await authService.registerSendCode({
        nombre: 'User',
        email: 'mail@test.com',
        contrasena: 'pass',
      });

      expect(sendVerificationCode).toHaveBeenCalledWith(
        'mail@test.com',
        expect.stringMatching(/^\d{6}$/)
      );
    });

    test('retorna success=true y mensaje', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashed');
      pendingRepository.invalidateAllByEmail.mockResolvedValue();
      pendingRepository.create.mockResolvedValue({ id: 10 });
      sendVerificationCode.mockResolvedValue();

      const result = await authService.registerSendCode({
        nombre: 'User',
        email: 'user@test.com',
        contrasena: 'pass',
      });

      expect(result).toEqual({
        success: true,
        message: 'Código enviado al correo',
      });
    });
  });

  describe('modules/auth authService => verify Code', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('lanza 400 si falta email', async () => {
      await expect(authService.registerVerifyCode({ code: '123456' }))
        .rejects.toEqual({ status: 400, message: 'Email y código requeridos' });
    });

    test('lanza 400 si falta code', async () => {
      await expect(authService.registerVerifyCode({ email: 'test@test.com' }))
        .rejects.toEqual({ status: 400, message: 'Email y código requeridos' });
    });

    test('lanza 400 si el código es inválido o expirado', async () => {
      pendingRepository.findValidByEmailAndCode.mockResolvedValue(null);

      await expect(authService.registerVerifyCode({
        email: 'test@test.com',
        code: '999999',
      })).rejects.toEqual({ status: 400, message: 'Código inválido o expirado' });
    });

    test('crea usuario con datos del registro pendiente', async () => {
      const mockPending = {
        id: 10,
        email: 'verified@test.com',
        nombre: 'Verified User',
        contrasenaHash: 'hashedPass',
        rol_usuarioId: 4,
        code: '123456',
        expira: new Date(Date.now() + 10 * 60 * 1000),
      };
      pendingRepository.findValidByEmailAndCode.mockResolvedValue(mockPending);

      const mockUser = {
        id: 20,
        nombre: 'Verified User',
        email: 'verified@test.com',
        contrasena: 'hashedPass',
        rol_usuarioId: 4,
        verificado: true,
        provider: 'local',
      };
      userRepository.create.mockResolvedValue(mockUser);
      pendingRepository.marcaUsada.mockResolvedValue();

      const result = await authService.registerVerifyCode({
        email: 'verified@test.com',
        code: '123456',
      });

      expect(userRepository.create).toHaveBeenCalledWith({
        nombre: 'Verified User',
        email: 'verified@test.com',
        contrasena: 'hashedPass',
        rol_usuarioId: 4,
        verificado: true,
        provider: 'local',
      });
      expect(result).toEqual({ success: true, user: mockUser });
    });

    test('marca el registro pendiente como usado', async () => {
      const mockPending = {
        id: 15,
        email: 'user@test.com',
        nombre: 'User',
        contrasenaHash: 'hash',
        rol_usuarioId: 5,
      };
      pendingRepository.findValidByEmailAndCode.mockResolvedValue(mockPending);
      userRepository.create.mockResolvedValue({ id: 25 });
      pendingRepository.marcaUsada.mockResolvedValue();

      await authService.registerVerifyCode({ email: 'user@test.com', code: '654321' });

      expect(pendingRepository.marcaUsada).toHaveBeenCalledWith(15);
    });

    test('convierte code a String al buscar', async () => {
      pendingRepository.findValidByEmailAndCode.mockResolvedValue(null);

      await expect(authService.registerVerifyCode({
        email: 'test@test.com',
        code: 123456, // número
      })).rejects.toEqual({ status: 400, message: 'Código inválido o expirado' });

      expect(pendingRepository.findValidByEmailAndCode).toHaveBeenCalledWith(
        'test@test.com',
        '123456' // convertido a string
      );
    });




  });
});
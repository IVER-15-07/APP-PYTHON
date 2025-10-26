import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import admin from "../../../config/firebaseAdmin.js";
import { usuarioRepository } from "../repositories/auth.repository.js";
import { userRepository } from "../repositories/user.repository.js";
import { pendingRepository } from "../repositories/pending.repository.js";
import { sendVerificationCode } from "../utils/mailer.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

function generateToken(user) {
  // acceso seguro a la relación rol_usuario y fallback
  const roleName = user?.rol_usuario?.nombre ?? null;
  const payload = {
    id: user.id,
    email: user.email,
    rol_usuarioId: user?.rol_usuarioId ?? null,
    rol_nombre: roleName,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export const authService = {
  async register(data) {
    const { nombre, email, contrasena, rol_usuarioId, profilePicture } = data;
    if (!nombre || !email || !contrasena || !rol_usuarioId) {
      throw { status: 400, message: "Nombre, email, contrasena y rol_usuarioId son requeridos" };
    }

    const existing = await usuarioRepository.findByEmail(email);
    if (existing) throw { status: 400, message: "Email ya registrado" };

    const hashed = await bcrypt.hash(contrasena, 10);
    const user = await usuarioRepository.create({
      nombre,
      email,
      contrasena: hashed,
      rol_usuarioId: Number(rol_usuarioId),
      profilePicture: profilePicture || null,
      provider: "local",
    });

    const token = generateToken(user);
    return { user, token };
  },

  async login({ email, contrasena }) {
    if (!email || !contrasena) throw { status: 400, message: "Email y contrasena son requeridos" };

    const user = await usuarioRepository.findByEmail(email); // debe incluir rol_usuario
    if (!user) throw { status: 401, message: "Credenciales inválidas" };
    if (user.provider && user.provider !== "local") throw { status: 400, message: "Cuenta registrada con proveedor externo" };

    const valid = await bcrypt.compare(contrasena, user.contrasena);
    if (!valid) throw { status: 401, message: "Credenciales inválidas" };

    const token = generateToken(user);
    return { user, token };
  },


  async firebaseLogin({ idToken, roleId }) {
    if (!idToken) throw { status: 400, message: "idToken requerido" };

    const decoded = await admin.auth().verifyIdToken(idToken);
    const email = decoded.email;
    if (!email) throw { status: 400, message: "Email no disponible en token" };

    let user = await usuarioRepository.findByEmail(email);

    if (!user) {
      // SOLO en la creación usamos el roleId inicial:
      // /login?rol=estudiante => 4, /login?rol=usuario => 5
      const initialRole = Number(roleId) === 4 ? 4 : 5;
      user = await usuarioRepository.create({
        email,
        nombre: decoded.name || email,
        contrasena: null,
        rol_usuarioId: initialRole,
        profilePicture: decoded.picture || null,
        provider: "firebase",
        //uid_firebase: decoded.uid,
      });
    }
    // ¡Usuario existente! → NO tocar rol aquí

    const token = generateToken(user);
    return { success: true, data: { token, usuario: user } };
  },


  async registerSendCode(data) {
    const { nombre, email, contrasena, rol_usuarioId } = data;

    if (!nombre || !email || !contrasena)
      throw { status: 400, message: "Faltan campos" };

    const exists = await userRepository.findByEmail(email);
    if (exists) throw { status: 400, message: "Email ya registrado" };

    // invalida códigos previos no usados
    await pendingRepository.invalidateAllByEmail(email);

    const contrasenaHash = await bcrypt.hash(contrasena, 10);
    const code = String(100000 + Math.floor(Math.random() * 900000)); // 6 dígitos
    const expira = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    await pendingRepository.create({
      email,
      nombre,
      contrasenaHash,
      rol_usuarioId: Number(rol_usuarioId) || 5,
      code,
      expira,
    });

    await sendVerificationCode(email, code);
    return { success: true, message: "Código enviado al correo" };
  },

  async registerVerifyCode(data) {
    const { email, code } = data;

    if (!email || !code)
      throw { status: 400, message: "Email y código requeridos" };

    const pending = await pendingRepository.findValidByEmailAndCode(email, String(code));
    if (!pending)
      throw { status: 400, message: "Código inválido o expirado" };

    const user = await userRepository.create({
      nombre: pending.nombre,
      email: pending.email,
      contrasena: pending.contrasenaHash,
      rol_usuarioId: pending.rol_usuarioId,
      verificado: true,
      provider: "local",
    });

    await pendingRepository.marcaUsada(pending.id);
    return { success: true, user };
  },



};
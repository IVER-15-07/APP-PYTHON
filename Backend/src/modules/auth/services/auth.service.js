import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import admin from "../../../config/firebaseAdmin.js";
import { usuarioRepository } from "../repositories/auth.repository.js";


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




  // firebaseToken: token que viene del cliente (client-side Firebase)
  async firebaseLogin({ firebaseToken, userData }) {
    if (!firebaseToken) throw { status: 400, message: "firebaseToken requerido" };
    // verifica token
    const decoded = await admin.auth().verifyIdToken(firebaseToken).catch(err => {
      throw { status: 401, message: "Firebase token inválido" };
    });

    const email = decoded.email || userData?.email;
    if (!email) throw { status: 400, message: "Email no disponible en token" };

    // buscar usuario por email
    let user = await usuarioRepository.findByEmail(email);

    if (!user) {
      // crear usuario (provider = 'firebase')
      user = await usuarioRepository.create({
        nombre: userData?.name || decoded.name || "Usuario Firebase",
        email,
        contrasena: null,
        provider: "firebase",
        profilePicture: userData?.photoURL || decoded.picture || null,
        rol_usuarioId: Number(userData?.rol_usuarioId || 1) // por defecto rol 1 (ajusta)
      });
    } else {
      // si existe y provider distinto, podrías actualizar profilePicture si quieres
    }

    const token = generateToken(user);
    return { user, token };
  }




};
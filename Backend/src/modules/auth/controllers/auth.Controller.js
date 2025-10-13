import { authService } from "../services/auth.service.js";


export async function register(req, res) {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ success: false, message: err.message || "Error interno" });
  }
}


export async function login(req, res) {
  try {
    const { user, token } = await authService.login(req.body);
    return res.json({
      success: true,
      message: "Login exitoso",
      data: {
        token,
        usuario: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          rol_usuarioId: user.rol_usuarioId,
          profilePicture: user.profilePicture || null,
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ success: false, message: err.message || "Error interno" });
  }
}

export async function firebaseLogin(req, res) {
  try {
    console.log("POST /api/firebase-login body:", req.body); // <<-- debug
    const { idToken, roleId } = req.body;
    const result = await authService.firebaseLogin({ idToken, roleId });
    res.json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ success: false, message: err.message || "Error interno" });
  }
}

export async function me(req, res) {
  try {
    // req.user viene de middleware verifyToken
    res.json({ success: true, user: req.user });
  } catch (err) {
    res.status(500).json({ success: false });
  }
}

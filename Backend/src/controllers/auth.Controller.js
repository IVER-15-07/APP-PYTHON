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
    const result = await authService.login(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ success: false, message: err.message || "Error interno" });
  }
}

export async function firebaseLogin(req, res) {
  try {
    const { firebaseToken, userData } = req.body;
    const result = await authService.firebaseLogin({ firebaseToken, userData });
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

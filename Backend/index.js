import dotenv from "dotenv";
import axios from "axios";
import app from "./src/app.js";

dotenv.config();
const PORT = process.env.PORT || 3000;

// 1. INICIAR EL SERVIDOR PRIMERO (Prioridad máxima para Railway)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);

  // 2. Tareas secundarias (Logs, chequeo de IP, conexión a DB logs, etc.)
  // Esto ya no bloquea el arranque
  axios.get("https://api.ipify.org?format=json")
    .then(({ data }) => console.log("🌐 IP pública de la aplicación:", data.ip))
    .catch((err) => console.error("Error al obtener IP (no crítico):", err.message));
});
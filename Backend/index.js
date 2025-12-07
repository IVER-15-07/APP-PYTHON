import dotenv from "dotenv";
import axios from "axios";
import http from "http";
import app from "./src/app.js";
import { initializeSocket } from "./src/websocket/socket.config.js";

dotenv.config();
const PORT = process.env.PORT || 3000;

// Crear servidor HTTP para Socket.io
const httpServer = http.createServer(app);

// Inicializar Socket.io
initializeSocket(httpServer);

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);

  axios.get("https://api.ipify.org?format=json")
    .then(({ data }) => console.log("🌐 IP pública de la aplicación:", data.ip))
    .catch((err) => console.error("Error al obtener IP (no crítico):", err.message));
});
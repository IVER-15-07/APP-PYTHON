
import dotenv from "dotenv";
import axios from "axios";
import app from "./src/app.js";

dotenv.config();
const PORT = process.env.PORT || 3000;

// Mostrar IP pública (solo informativo)
try {
  const { data } = await axios.get("https://api.ipify.org?format=json");
  console.log("🌐 IP pública de la aplicación:", data.ip);
} catch (err) {
  console.error("Error al obtener IP:", err.message);
}

// Iniciar servidor
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

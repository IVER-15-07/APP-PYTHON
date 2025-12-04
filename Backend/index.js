import dotenv from "dotenv";
import axios from "axios";
import app from "./src/app.js";

dotenv.config();
const PORT = process.env.PORT || 3000;



console.log("--- DEBUG DATABASE_URL ---");
const url = process.env.DATABASE_URL;
if (!url) {
    console.log("La variable está VACÍA o UNDEFINED");
} else {
    // Solo mostramos los primeros 10 caracteres por seguridad
    console.log("Valor recibido:", url.substring(0, 15) + "...");
    console.log("¿Empieza con comillas?:", url.startsWith('"') ? "SÍ (ERROR)" : "NO");
    console.log("¿Empieza con espacio?:", url.startsWith(' ') ? "SÍ (ERROR)" : "NO");
}
console.log("--------------------------");



app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);

  // 2. Tareas secundarias (Logs, chequeo de IP, conexión a DB logs, etc.)
  // Esto ya no bloquea el arranque
  axios.get("https://api.ipify.org?format=json")
    .then(({ data }) => console.log("🌐 IP pública de la aplicación:", data.ip))
    .catch((err) => console.error("Error al obtener IP (no crítico):", err.message));
});
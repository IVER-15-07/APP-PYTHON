import dotenv from "dotenv";
import axios from "axios";
import app from "./src/app.js";

dotenv.config();
const PORT = process.env.PORT || 3000;



app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);

  axios.get("https://api.ipify.org?format=json")
    .then(({ data }) => console.log("🌐 IP pública de la aplicación:", data.ip))
    .catch((err) => console.error("Error al obtener IP (no crítico):", err.message));
});
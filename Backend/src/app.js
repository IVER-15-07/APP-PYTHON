import express from "express";
import cors from "cors";
import responseTime from "response-time";
import endPoints from "./api/endPoints.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(responseTime());

// Configuración de CORS simple
app.use(cors({
  origin: "http://localhost:5173", // Ojo: En producción esto bloqueará otros dominios
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));

// --- LÍNEA BORRADA AQUÍ (app.use(cors);) ---
// Esa línea era la que causaba el error de Healthcheck.

app.use("/api", endPoints);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

export default app;

import express from "express";
import cors from "cors";
import responseTime from "response-time";
import endPoints from "./api/endPoints.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(responseTime());
/*app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));*/

const corsOptions = {
  origin: [
    "http://localhost:5173",      // Vite dev local
    "http://localhost:3000",      // Frontend local
    "http://frontend:3000",       // Frontend desde Docker
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "https://app-frontend-service-41ih.onrender.com",
    "http://app-frontend-service-41ih.onrender.com"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

// Rutas
app.use("/api", endPoints);

// Health check endpoint (para Docker healthcheck)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

export default app;
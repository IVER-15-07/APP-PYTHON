
import express from "express";
import cors from "cors";
import responseTime from "response-time";
import endPoints from "./api/endPoints.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(responseTime());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));

// Routes
app.use("/api", endPoints);
// Preparacion para el deploy en fly.io
export default app;
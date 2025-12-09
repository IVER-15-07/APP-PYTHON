import express from "express";
import cors from "cors";
import responseTime from "response-time";
import endPoints from "./api/endPoints.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(responseTime());


const FRONTEND_URL = process.env.FRONTEND_URL;
app.use(cors({
  origin: FRONTEND_URL  , 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));

app.use("/api", endPoints);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

export default app;

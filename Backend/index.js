import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import endPoints from "./src/api/endPoints.js";
import axios from "axios";
import responseTime from 'response-time'

await axios.get('https://api.ipify.org?format=json')
  .then(response => {
    console.log('IP pública de la aplicación:', response.data.ip);
  })
  .catch(error => {
    console.error('Error al obtener la IP:', error);
  });


dotenv.config();
const PORT = 3000;
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(responseTime())


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods : ['GET', 'POST', 'PUT', 'DELETE']
}));


app.use("/api", endPoints);
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));


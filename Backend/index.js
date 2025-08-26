import express from 'express'
//import libroRoutes from "./routes/libro.routes.js"
import cors from 'cors';
import route from './src/api/endPoints.js'
import responseTime from 'response-time'
import axios from 'axios'

await axios.get('https://api.ipify.org?format=json')
  .then(response => {
    console.log('IP pública de la aplicación:', response.data.ip);
  })
  .catch(error => {
    console.error('Error al obtener la IP:', error);
  });

const PORT = 3000;
const app = express()
app.use(responseTime())
app.use(express.json())
//app.use(libroRoutes);

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods : ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use('/', route);

app.listen(PORT);
console.log("Server on port", PORT);

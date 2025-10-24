
import { Routes, Route } from 'react-router-dom'
import Home from './page/Home'
import Login from './page/Login'
import VentanaProfesor from './layout/VentanaProfesor'
import VentanaEstudiante from './layout/VentanaEstudiante'
import VentanaPublica from './layout/VentanaPublica'
import ProtectedRoute from './page/ProtectedRoute'
import Register from './page/Register'

function App() {
  return (
    <>
      <Routes>
        {/* Ruta de login */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas públicas */}
        <Route path="/" element={<VentanaPublica />}>
          <Route index element={<Home />} />
        </Route>

        {/* Rutas protegidas - estudiantes */}
        <Route
          path="/estudiante/*"
          element={
            <ProtectedRoute>
              <VentanaEstudiante />
            </ProtectedRoute>
          }
        />

        {/* Rutas protegidas - profesor */}
        <Route
          path="/profesor/*"
          element={
            <ProtectedRoute>
              <VentanaProfesor />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App
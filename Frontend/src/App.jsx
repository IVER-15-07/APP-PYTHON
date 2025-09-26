
import { Routes, Route } from 'react-router-dom'
import Home from './page/Home'
import VentanaProfesor from './layout/VentanaProfesor'
import VentanaEstudiante from './layout/VentanaEstudiante'

function App() {
  return (
    <>
      <Routes>

        {/* rurta publica */}
        <Route path="/" element={<Home />}>


          {/* rutas estudiantes */}
          <Route path="Estudiante" element={<VentanaEstudiante />}>

          </Route>


          {/* rutas profesor */}
          <Route path="Profesor" element={<VentanaProfesor />}>


          </Route>

        </Route>











      </Routes>
    </>
  )
}

export default App

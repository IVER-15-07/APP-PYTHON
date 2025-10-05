
import { Routes, Route } from 'react-router-dom';
import Navbar from '../componentes/Navbar.jsx';
import Dashboard from '../page/estudiante/Dashboard.jsx';

const VentanaEstudiante = () => {
  return (
    <div className="bg-slate-950 text-slate-200 min-h-screen">
      <Navbar />
      
      <div className="bg-slate-900 border-b border-slate-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <h1 className="text-2xl font-bold text-emerald-400">Panel de Estudiante</h1>
          </div>
        </div>
      </div>
      
      <main>
        <Routes>
          <Route index element={<Dashboard />} />
          {/* Aquí puedes agregar más rutas cuando las necesites */}
        </Routes>
      </main>
    </div>
  )
}

export default VentanaEstudiante

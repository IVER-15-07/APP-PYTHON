import { useState } from "react"
import { Navigate } from "react-router-dom"
import { NavLink } from 'react-router-dom'

Navigate

const Navbar = () => {
    const [desplegable, setDesplegable] = useState(false)



    return (
        <header className="bg-slate-900 border-b border-slate-800 text-slate-200">
            <div className="mx-auto max-w-7xl h-14 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                {/* Marca */}
                <div className="flex items-center gap-2">
                    <span className="text-white font-extrabold tracking-wide">PyLearn</span>
                    <span className="text-xs text-slate-400 hidden sm:inline">Aprende Python</span>
                </div>

                {/* Menú */}
                <nav>
                    <ul className="flex items-center gap-6">
                        <NavLink
                            to="/"
                            end
                            className="text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-1.5 rounded-lg"
                        >
                            Inicio
                        </NavLink>
                        <li>
                            <a href="/acerca" className="text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-1.5 rounded-lg">
                                Acerca de
                            </a>
                        </li>
                        <li>
                            <a href="/contacto" className="text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-1.5 rounded-lg">
                                Contacto
                            </a>
                        </li>
                    </ul>
                </nav>

                {/* Acción */}
                <div className="flex items-center gap-2">
                    <div className="relative" >
                        <button
                            onClick={() => setDesplegable(d => !d)}
                            className="text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-xl shadow flex items-center gap-1"
                            aria-haspopup="menu"
                            aria-expanded={desplegable}
                        >
                            Acceder
                        </button>

                        <div
                            className={`absolute right-0 mt-2 w-44 bg-slate-800 border border-slate-700 rounded-lg shadow-lg py-1 ${desplegable ? "block" : "hidden"}`}
                        >
                            <NavLink
                                to="/estudiante"
                                onClick={() => setDesplegable(false)}
                                className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-700"
                            >
                                Estudiante
                            </NavLink>
                            <NavLink
                                to="/profesor"
                                onClick={() => setDesplegable(false)}
                                className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-700"
                            >
                                Profesor
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar

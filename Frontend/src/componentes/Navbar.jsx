import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { NavLink } from 'react-router-dom'

const Navbar = () => {
    const [desplegable, setDesplegable] = useState(false)
    const navigate = useNavigate();

    const handleRoleNavigation = (role) => {
        setDesplegable(false);
        navigate(`/login?rol=${role.toLowerCase()}`);
    }

    return (
        <header className="bg-slate-900 border-b border-slate-800 text-slate-200">
            <div className="mx-auto max-w-7xl h-14 px-4 sm:px-6 lg:px-8 flex items-center justify-between">

                <div className="flex items-center gap-2">
                    <span className="text-white font-extrabold tracking-wide">PyLearn</span>
                    <span className="text-xs text-slate-400 hidden sm:inline">Aprende Python</span>
                </div>

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

                        <div className={`absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg py-1 ${desplegable ? "block" : "hidden"}`}>

                            <button
                                onClick={() => handleRoleNavigation('estudiante')}
                                className="w-full text-left block px-4 py-3 text-sm text-slate-200 hover:bg-slate-700 border-b border-slate-700"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-lg">🎓</span>
                                    <div>
                                        <div className="font-medium">Estudiante</div>
                                        <div className="text-xs text-slate-400">Quiero aprender</div>
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => handleRoleNavigation('profesor')}
                                className="w-full text-left block px-4 py-3 text-sm text-slate-200 hover:bg-slate-700"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-lg">👨‍🏫</span>
                                    <div>
                                        <div className="font-medium">Profesor</div>
                                        <div className="text-xs text-slate-400">Quiero enseñar</div>
                                    </div>
                                </div>
                            </button>

                            <div className="border-t border-slate-700 my-1"></div>

                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar

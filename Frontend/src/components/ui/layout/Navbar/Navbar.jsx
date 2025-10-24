import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { NavLink } from 'react-router-dom'
import { Code2} from 'lucide-react'

const Navbar = () => {
    const [desplegable, setDesplegable] = useState(false)
    const navigate = useNavigate();

    const handleRoleNavigation = (role) => {
        setDesplegable(false);
        navigate(`/login?rol=${role.toLowerCase()}`);
    }

    return (
        <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 text-slate-200 shadow-xl sticky top-0 z-50">
            <div className="mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">

                <div className="flex items-center gap-3">
                    <div className="text-green-400 bg-green-500/10 p-2 rounded-lg border border-green-500/30 shadow-lg shadow-green-500/20">
                        <Code2 className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-green-400 font-bold text-xl tracking-tight">PyLearn</span>
                        <span className="text-slate-400 text-xs ml-2 hidden sm:inline">Aprende Python</span>
                    </div>
                </div>

                <nav className="hidden md:block">
                    <ul className="flex items-center gap-2">
                        <li>
                            <NavLink
                                to="/"
                                end
                                className={({ isActive }) =>
                                    `text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 ${
                                        isActive
                                            ? "bg-gradient-to-r from-green-500/20 to-cyan-500/20 text-green-400 border border-green-400/40"
                                            : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                                    }`
                                }
                            >
                                Inicio
                            </NavLink>
                        </li>
                        <li>
                            <a href="/acerca" className="text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700/50 px-4 py-2 rounded-lg transition-all duration-200">
                                Acerca de
                            </a>
                        </li>
                        <li>
                            <a href="/contacto" className="text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700/50 px-4 py-2 rounded-lg transition-all duration-200">
                                Contacto
                            </a>
                        </li>
                    </ul>
                </nav>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <button
                            onClick={() => setDesplegable(d => !d)}
                            className="text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all duration-200 border border-emerald-400/30"
                            aria-haspopup="menu"
                            aria-expanded={desplegable}
                        >
                            Acceder
                           </button>

                        <div className={`absolute right-0 mt-2 w-52 bg-slate-800 border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden transition-all duration-200 ${desplegable ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}`}>

                            <button
                                onClick={() => handleRoleNavigation('estudiante')}
                                className="w-full text-left block px-4 py-3.5 text-sm text-slate-200 hover:bg-gradient-to-r hover:from-green-500/10 hover:to-cyan-500/10 border-b border-slate-700/50 transition-all duration-200 group"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl group-hover:scale-110 transition-transform duration-200">🎓</span>
                                    <div>
                                        <div className="font-semibold text-white">Estudiante</div>
                                        <div className="text-xs text-slate-400">Quiero aprender</div>
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => handleRoleNavigation('usuario')}
                                className="w-full text-left block px-4 py-3.5 text-sm text-slate-200 hover:bg-gradient-to-r hover:from-green-500/10 hover:to-cyan-500/10 transition-all duration-200 group"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl group-hover:scale-110 transition-transform duration-200">👨‍🏫</span>
                                    <div>
                                        <div className="font-semibold text-white">Profesor</div>
                                        <div className="text-xs text-slate-400">Quiero enseñar</div>
                                    </div>
                                </div>
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar
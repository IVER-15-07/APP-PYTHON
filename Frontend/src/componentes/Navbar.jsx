

const Navbar = () => {
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
            <li>
              <a href="/" className="text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-1.5 rounded-lg">
                Inicio
              </a>
            </li>
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
        <div>
          <a
            href="/login"
            className="text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-xl shadow"
          >
            Acceder
          </a>
        </div>
      </div>
    </header>
  )
}

export default Navbar

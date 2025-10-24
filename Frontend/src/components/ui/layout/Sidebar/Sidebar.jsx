"use client"

import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import PropTypes from "prop-types"
import { ChevronLeft, ChevronRight, LogOut, Code2 } from "lucide-react"

const Sidebar = ({
  user,
  items = [],
  roleLabel = "",
  sidebarOpen: controlledOpen,
  setSidebarOpen: setControlledOpen,
  onLogout,
  brand = { icon: <Code2 className="w-6 h-6" />, name: "PyLearn" },
}) => {
  const [open, setOpen] = useState(controlledOpen ?? true)

  useEffect(() => {
    if (typeof controlledOpen === "boolean") setOpen(controlledOpen)
  }, [controlledOpen])

  const toggle = () => {
    if (typeof setControlledOpen === "function") setControlledOpen(!open)
    else setOpen((s) => !s)
  }

  return (
    <aside
      className={`bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 transition-all duration-300 ${open ? "w-80" : "w-20"} h-screen sticky top-0 flex-shrink-0 overflow-hidden shadow-2xl flex flex-col`}
    >
      <div className="p-5 border-b border-slate-700/50 bg-slate-900/80">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-3 ${!open && "justify-center w-full"}`}>
            <div className="text-green-400 bg-green-500/10 p-2 rounded-lg border border-green-500/30 shadow-lg shadow-green-500/20">
              {brand.icon}
            </div>
            {open && (
              <div>
                <h2 className="text-green-400 font-bold text-xl tracking-tight">{brand.name}</h2>
                <p className="text-slate-400 text-xs font-medium mt-0.5">{roleLabel}</p>
              </div>
            )}
          </div>

          {open && (
            <button
              onClick={toggle}
              className="text-slate-400 hover:text-green-400 hover:bg-slate-700/40 p-2 rounded-lg transition-all duration-200"
              aria-label="Colapsar sidebar"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
        </div>

        {!open && (
          <button
            onClick={toggle}
            className="mt-3 w-full text-slate-400 hover:text-green-400 hover:bg-slate-700/40 p-2 rounded-lg transition-all duration-200 flex justify-center"
            aria-label="Expandir sidebar"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {open && user && (
        <div className="p-5 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-700/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg ring-2 ring-green-400/30">
              {user.nombre?.charAt(0).toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold truncate text-base">{user.nombre}</p>
              <p className="text-slate-400 text-sm truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      <nav className="p-4 space-y-1.5 overflow-y-auto flex-1">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-green-500/20 to-cyan-500/20 text-green-400 border border-green-400/40 shadow-lg shadow-green-500/10"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50 hover:border hover:border-slate-600/50"
              } ${!open && "justify-center"}`
            }
            title={!open ? item.label : undefined}
          >
            <span className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110">{item.icon}</span>
            {open && <span className="font-medium text-base">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700/50 bg-slate-900/80 mt-auto">
        <button
          onClick={onLogout}
          className={`group w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/15 rounded-xl transition-all duration-200 border border-transparent hover:border-red-500/30 ${!open && "justify-center"}`}
          title={!open ? "Cerrar Sesión" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
          {open && <span className="font-medium text-base">Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  )
}

// Validación de PropTypes
Sidebar.propTypes = {
  user: PropTypes.shape({
    nombre: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
    role: PropTypes.string,
  }).isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      icon: PropTypes.node,
      exact: PropTypes.bool,
    }),
  ),
  roleLabel: PropTypes.string,
  sidebarOpen: PropTypes.bool,
  setSidebarOpen: PropTypes.func,
  onLogout: PropTypes.func.isRequired,
  brand: PropTypes.shape({
    icon: PropTypes.node,
    name: PropTypes.string,
  }),
}

export default Sidebar
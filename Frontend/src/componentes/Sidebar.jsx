import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({
  user,
  items = [],
  roleLabel = "",
  sidebarOpen: controlledOpen,
  setSidebarOpen: setControlledOpen,
  onLogout,
  brand = { icon: "📚", name: "PyLearn" },
}) => {
  const [open, setOpen] = useState(controlledOpen ?? true);

  useEffect(() => {
    if (typeof controlledOpen === "boolean") setOpen(controlledOpen);
  }, [controlledOpen]);

  const toggle = () => {
    if (typeof setControlledOpen === "function") setControlledOpen(!open);
    else setOpen((s) => !s);
  };

  return (
    <aside className={`bg-slate-900 border-r border-slate-800 transition-all duration-300 ${open ? 'w-64' : 'w-16'} h-screen sticky top-0 flex-shrink-0 overflow-hidden`}>
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-3 ${!open && 'justify-center'}`}>
            <span className="text-2xl">{brand.icon}</span>
            {open && (
              <div>
                <h2 className="text-emerald-400 font-bold text-lg">{brand.name}</h2>
                <p className="text-slate-400 text-xs">{roleLabel}</p>
              </div>
            )}
          </div>

          <button onClick={toggle} className="text-slate-400 hover:text-white p-1 rounded">
            {open ? '◀' : '▶'}
          </button>
        </div>
      </div>

      {open && user && (
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
              {user.nombre?.charAt(0).toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-200 font-medium truncate">{user.nombre}</p>
              <p className="text-slate-400 text-sm truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      <nav className="p-4 space-y-2">
        {items.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
              } ${!open && 'justify-center'}`
            }
          >
            <span className="text-xl">{item.icon}</span>
            {open && <span className="font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors ${!open && 'justify-center'}`}
        >
          <span className="text-xl">🚪</span>
          {open && <span className="font-medium">Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
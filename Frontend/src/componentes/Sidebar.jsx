
import { NavLink } from "react-router-dom";

const Sidebar = ({ open, user, items = [], onToggle, onLogout }) => {
  return (
    <aside className={`bg-slate-900 border-r border-slate-800 transition-all duration-300 ${open ? 'w-64' : 'w-16'} h-screen sticky top-0`}>
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className={`flex items-center gap-3 ${!open && 'justify-center'}`}>
          <span className="text-2xl">👨‍🏫</span>
          {open && <div><h2 className="text-blue-400 font-bold">PyLearn</h2><p className="text-slate-400 text-xs">{user?.rol?.nombre ?? ''}</p></div>}
        </div>
        <button onClick={onToggle} className="text-slate-400 p-1 rounded">{open ? '◀' : '▶'}</button>
      </div>

      {open && user && (
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {user?.nombre?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-200 font-medium truncate">{user?.nombre}</p>
              <p className="text-slate-400 text-sm truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      )}

      <nav className="p-4 space-y-2">
        {items.map(item => (
          <NavLink key={item.path} to={item.path} className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive ? 'bg-blue-500/20 text-blue-400' : 'text-slate-300 hover:text-white hover:bg-slate-800'} ${!open && 'justify-center'}`}>
            <span className="text-xl">{item.icon}</span>
            {open && <span className="font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <button onClick={onLogout} className={`w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-2 rounded-lg ${!open && 'justify-center'}`}>🚪 {open && 'Cerrar Sesión'}</button>
      </div>
    </aside>
  );
};

export default Sidebar;
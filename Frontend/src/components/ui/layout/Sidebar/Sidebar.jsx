import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from 'prop-types';

// Importar iconos de Lucide (puedes instalar con: npm install lucide-react)
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  LogOut, 
  Home, 
  Settings, 
  User, 
  BarChart3,
  FileText,
  HelpCircle
} from "lucide-react";

const Sidebar = ({
  user,
  items = [],
  roleLabel = "",
  sidebarOpen: controlledOpen,
  setSidebarOpen: setControlledOpen,
  onLogout,
  brand = { icon: <BookOpen size={24} />, name: "PyLearn" },
}) => {
  const [open, setOpen] = useState(controlledOpen ?? true);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    if (typeof controlledOpen === "boolean") setOpen(controlledOpen);
  }, [controlledOpen]);

  const toggle = () => {
    if (typeof setControlledOpen === "function") setControlledOpen(!open);
    else setOpen((s) => !s);
  };

  // Mapeo de iconos por tipo (puedes personalizar según tus necesidades)
  const getIcon = (iconType, size = 20) => {
    const iconProps = { size, className: "flex-shrink-0" };
    
    const iconMap = {
      home: <Home {...iconProps} />,
      settings: <Settings {...iconProps} />,
      user: <User {...iconProps} />,
      chart: <BarChart3 {...iconProps} />,
      document: <FileText {...iconProps} />,
      help: <HelpCircle {...iconProps} />,
      default: <BookOpen {...iconProps} />
    };

    return iconMap[iconType] || iconMap.default;
  };

  return (
    <aside 
      className={`
        bg-gradient-to-b from-slate-900 to-slate-800 
        border-r border-slate-700 
        transition-all duration-300 ease-in-out
        ${open ? 'w-64' : 'w-16'} 
        h-screen sticky top-0 flex-shrink-0 overflow-hidden
        shadow-xl shadow-blue-900/20
      `}
    >
      {/* Header con brand */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-3 ${!open && 'justify-center'}`}>
            <div className="text-blue-400 transform transition-transform duration-300 hover:scale-110">
              {brand.icon}
            </div>
            {open && (
              <div className="transform transition-all duration-300 ease-out">
                <h2 className="text-blue-400 font-bold text-lg tracking-tight">{brand.name}</h2>
                <p className="text-slate-400 text-xs mt-0.5">{roleLabel}</p>
              </div>
            )}
          </div>

          <button 
            onClick={toggle} 
            className="
              text-slate-400 hover:text-yellow-400 
              p-1.5 rounded-lg transition-all duration-200
              hover:bg-slate-700/50 hover:scale-105
              backdrop-blur-sm
            "
          >
            {open ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      </div>

      {/* Sección de usuario */}
      {open && user && (
        <div className="p-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3 transform transition-all duration-300">
            <div className="
              w-10 h-10 
              bg-gradient-to-br from-blue-500 to-yellow-400 
              rounded-full flex items-center justify-center 
              text-white font-bold text-sm
              ring-2 ring-blue-400/20
              shadow-lg shadow-blue-500/30
              transform transition-transform duration-200 hover:scale-105
            ">
              {user.nombre?.charAt(0).toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 min-w-0 transform transition-all duration-300">
              <p className="text-slate-200 font-medium truncate text-sm">{user.nombre}</p>
              <p className="text-slate-400 text-xs truncate mt-0.5">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navegación */}
      <nav className="p-4 space-y-1">
        {items.map((item, index) => (
          <div 
            key={item.path}
            className="relative"
            onMouseEnter={() => setHoveredItem(index)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <NavLink
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `
                flex items-center gap-3 px-3 py-2.5 rounded-lg 
                transition-all duration-200 ease-out
                transform hover:scale-105 hover:translate-x-1
                backdrop-blur-sm
                ${isActive
                  ? 'bg-blue-500/20 text-blue-400 border-l-4 border-l-yellow-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }
                ${!open && 'justify-center'}
                relative
                `
              }
            >
              {/* Barra lateral activa */}
              {({ isActive }) => isActive && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-yellow-400 rounded-r-full shadow-lg shadow-yellow-400/50" />
              )}
              
              <span className="text-slate-300 transition-colors duration-200 group-hover:text-white">
                {item.iconType ? getIcon(item.iconType) : item.icon}
              </span>
              
              {open && (
                <span className="font-medium text-sm transition-all duration-300">
                  {item.label}
                </span>
              )}
            </NavLink>

            {/* Tooltip para modo colapsado */}
            {!open && hoveredItem === index && (
              <div className="
                absolute left-full ml-2 top-1/2 transform -translate-y-1/2
                bg-slate-800 text-white text-xs py-1.5 px-2.5 rounded-md
                whitespace-nowrap z-50
                shadow-lg shadow-black/50
                backdrop-blur-sm
                border border-slate-600
                animate-in fade-in-0 zoom-in-95
              ">
                {item.label}
                {/* Flecha del tooltip */}
                <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-slate-800" />
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Botón de cerrar sesión */}
      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={onLogout}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 
            text-red-400 hover:text-red-300 
            rounded-lg transition-all duration-200
            transform hover:scale-105
            hover:bg-red-500/10 
            backdrop-blur-sm
            border border-transparent hover:border-red-500/20
            ${!open && 'justify-center'}
          `}
        >
          <LogOut size={20} className="flex-shrink-0" />
          {open && <span className="font-medium text-sm">Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
};

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
      exact: PropTypes.bool,
      icon: PropTypes.node,
      iconType: PropTypes.oneOf(['home', 'settings', 'user', 'chart', 'document', 'help']),
    })
  ),
  roleLabel: PropTypes.string,
  sidebarOpen: PropTypes.bool,
  setSidebarOpen: PropTypes.func,
  onLogout: PropTypes.func.isRequired,
  brand: PropTypes.shape({
    icon: PropTypes.node,
    name: PropTypes.string,
  }),
};

export default Sidebar;
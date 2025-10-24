import { Link } from "react-router-dom"
import PropTypes from "prop-types"

const BotonLink = ({ to, children, variant = "primary", size = "md", className = "" }) => {
  // Estilos base
  const baseClasses = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200"
  
  // Variantes de estilo
  const variantClasses = {
    primary: "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white border border-emerald-400/30 shadow-lg shadow-emerald-500/25",
    
    secondary: "bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 border border-slate-600/50 hover:border-slate-500/50",
    
    outline: "bg-transparent hover:bg-slate-700/30 text-slate-300 hover:text-white border border-slate-700/50 hover:border-green-500/50",
  }
  
  // Tamaños
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  }
  
  const classes = `${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${sizeClasses[size] || sizeClasses.md} ${className}`
  
  return (
    <Link to={to} className={classes}>
      {children}
    </Link>
  )
}

BotonLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary", "outline"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  className: PropTypes.string,
}

export default BotonLink

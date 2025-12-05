import { Link } from "react-router-dom"
import PropTypes from "prop-types"

const BotonLink = ({ to, children, variant = "primary", size = "md", className = "" }) => {
  // Estilos base
  const baseClasses = "inline-flex items-center justify-center gap-2 rounded-button transition-all duration-normal"
  
  // Variantes de estilo
  const variantClasses = {
    primary: "bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-text-primary border border-border-accent shadow-theme-button",
    
    secondary: "bg-bg-tertiary hover:bg-bg-card-hover text-text-secondary border border-border-primary hover:border-border-accent",
    
    outline: "bg-transparent hover:bg-bg-tertiary text-text-secondary hover:text-text-primary border border-border-secondary hover:border-primary",
  }
  
  // Tamaños
  const sizeClasses = {
    sm: "px-3 py-1.5 text-btn-sm",
    md: "px-5 py-2.5 text-btn-base",
    lg: "px-6 py-3 text-btn-lg",
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

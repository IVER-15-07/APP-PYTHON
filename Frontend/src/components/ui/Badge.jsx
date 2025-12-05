import PropTypes from 'prop-types';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

/**
 * Componente Badge/Chip reutilizable
 * @param {string} variant - success | error | warning | info | neutral
 * @param {string} size - sm | md | lg
 * @param {node} icon - Icono opcional
 * @param {node} children - Contenido del badge
 */
const Badge = ({ variant = 'neutral', size = 'md', icon, children, className = '' }) => {
  const baseClasses = "inline-flex items-center gap-2 rounded-chip font-medium transition-all duration-fast";
  
  const variantClasses = {
    success: "bg-success/10 border border-success/30 text-success",
    error: "bg-error/10 border border-error-border text-error",
    warning: "bg-warning/10 border border-warning/30 text-warning",
    info: "bg-primary/10 border border-primary/30 text-primary",
    neutral: "bg-bg-tertiary border border-border-primary text-text-secondary",
  };
  
  const sizeClasses = {
    sm: "px-2 py-0.5 text-text-xs",
    md: "px-3 py-1 text-text-sm",
    lg: "px-4 py-2 text-text-base",
  };
  
  const defaultIcons = {
    success: <CheckCircle className="w-4 h-4" />,
    error: <AlertCircle className="w-4 h-4" />,
    warning: <AlertTriangle className="w-4 h-4" />,
    info: <Info className="w-4 h-4" />,
  };
  
  const displayIcon = icon || (variant !== 'neutral' && defaultIcons[variant]);
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {displayIcon}
      {children}
    </span>
  );
};

Badge.propTypes = {
  variant: PropTypes.oneOf(['success', 'error', 'warning', 'info', 'neutral']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  icon: PropTypes.node,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Badge;
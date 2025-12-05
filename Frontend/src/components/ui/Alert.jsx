import PropTypes from 'prop-types';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

/**
 * Componente Alert reutilizable
 * @param {string} variant - success | error | warning | info
 * @param {string} title - Título opcional
 * @param {node} children - Contenido del alert
 * @param {function} onClose - Función para cerrar el alert
 * @param {boolean} dismissible - Si se puede cerrar
 */
const Alert = ({ 
  variant = 'info', 
  title, 
  children, 
  onClose, 
  dismissible = false,
  className = '' 
}) => {
  const baseClasses = "flex items-start gap-3 rounded-input p-4 border transition-all duration-normal";
  
  const variantClasses = {
    success: "bg-success/10 border-success/30 text-success",
    error: "bg-error-bg border-error-border text-error",
    warning: "bg-warning/10 border-warning/30 text-warning",
    info: "bg-primary/10 border-primary/30 text-primary",
  };
  
  const icons = {
    success: <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />,
    error: <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />,
    info: <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />,
  };
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {icons[variant]}
      <div className="flex-1">
        {title && <div className="text-btn-base mb-1">{title}</div>}
        <div className="text-text-sm">{children}</div>
      </div>
      {dismissible && onClose && (
        <button
          onClick={onClose}
          className="text-current hover:opacity-70 transition-opacity p-1"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

Alert.propTypes = {
  variant: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func,
  dismissible: PropTypes.bool,
  className: PropTypes.string,
};

export default Alert;
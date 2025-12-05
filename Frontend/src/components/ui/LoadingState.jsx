import PropTypes from 'prop-types';

/**
 * Componente LoadingState reutilizable
 * @param {string} message - Mensaje opcional
 * @param {string} size - sm | md | lg
 */
const LoadingState = ({ message = 'Cargando...', size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  };
  
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-8 ${className}`}>
      <div className={`${sizeClasses[size]} border-primary/30 border-t-primary rounded-full animate-spin`} />
      {message && <p className="text-text-base text-text-secondary">{message}</p>}
    </div>
  );
};

LoadingState.propTypes = {
  message: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

export default LoadingState;
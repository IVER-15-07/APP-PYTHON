import PropTypes from 'prop-types';

const EmptyState = ({ icon, title, description, action, className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      {icon && (
        <div className="text-text-muted mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-display-sm text-text-primary mb-2">{title}</h3>
      {description && (
        <p className="text-text-base text-text-secondary max-w-md mb-6">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  action: PropTypes.node,
  className: PropTypes.string,
};

export default EmptyState;
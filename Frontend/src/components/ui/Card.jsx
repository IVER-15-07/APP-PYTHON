import PropTypes from 'prop-types';

/**
 * StatsCard component for displaying data with stats, metrics, or information
 * Refactored from inline styles to Tailwind classes
 * 
 * @param {string} title - Optional card title
 * @param {string|number|node} value - Main value to display (required)
 * @param {string} subtitle - Optional subtitle text
 * @param {node} icon - Optional icon element
 * @param {string} variant - Card variant style (default, success, warning, info)
 * @param {node} footer - Optional footer content
 * @param {function} onClick - Optional click handler
 * @param {string} className - Additional CSS classes
 */
const Card = ({
  title,
  value,
  subtitle,
  icon,
  variant = "default",
  footer,
  onClick,
  className = "",
}) => {
  const variantClasses = {
    default: "border-white/[0.04]",
    success: "border-green-500/12",
    warning: "border-yellow-400/12",
    info: "border-blue-500/12",
  };

  return (
    <div
      className={`
        bg-[#061428] p-4 rounded-lg min-w-[160px]
        shadow-[0_1px_0_rgba(255,255,255,0.02)]
        flex flex-col gap-2
        border ${variantClasses[variant]}
        ${onClick ? "cursor-pointer hover:bg-slate-800/50 transition-colors" : ""}
        ${className}
      `}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {icon && <div className="text-xl text-slate-400">{icon}</div>}
        <div className="flex-1 min-w-0">
          {title && <div className="text-xs text-slate-400">{title}</div>}
          <div className="text-[22px] text-slate-100 font-semibold">{value}</div>
          {subtitle && <div className="text-xs text-slate-400">{subtitle}</div>}
        </div>
      </div>

      {footer && <div className="mt-2 text-xs text-slate-400">{footer}</div>}
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.node,
  ]).isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'success', 'warning', 'info']),
  footer: PropTypes.node,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Card;

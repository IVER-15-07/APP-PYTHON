import PropTypes from 'prop-types';

/**
 * Button component with multiple variants and sizes
 * 
 * @param {node} children - Button content
 * @param {string} className - Additional CSS classes
 * @param {function} onClick - Click handler
 * @param {string} type - Button type (button, submit, reset)
 * @param {string} variant - Button variant (default, approve, reject, secondary)
 * @param {string} size - Button size (sm, md, lg)
 * @param {boolean} disabled - Whether button is disabled
 */
const Button = ({
    children,
    className = "",
    onClick,
    type = "button",
    variant = "default",
    size = "md",
    disabled = false,
    ...rest
}) => {
    const baseClasses = "inline-flex items-center justify-center gap-2 rounded-button transition-all duration-fast";
    
    const variantClasses = {
        default: "bg-transparent text-text-primary border border-border-secondary hover:bg-bg-tertiary",
        approve: "bg-success text-white border-0 hover:bg-success/90",
        reject: "bg-error text-white border-0 hover:bg-error/90",
        secondary: "bg-bg-tertiary text-text-primary border border-border-primary hover:bg-bg-card-hover",
    };
    
    const sizeClasses = {
        sm: "px-2 py-1 text-btn-sm",
        md: "px-2.5 py-1.5 text-btn-base",
        lg: "px-3.5 py-2.5 text-btn-lg",
    };
    
    const disabledClasses = disabled ? "opacity-65 cursor-not-allowed" : "cursor-pointer";
    
    const classes = `${baseClasses} ${variantClasses[variant] || variantClasses.default} ${sizeClasses[size] || sizeClasses.md} ${disabledClasses} ${className}`;

    return (
        <button
            type={type}
            onClick={disabled ? undefined : onClick}
            className={classes}
            disabled={disabled}
            {...rest}
        >
            {children}
        </button>
    );
};

Button.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    onClick: PropTypes.func,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    variant: PropTypes.oneOf(['default', 'approve', 'reject', 'secondary']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    disabled: PropTypes.bool,
};

export default Button;

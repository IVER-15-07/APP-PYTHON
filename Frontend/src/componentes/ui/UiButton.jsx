import PropTypes from 'prop-types';
/**
 * Props:
 * - variant: 'default' | 'approve' | 'reject' | 'secondary'
 * - size: 'sm' | 'md' | 'lg'
 * - disabled: boolean
 * - onClick, className, children, type
 */
const VARIANT_STYLES = {
  default: {
    background: "transparent",
    color: "#e6eef8",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  approve: {
    background: "#16a34a",
    color: "#fff",
    border: "none",
  },
  reject: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
  },
  secondary: {
    background: "#334155",
    color: "#e6eef8",
    border: "1px solid rgba(255,255,255,0.04)",
  },
};

const SIZE_STYLES = {
  sm: { padding: "4px 8px", fontSize: 13 },
  md: { padding: "6px 10px", fontSize: 14 },
  lg: { padding: "10px 14px", fontSize: 16 },
};

const UiButton = ({
  children,
  className = "",
  onClick,
  type = "button",
  variant = "default",
  size = "md",
  disabled = false,
  style = {},
  ...rest
}) => {
  const variantStyle = VARIANT_STYLES[variant] || VARIANT_STYLES.default;
  const sizeStyle = SIZE_STYLES[size] || SIZE_STYLES.md;

  const baseStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 8,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.65 : 1,
    transition: "all 150ms ease",
    ...variantStyle,
    ...sizeStyle,
    ...style,
  };

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      className={`transition ${className}`}
      style={baseStyle}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};
// Validación de PropTypes
UiButton.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf([
    'default',
    'primary',
    'secondary',
    'success',
    'warning',
    'danger',
    'info',
    'outline'
  ]),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  disabled: PropTypes.bool,
  style: PropTypes.object,
};
export default UiButton;

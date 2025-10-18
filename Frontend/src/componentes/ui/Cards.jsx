

/**
 * Props:
 * - title: string
 * - value: string | node
 * - subtitle: string (opcional)
 * - icon: node (opcional)
 * - variant: 'default' | 'success' | 'warning' | 'info' (opcional)
 * - footer: node (opcional)
 * - onClick: function (opcional)
 * - className: string (opcional)
 */
const VARIANT_STYLES = {
  default: { border: "1px solid rgba(255,255,255,0.04)" },
  success: { border: "1px solid rgba(34,197,94,0.12)" },
  warning: { border: "1px solid rgba(250,204,21,0.12)" },
  info: { border: "1px solid rgba(59,130,246,0.12)" },
};

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
  const base = {
    background: "#061428",
    padding: 16,
    borderRadius: 10,
    minWidth: 160,
    boxShadow: "0 1px 0 rgba(255,255,255,0.02)",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    cursor: onClick ? "pointer" : "default",
    ...VARIANT_STYLES[variant],
  };

  const titleStyle = { fontSize: 12, color: "#9aa6b2" };
  const valueStyle = { fontSize: 22, color: "#e6eef8", fontWeight: 600 };
  const subtitleStyle = { fontSize: 12, color: "#9fb4c9" };
  const footerStyle = { marginTop: 8, fontSize: 12, color: "#9aa6b2" };

  return (
    <div style={base} className={className} onClick={onClick}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {icon && <div style={{ fontSize: 20, color: "#9fb4c9" }}>{icon}</div>}
        <div style={{ flex: 1, minWidth: 0 }}>
          {title && <div style={titleStyle}>{title}</div>}
          <div style={valueStyle}>{value}</div>
          {subtitle && <div style={subtitleStyle}>{subtitle}</div>}
        </div>
      </div>

      {footer && <div style={footerStyle}>{footer}</div>}
    </div>
  );
};

export default Card;
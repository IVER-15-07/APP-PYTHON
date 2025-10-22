import { Link } from "react-router-dom"
import PropTypes from "prop-types"

const BotonLink = ({ to, children, variant = "primary" }) => {
  const base = "inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold"
  const variants = {
    primary: `${base} bg-emerald-500 hover:bg-emerald-600 text-white shadow`,
    secondary: `${base} border border-slate-700 hover:bg-slate-900 text-slate-200`,
  }
  return <Link to={to} className={variants[variant]}>{children}</Link>
}
BotonLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary"]),
}
export default BotonLink

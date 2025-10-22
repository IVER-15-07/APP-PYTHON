import PropTypes from "prop-types"

/**
 * Botón estilizado para social login. Recibe un icono (JSX) y texto.
 */
const SocialButton = ({ onClick, icon, children, loading, ariaLabel }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={ariaLabel}
    className="w-full py-4 bg-white text-gray-700 font-medium rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300/50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 mb-6"
    disabled={loading}
  >
    {loading ? (
      <div className="w-5 h-5 border-2 border-gray-400/30 border-t-gray-600 rounded-full animate-spin" />
    ) : (
      icon
    )}
    <span>{children}</span>
  </button>
)

SocialButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.node,
  children: PropTypes.node.isRequired,
  loading: PropTypes.bool,
  ariaLabel: PropTypes.string,
}

export default SocialButton

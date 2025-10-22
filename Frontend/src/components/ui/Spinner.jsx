import PropTypes from "prop-types"

const Spinner = ({ className = "w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" }) => (
  <div className={className} />
)

Spinner.propTypes = {
  className: PropTypes.string,
}

export default Spinner

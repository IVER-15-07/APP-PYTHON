import PropTypes from "prop-types"

const Spinner = ({ className = "w-5 h-5 border-2 border-text-primary/30 border-t-text-primary rounded-full animate-spin" }) => (
  <div className={className} />
)

Spinner.propTypes = {
  className: PropTypes.string,
}

export default Spinner

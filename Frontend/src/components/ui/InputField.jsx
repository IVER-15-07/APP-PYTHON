import PropTypes from "prop-types"

const InputField = ({ id, name, type = "text", value, onChange, placeholder, required = false, disabled = false }) => (
  <div>
    <input
      id={id || name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className="w-full px-4 py-4 bg-bg-tertiary border border-border-primary rounded-input text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-border-accent transition-all duration-slow disabled:opacity-60"
    />
  </div>
)

InputField.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
}

export default InputField

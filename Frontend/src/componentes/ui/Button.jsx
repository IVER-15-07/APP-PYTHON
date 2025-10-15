

const UiButton = ({ children, className = "", onClick, type = "button", ...rest }) => {
  return (
    <button type={type} onClick={onClick} className={`px-3 py-2 rounded-lg transition ${className}`} {...rest}>
      {children}
    </button>
  );
};

export default UiButton;
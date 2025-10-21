import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';

const Modal = ({
  open = false,
  onClose = () => { },
  title = "",
  children,
  footer = null,
  size = "md", // sm | md | lg
  closeOnBackdrop = true,
  ariaLabel = "Modal",
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-3xl",
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      {/* Backdrop: semi-transparente + blur */}
      <div
        onClick={() => closeOnBackdrop && onClose()}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      {/* Modal container */}
      <div className={`relative w-full ${sizes[size]} mx-4`}>
        <div className="bg-slate-800 rounded-lg shadow-xl overflow-hidden border border-slate-700">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-700">
            <h3 className="text-lg font-semibold text-slate-100 truncate">{title}</h3>
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="text-slate-300 hover:text-white p-1 rounded"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="p-5 text-slate-200">
            {children}
          </div>

          {/* Footer (opcional) */}
          {footer && (
            <div className="px-5 py-3 border-t border-slate-700 bg-slate-900/30">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
// Validación de PropTypes
Modal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.node,
  footer: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  closeOnBackdrop: PropTypes.bool,
  ariaLabel: PropTypes.string,
};

export default Modal;
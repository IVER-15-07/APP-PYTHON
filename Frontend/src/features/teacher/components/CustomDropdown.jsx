import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import PropTypes from 'prop-types';

const CustomDropdown = ({ 
    label, 
    icon: Icon, 
    value, 
    onChange, 
    options, 
    placeholder, 
    required, 
    disabled,
    name 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    const handleSelect = (optionValue) => {
        onChange({ target: { name, value: optionValue } });
        setIsOpen(false);
    };

    return (
        <div ref={dropdownRef}>
            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                {Icon && <Icon className="w-4 h-4 text-green-400" />}
                {label} {required && '*'}
            </label>
            
            <div className="relative">
                <button
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                    className={`w-full text-left px-4 py-3 pr-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-800/80 text-white border border-slate-700/50 hover:border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all shadow-inner disabled:opacity-50 disabled:cursor-not-allowed ${!value ? 'text-slate-500' : ''}`}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                >
                    <div className="flex items-center gap-2">
                        {selectedOption ? (
                            <>
                                <span>{selectedOption.emoji}</span>
                                <span className="text-white">{selectedOption.label}</span>
                            </>
                        ) : (
                            <span className="text-slate-500">{placeholder}</span>
                        )}
                    </div>
                </button>

                <ChevronDown 
                    className={`w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-200 ${isOpen ? 'rotate-180 text-green-400' : ''}`} 
                />

                {/* Dropdown menu */}
                <div 
                    className={`absolute z-50 left-0 right-0 mt-2 bg-slate-800 border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden transition-all duration-200 ${
                        isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
                    }`}
                >
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => handleSelect(option.value)}
                            className={`w-full text-left block px-4 py-3.5 text-sm transition-all duration-200 group border-b border-slate-700/30 last:border-b-0 ${
                                value === option.value 
                                    ? 'bg-gradient-to-r from-green-500/20 to-cyan-500/20 text-green-400' 
                                    : 'text-slate-200 hover:bg-gradient-to-r hover:from-green-500/10 hover:to-cyan-500/10'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                                    {option.emoji}
                                </span>
                                <div>
                                    <div className={`font-semibold ${value === option.value ? 'text-green-400' : 'text-white'}`}>
                                        {option.label}
                                    </div>
                                    {option.description && (
                                        <div className="text-xs text-slate-400">{option.description}</div>
                                    )}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

CustomDropdown.propTypes = {
    label: PropTypes.string.isRequired,
    icon: PropTypes.elementType,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        emoji: PropTypes.string.isRequired,
        description: PropTypes.string,
    })).isRequired,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    name: PropTypes.string.isRequired,
};

export default CustomDropdown;

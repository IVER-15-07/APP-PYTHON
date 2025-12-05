import { Plus } from 'lucide-react';
import PropTypes from 'prop-types';

const CreateButton = ({ onClick, children, className = '' }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-6 py-3 bg-primary/10 hover:bg-primary/20 border border-primary/50 rounded-button text-text-accent text-btn-base transition-all duration-normal hover:shadow-theme-emerald ${className}`}
        >
            <Plus className="w-5 h-5" />
            {children}
        </button>
    );
};

CreateButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default CreateButton;

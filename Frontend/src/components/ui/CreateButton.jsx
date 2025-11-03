import { Plus } from 'lucide-react';
import PropTypes from 'prop-types';

const CreateButton = ({ onClick, children, className = '' }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-6 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-emerald-400 font-medium transition-all hover:shadow-lg hover:shadow-emerald-500/20 ${className}`}
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

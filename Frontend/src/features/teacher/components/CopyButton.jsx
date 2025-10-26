import { Copy, CheckCircle2 } from 'lucide-react';
import PropTypes from 'prop-types';

const CopyButton = ({ text, id, onCopy, copied }) => {
  return (
    <button
      onClick={() => onCopy(text, id)}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg text-xs font-medium border border-green-500/30 transition-all duration-200"
    >
      {copied === id ? (
        <>
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Copiado</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>Copiar</span>
        </>
      )}
    </button>
  );
};

export default CopyButton;

CopyButton.propTypes = {
  text: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onCopy: PropTypes.func.isRequired,
  copied: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

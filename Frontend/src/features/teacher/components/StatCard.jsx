import PropTypes from 'prop-types';

const StatCard = ({ label, value, variant = 'default', icon: Icon }) => {
  const variants = {
    default: 'from-green-500/10 to-cyan-500/10 border-green-500/30 text-green-400',
    primary: 'from-emerald-500/10 to-green-500/10 border-emerald-500/30 text-emerald-400',
    secondary: 'from-blue-500/10 to-cyan-500/10 border-blue-500/30 text-blue-400',
    accent: 'from-purple-500/10 to-pink-500/10 border-purple-500/30 text-purple-400',
  };

  return (
    <div className={`bg-gradient-to-r ${variants[variant]} border rounded-2xl p-6 shadow-xl`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-slate-400">{label}</p>
        {Icon && <Icon className="w-5 h-5 opacity-50" />}
      </div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
};

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'accent']),
  icon: PropTypes.elementType,
};

export default StatCard;

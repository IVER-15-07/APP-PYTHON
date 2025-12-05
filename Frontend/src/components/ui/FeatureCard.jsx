import PropTypes from "prop-types";

/**
 * Simple card component for displaying features with title and description
 * Used in marketing/landing pages
 * 
 * @param {string} titulo - Feature title
 * @param {string} descripcion - Feature description
 */
const FeatureCard = ({ titulo, descripcion }) => (
  <div className="rounded-card bg-bg-glass border border-border-secondary p-4 hover:border-border-primary transition-colors">
    <h3 className="text-btn-base text-text-primary font-semibold">{titulo}</h3>
    <p className="text-text-sm text-text-secondary mt-1">{descripcion}</p>
  </div>
);

FeatureCard.propTypes = {
  titulo: PropTypes.string.isRequired,
  descripcion: PropTypes.string.isRequired,
};

export default FeatureCard;

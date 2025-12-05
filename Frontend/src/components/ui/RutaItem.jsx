import PropTypes from "prop-types"
const RutaItem = ({ paso, titulo, descripcion }) => (
  <li className="rounded-card bg-bg-glass border border-border-secondary p-4">
    <div className="text-text-accent text-display-sm font-extrabold">{paso}</div>
    <div className="text-btn-base text-text-primary">{titulo}</div>
    <div className="text-text-sm text-text-secondary">{descripcion}</div>
  </li>
)

RutaItem.propTypes = {
  paso: PropTypes.string.isRequired,
  titulo: PropTypes.string.isRequired,
  descripcion: PropTypes.string.isRequired,
}

export default RutaItem

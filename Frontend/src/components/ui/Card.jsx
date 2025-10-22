import PropTypes from "prop-types"
const Card = ({ titulo, descripcion }) => (
  <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4">
    <h3 className="font-semibold">{titulo}</h3>
    <p className="text-slate-400 text-sm mt-1">{descripcion}</p>
  </div>
)
Card.propTypes = {
  titulo: PropTypes.string.isRequired,
  descripcion: PropTypes.string.isRequired,
}
export default Card

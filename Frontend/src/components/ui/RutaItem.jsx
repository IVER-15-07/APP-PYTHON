import PropTypes from "prop-types"
const RutaItem = ({ paso, titulo, descripcion }) => (
  <li className="rounded-xl bg-slate-900/60 border border-slate-800 p-4">
    <div className="text-emerald-400 font-extrabold">{paso}</div>
    <div className="font-semibold">{titulo}</div>
    <div className="text-slate-400 text-sm">{descripcion}</div>
  </li>
)

RutaItem.propTypes = {
  paso: PropTypes.string.isRequired,
  titulo: PropTypes.string.isRequired,
  descripcion: PropTypes.string.isRequired,
}

export default RutaItem

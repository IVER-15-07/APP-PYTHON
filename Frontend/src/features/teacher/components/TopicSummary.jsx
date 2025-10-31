import PropTypes from 'prop-types';
import { FileText, Video, Presentation, Library } from 'lucide-react';

const TopicSummary = ({ topics }) => {
  // Contar tópicos por tipo
  const textCount = topics.filter(t => t.tipo_topicoId === 1).length;
  const videoCount = topics.filter(t => t.tipo_topicoId === 2).length;
  const slidesCount = topics.filter(t => t.tipo_topicoId === 3).length;
  const totalCount = topics.length;

  return (
    <aside className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl h-fit">
      <div className="flex items-center gap-2 mb-4">
        <Library className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">Resumen de Tópicos</h3>
      </div>
      
      <p className="text-sm text-slate-400 mb-6">
        Visualiza el conteo de tópicos por tipo de contenido.
      </p>

      {/* Total de tópicos */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4 mb-4">
        <div className="text-sm text-purple-400 mb-1">Total de tópicos</div>
        <div className="text-4xl font-bold text-purple-400">{totalCount}</div>
      </div>

      {/* Tópicos por tipo */}
      <div className="space-y-3">
        {/* Texto */}
        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-blue-500/30 transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/30">
              <FileText className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-sm text-slate-300">Texto</span>
          </div>
          <span className="text-lg font-bold text-blue-400">{textCount}</span>
        </div>

        {/* Video */}
        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-red-500/30 transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/30">
              <Video className="w-4 h-4 text-red-400" />
            </div>
            <span className="text-sm text-slate-300">Video</span>
          </div>
          <span className="text-lg font-bold text-red-400">{videoCount}</span>
        </div>

        {/* Slides */}
        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-orange-500/30 transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/30">
              <Presentation className="w-4 h-4 text-orange-400" />
            </div>
            <span className="text-sm text-slate-300">Slides</span>
          </div>
          <span className="text-lg font-bold text-orange-400">{slidesCount}</span>
        </div>
      </div>

      {/* Mensaje informativo */}
      <div className="mt-6 pt-4 border-t border-slate-700/50">
        <p className="text-xs text-slate-500 text-center">
          Los tópicos se organizan por tipo de contenido para facilitar la gestión
        </p>
      </div>
    </aside>
  );
};

TopicSummary.propTypes = {
  topics: PropTypes.arrayOf(
    PropTypes.shape({
      contentType: PropTypes.string,
    })
  ).isRequired,
};

export default TopicSummary;

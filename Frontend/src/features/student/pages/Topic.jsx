
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { topicsService } from '../../../../services/topic.api';
import { BookOpen, Image, Music, FileText, ArrowLeft } from 'lucide-react';

const Topic = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await topicsService.getTopicStudents(id);
        setTopic(data);
      } catch {
        // Error handling - silently fail
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 lg:p-10">
        <div className="max-w-5xl mx-auto">
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center shadow-2xl">
            <div className="flex items-center justify-center gap-3">
              <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-slate-300">Cargando tópico…</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 lg:p-10">
        <div className="max-w-5xl mx-auto">
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center shadow-2xl">
            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">Tópico no encontrado</h3>
            <p className="text-slate-500 text-sm">El tópico que buscas no existe o no está disponible.</p>
          </div>
        </div>
      </div>
    );
  }

  const r = topic.recurso || {};
  
  // Determinar si el recurso principal va a la izquierda (texto, PDF, video)
  const isPrincipalLeft = r.urlPrincipal && (
    /\.pdf$/i.test(r.urlPrincipal) || // PDF (texto)
    /\.(mp4|webm|ogg|mov)$/i.test(r.urlPrincipal) // Video
  );

  // Determinar si hay recursos secundarios (imagen, audio, subtítulos)
  const hasSecondaryResources = r.imagen || r.audio || r.subtitulo;

  // Usar layout de dos columnas si hay recurso principal (izquierda) y recursos secundarios (derecha)
  const useTwoColumnLayout = isPrincipalLeft && hasSecondaryResources;

  const renderPrincipal = () => {
    if (!r.urlPrincipal) return null;
    
    const tipo = topic.tipo?.toLowerCase() || '';
    const url = r.urlPrincipal;
    
    // Detectar si es Cloudinary
    const isCloudinary = url.includes('cloudinary.com');
    
    // Imágenes
    if (/\.(png|jpg|jpeg|webp|gif)$/i.test(url) || tipo === 'imagen')
      return <img src={url} alt="principal" className="rounded-xl border border-slate-700/50 max-h-96 object-contain shadow-lg w-full" />;
    
    // Audio
    if (/\.(mp3|wav|ogg)$/i.test(url) || tipo === 'audio')
      return <audio controls src={url} className="w-full" />;
    
    // Video
    if (/\.(mp4|webm|ogg|mov)$/i.test(url) || tipo === 'video')
      return <video controls src={url} className="w-full rounded-xl border border-slate-700/50 shadow-lg" />;
    
    // PDF - Mostrar directamente
    if (/\.pdf$/i.test(url) || (isCloudinary && url.includes('/image/upload/') && url.includes('.pdf'))) {
      return (
        <div className="space-y-3">
          <iframe 
            title="pdf" 
            src={url} 
            className="w-full h-[700px] rounded-xl border border-slate-700/50 shadow-lg bg-white"
          />
        </div>
      );
    }
    
    // Slides (PowerPoint, presentaciones) - Detectar por tipo o extensión
    if (tipo === 'slides' || tipo === 'slide' || /\.(ppt|pptx)$/i.test(url) || 
        (isCloudinary && url.includes('/raw/upload/') && (url.includes('.ppt') || url.includes('presentation')))) {
      // Usar Office Viewer para presentaciones
      const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
      
      return (
        <div className="space-y-3">
          <iframe 
            title="presentation" 
            src={officeViewerUrl} 
            className="w-full h-[700px] rounded-xl border border-slate-700/50 shadow-lg bg-white"
          />
          <div className="flex items-center justify-center gap-2">
            <a 
              href={url} 
              target="_blank" 
              rel="noreferrer" 
              className="text-emerald-400 hover:text-emerald-300 text-sm underline font-medium"
            >
              Descargar presentación
            </a>
          </div>
        </div>
      );
    }
    
    // Para tipo "texto" o archivos de Office (Word, Excel)
    if (tipo === 'texto' || /\.(doc|docx|xls|xlsx)$/i.test(url)) {
      // Para archivos de Cloudinary raw, usar Google Docs Viewer
      if (isCloudinary && url.includes('/raw/upload/')) {
        const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
        
        return (
          <div className="space-y-3">
            <iframe 
              title="document" 
              src={googleViewerUrl} 
              className="w-full h-[700px] rounded-xl border border-slate-700/50 shadow-lg bg-white"
            />
          </div>
        );
      }
      
      // Para otros archivos de Office con extensión clara
      const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
      
      return (
        <div className="space-y-3">
          <iframe 
            title="document" 
            src={officeViewerUrl} 
            className="w-full h-[700px] rounded-xl border border-slate-700/50 shadow-lg bg-white"
          />
        </div>
      );
    }
    
    // Archivos de texto plano
    if (/\.(txt|json|xml|csv)$/i.test(url)) {
      return (
        <div className="space-y-3">
          <iframe 
            title="text-file" 
            src={url} 
            className="w-full h-[700px] rounded-xl border border-slate-700/50 shadow-lg bg-white"
          />
        </div>
      );
    }
    
    // Para otros archivos, mostrar link directo
    return (
      <div className="bg-slate-800/30 rounded-xl p-8 text-center space-y-4">
        <FileText className="w-16 h-16 text-slate-600 mx-auto" />
        <p className="text-slate-400 text-sm">Este tipo de archivo no se puede visualizar directamente en el navegador</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 lg:p-10">
      <div className={`mx-auto ${useTwoColumnLayout ? 'max-w-7xl' : 'max-w-5xl'}`}>
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Volver al curso</span>
        </button>

        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-bold text-white">{topic.nombre}</h1>
          </div>
          
          {topic.descripcion && (
            <p className="text-slate-400 mb-8 ml-14">{topic.descripcion}</p>
          )}

          {/* Layout de dos columnas: Principal (izquierda) + Recursos secundarios (derecha) */}
          {useTwoColumnLayout ? (
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h2 className="text-xl font-bold text-white">Contenido del tópico</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Contenido principal - Columna izquierda (2/3) */}
                <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">Contenido principal</h3>
                  </div>
                  {renderPrincipal()}
                </div>
                
                {/* Recursos secundarios - Columna derecha (1/3) */}
                <div className="space-y-4">
                  {/* Imagen */}
                  {r.imagen && (
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Image className="w-4 h-4 text-blue-400" />
                        <h3 className="text-sm font-bold text-white">Imagen</h3>
                      </div>
                      <img 
                        src={r.imagen} 
                        alt="imagen referencial" 
                        className="rounded-xl border border-slate-700/50 w-full h-auto object-contain shadow-lg sticky top-6" 
                      />
                    </div>
                  )}

                  {/* Audio */}
                  {r.audio && (
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Music className="w-4 h-4 text-purple-400" />
                        <h3 className="text-sm font-bold text-white">Audio</h3>
                      </div>
                      <audio controls src={r.audio} className="w-full" />
                    </div>
                  )}

                  {/* Subtítulo */}
                  {r.subtitulo && (
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="w-4 h-4 text-cyan-400" />
                        <h3 className="text-sm font-bold text-white">Subtítulo</h3>
                      </div>
                      <a 
                        href={r.subtitulo} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-emerald-400 hover:text-emerald-300 text-sm underline font-medium"
                      >
                        Ver archivo
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </section>
          ) : (
            <>
              {/* Contenido principal */}
              {r.urlPrincipal && (
                <section className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-xl font-bold text-white">Contenido principal</h2>
                  </div>
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg">
                    {renderPrincipal()}
                  </div>
                </section>
              )}

              {/* Imagen */}
              {r.imagen && (
                <section className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Image className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-bold text-white">Imagen</h3>
                  </div>
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg">
                    <img src={r.imagen} alt="imagen" className="rounded-xl border border-slate-700/50 max-h-96 object-contain shadow-lg mx-auto" />
                  </div>
                </section>
              )}
            </>
          )}

          {/* Audio - Solo mostrar si no está en layout de dos columnas */}
          {!useTwoColumnLayout && r.audio && (
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Music className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-bold text-white">Audio</h3>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg">
                <audio controls src={r.audio} className="w-full" />
              </div>
            </section>
          )}

          {/* Subtítulo - Solo mostrar si no está en layout de dos columnas */}
          {!useTwoColumnLayout && r.subtitulo && (
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">Subtítulo</h3>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg">
                <a 
                  href={r.subtitulo} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-emerald-400 hover:text-emerald-300 underline font-medium"
                >
                  Ver archivo
                </a>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topic;
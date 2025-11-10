
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { topicsService } from '../../../../services/topic.api';


const Topic = () => {
  const { id } = useParams();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await topicsService.getTopicStudents(id);
        setTopic(data);
      } catch (e) {
        console.error("Error cargando tópico:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="p-6 text-slate-300">Cargando…</div>;
  if (!topic) return <div className="p-6 text-red-400">Tópico no encontrado.</div>;

  const r = topic.recurso || {};

  const renderPrincipal = () => {
    if (!r.urlPrincipal) return null;
    if (/\.(png|jpg|jpeg|webp|gif)$/i.test(r.urlPrincipal))
      return <img src={r.urlPrincipal} alt="principal" className="rounded border border-slate-700 max-h-96 object-contain" />;
    if (/\.(mp3|wav|ogg)$/i.test(r.urlPrincipal))
      return <audio controls src={r.urlPrincipal} className="w-full" />;
    if (/\.pdf$/i.test(r.urlPrincipal))
      return <iframe title="pdf" src={r.urlPrincipal} className="w-full h-[600px] rounded border border-slate-700" />;
    return <a href={r.urlPrincipal} target="_blank" rel="noreferrer" className="text-indigo-400 underline">Abrir recurso</a>;
  };

  return (
    <div className="p-6 max-w-5xl mx-auto text-slate-200">
      <h1 className="text-3xl font-bold mb-2">{topic.nombre}</h1>
      {topic.descripcion && <p className="text-slate-400 mb-6">{topic.descripcion}</p>}

      {r.urlPrincipal && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Contenido principal</h2>
          {renderPrincipal()}
        </section>
      )}

      {r.imagen && (
        <section className="mb-6">
          <h3 className="font-semibold mb-2">Imagen</h3>
            <img src={r.imagen} alt="imagen" className="rounded border border-slate-700 max-h-72 object-contain" />
        </section>
      )}

      {r.audio && (
        <section className="mb-6">
          <h3 className="font-semibold mb-2">Audio</h3>
          <audio controls src={r.audio} className="w-full" />
        </section>
      )}

      {r.subtitulo && (
        <section className="mb-6">
          <h3 className="font-semibold mb-2">Subtítulo</h3>
          <a href={r.subtitulo} target="_blank" rel="noreferrer" className="text-indigo-400 underline">
            Ver archivo
          </a>
        </section>
      )}
    </div>
  );
};

export default Topic;

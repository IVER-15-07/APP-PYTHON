import { useState } from "react"
import ejemploPython from "../components/data/ejemploPython"
import aprendizajes from "../components/data/aprendizajes"
import ruta from "../components/data/ruta"
import { BotonLink, FeatureCard, RutaItem } from "../components/ui"
import { Code2, Play, Sparkles } from "lucide-react"


const Home = () => {
  const [copiado, setCopiado] = useState(false)

  const copiarEjemplo = async () => {
    try {
      await navigator.clipboard.writeText(ejemploPython)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1500)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("No se pudo copiar:", err)
    }
  }

  return (
    <main className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-200 min-h-[calc(100vh-64px)]">
      {/* Héroe */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid lg:grid-cols-2 items-center gap-12">
          <div>
            <div className="inline-flex items-center gap-2 text-green-400 text-sm font-semibold bg-green-500/10 border border-green-500/30 px-4 py-2 rounded-full shadow-lg shadow-green-500/10">
              <Code2 className="w-4 h-4" />
              Aprende Python desde cero
            </div>
            <h1 className="mt-6 text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent leading-tight">
              Domina lo esencial de Python con ejercicios prácticos
            </h1>
            <p className="mt-6 text-slate-400 text-lg leading-relaxed">
              Videos cortos, ejemplos claros y retos guiados. Avanza a tu ritmo y construye proyectos reales.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <BotonLink to="/estudiante">
                <Play className="w-4 h-4" />
                Empezar ahora
              </BotonLink>
              <BotonLink to="/profesor" variant="secondary">
                Soy profesor
              </BotonLink>
            </div>

            <div className="mt-8 flex items-center gap-8 text-sm">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-green-400 font-bold text-lg">📚</span>
                <span><strong className="text-white">40+</strong> lecciones</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-cyan-400 font-bold text-lg">🧩</span>
                <span><strong className="text-white">120+</strong> ejercicios</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-emerald-400 font-bold text-lg">🚀</span>
                <span><strong className="text-white">6</strong> proyectos</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-700/50 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                <div className="w-3 h-3 rounded-full bg-green-400 shadow-lg shadow-green-400/50"></div>
                Ejemplo en Python
              </div>
              <button
                onClick={copiarEjemplo}
                className="text-xs font-semibold px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700/50 text-slate-200 transition-all duration-200 hover:border-green-500/30"
              >
                {copiado ? "✓ ¡Copiado!" : "Copiar"}
              </button>
            </div>
            <pre className="overflow-auto rounded-xl bg-slate-950/80 border border-slate-800/50 p-5 text-sm shadow-inner">
              <code className="language-python whitespace-pre text-slate-300">{ejemploPython}</code>
            </pre>
            <p className="mt-4 text-slate-400 text-sm flex items-center gap-2">
              <Play className="w-4 h-4 text-green-400" />
              Ejecuta este script en tu terminal con: <code className="text-green-400 bg-green-500/10 px-2 py-0.5 rounded">python archivo.py</code>
            </p>
          </div>
        </div>
      </section>

      {/* Qué aprenderás */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-6 h-6 text-green-400" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Qué aprenderás</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(Array.isArray(aprendizajes) ? aprendizajes : []).map(({ titulo, descripcion }) => (
            <FeatureCard key={titulo} titulo={titulo} descripcion={descripcion} />
          ))}
        </div>
      </section>

      {/* Ruta sugerida */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="text-green-400 bg-green-500/10 p-2 rounded-lg border border-green-500/30 shadow-lg shadow-green-500/20">
            <Code2 className="w-5 h-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Ruta de aprendizaje</h2>
        </div>
        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ruta.map(({ paso, titulo, descripcion }) => (
            <RutaItem key={paso} paso={paso} titulo={titulo} descripcion={descripcion} />
          ))}
        </ol>

        <div className="mt-8">
          <BotonLink to="/estudiante">
            <Play className="w-4 h-4" />
            Comenzar el nivel 1
          </BotonLink>
        </div>
      </section>
    </main>
  )
}

export default Home
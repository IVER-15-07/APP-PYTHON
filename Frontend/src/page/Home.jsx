import { useState } from "react"
import ejemploPython from "../components/data/ejemploPython"
import aprendizajes from "../components/data/aprendizajes"
import ruta from "../components/data/ruta"
import { BotonLink, Card, RutaItem } from "../components/ui"


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
    <main className="bg-slate-950 text-slate-200 min-h-[calc(100vh-56px)]">
      {/* Héroe */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid lg:grid-cols-2 items-center gap-10">
          <div>
            <span className="inline-flex items-center gap-2 text-emerald-400 text-sm font-semibold bg-slate-900/60 border border-slate-800 px-3 py-1 rounded-full">
              🐍 Aprende Python desde cero
            </span>
            <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight">
              Domina lo esencial de Python con ejercicios prácticos
            </h1>
            <p className="mt-4 text-slate-400 text-lg">
              Videos cortos, ejemplos claros y retos guiados. Avanza a tu ritmo y construye proyectos reales.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <BotonLink to="/estudiante">Empezar ahora</BotonLink>
              <BotonLink to="/profesor" variant="secondary">Soy profesor</BotonLink>
            </div>

            <div className="mt-6 flex items-center gap-6 text-sm text-slate-400">
              <div>📚 40+ lecciones</div>
              <div>🧩 120+ ejercicios</div>
              <div>🚀 6 proyectos</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="text-slate-400 text-sm">Ejemplo en Python</div>
              <button
                onClick={copiarEjemplo}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200"
              >
                {copiado ? "¡Copiado!" : "Copiar"}
              </button>
            </div>
            <pre className="overflow-auto rounded-xl bg-slate-950/60 border border-slate-800 p-4 text-sm">
              <code className="language-python whitespace-pre">{ejemploPython}</code>
            </pre>
            <p className="mt-3 text-slate-400 text-sm">
              Ejecuta este script en tu terminal con: python archivo.py
            </p>
          </div>
        </div>
      </section>

      {/* Qué aprenderás */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Qué aprenderás</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {aprendizajes.map(({ titulo, descripcion }) => (
            <Card key={titulo} titulo={titulo} descripcion={descripcion} />
          ))}
        </div>
      </section>

      {/* Ruta sugerida */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Ruta de aprendizaje</h2>
        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ruta.map(({ paso, titulo, descripcion }) => (
            <RutaItem key={paso} paso={paso} titulo={titulo} descripcion={descripcion} />
          ))}
        </ol>

        <div className="mt-6">
          <BotonLink to="/estudiante">Comenzar el nivel 1</BotonLink>
        </div>
      </section>
    </main>
  )
}

export default Home

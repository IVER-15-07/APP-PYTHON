import { useState } from "react"
import { Link } from "react-router-dom"

const Home = () => {
    const [copiado, setCopiado] = useState(false)

  const ejemplo = `# Tu primer programa en Python
nombre = input("¿Cómo te llamas? ")
print(f"¡Hola, {nombre}! Bienvenido a Python 🐍")

# Tip: prueba cambiar el mensaje o agregar otra línea
for i in range(3):
    print("Python es genial!")`

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(ejemplo)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1500)
    } catch (e) {
      console.error("No se pudo copiar:", e)
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
              <Link
                to="/estudiante"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow"
              >
                Empezar ahora
              </Link>
              <Link
                to="/profesor"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-900 text-slate-200 font-semibold"
              >
                Soy profesor
              </Link>
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
                onClick={copiar}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200"
              >
                {copiado ? "¡Copiado!" : "Copiar"}
              </button>
            </div>
            <pre className="overflow-auto rounded-xl bg-slate-950/60 border border-slate-800 p-4 text-sm">
              <code className="language-python whitespace-pre">{ejemplo}</code>
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
          {[
            { t: "Sintaxis básica", d: "variables, tipos, input/output, operadores" },
            { t: "Estructuras de control", d: "if/else, for, while, comprensión de listas" },
            { t: "Funciones y módulos", d: "parámetros, retorno, módulos estándar" },
            { t: "Estructuras de datos", d: "listas, tuplas, diccionarios, sets" },
            { t: "POO básica", d: "clases, objetos, métodos y herencia simple" },
            { t: "Errores y archivos", d: "try/except, lectura/escritura de ficheros" },
          ].map((c) => (
            <div key={c.t} className="rounded-xl bg-slate-900/60 border border-slate-800 p-4">
              <h3 className="font-semibold">{c.t}</h3>
              <p className="text-slate-400 text-sm mt-1">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ruta sugerida */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Ruta de aprendizaje</h2>
        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { n: "1", t: "Fundamentos", d: "instalación, sintaxis y tipos" },
            { n: "2", t: "Lógica y colecciones", d: "control de flujo, listas y diccionarios" },
            { n: "3", t: "Funciones y POO", d: "organiza y abstrae tu código" },
            { n: "4", t: "Proyectos", d: "aplica lo aprendido construyendo apps" },
          ].map((s) => (
            <li key={s.n} className="rounded-xl bg-slate-900/60 border border-slate-800 p-4">
              <div className="text-emerald-400 font-extrabold">{s.n}</div>
              <div className="font-semibold">{s.t}</div>
              <div className="text-slate-400 text-sm">{s.d}</div>
            </li>
          ))}
        </ol>

        <div className="mt-6">
          <Link
            to="/estudiante"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow"
          >
            Comenzar el nivel 1
          </Link>
        </div>
      </section>
    </main>
  )
}

export default Home

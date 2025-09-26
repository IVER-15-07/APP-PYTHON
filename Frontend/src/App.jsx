"use client"

import { useState } from "react"
import "./App.css"

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Py</span>
              </div>
              <span className="text-xl font-bold">PythonAcademy</span>
            </div>

            <nav className="hidden md:flex space-x-8">
              <a href="#inicio" className="text-slate-300 hover:text-white transition-colors">
                Inicio
              </a>
              <a href="#cursos" className="text-slate-300 hover:text-white transition-colors">
                Cursos
              </a>
              <a href="#recursos" className="text-slate-300 hover:text-white transition-colors">
                Recursos
              </a>
              <a href="#contacto" className="text-slate-300 hover:text-white transition-colors">
                Contacto
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <button className="text-slate-300 hover:text-white transition-colors">Iniciar Sesión</button>
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Aprende Python desde Cero
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Plataforma diseñada específicamente para estudiantes de primer semestre de Ingeniería de Sistemas. Domina
            Python con ejercicios prácticos y proyectos reales.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg text-lg font-semibold transition-colors">
              Comenzar Gratis
            </button>
            <button className="border border-slate-600 hover:border-slate-500 px-8 py-3 rounded-lg text-lg font-semibold transition-colors">
              Ver Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">¿Por qué elegir PythonAcademy?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Contenido Especializado</h3>
              <p className="text-slate-300">
                Currículo diseñado específicamente para estudiantes de ingeniería, con enfoque en fundamentos sólidos de
                programación.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Práctica Interactiva</h3>
              <p className="text-slate-300">
                Ejercicios en tiempo real, compilador integrado y retroalimentación inmediata para acelerar tu
                aprendizaje.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Proyectos Reales</h3>
              <p className="text-slate-300">
                Desarrolla aplicaciones prácticas que podrás incluir en tu portafolio profesional desde el primer
                semestre.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Path */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Ruta de Aprendizaje</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <div className="text-blue-400 text-sm font-semibold mb-2">MÓDULO 1</div>
              <h3 className="text-lg font-semibold mb-3">Fundamentos</h3>
              <ul className="text-slate-300 text-sm space-y-1">
                <li>• Variables y tipos de datos</li>
                <li>• Operadores y expresiones</li>
                <li>• Entrada y salida de datos</li>
              </ul>
            </div>

            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <div className="text-green-400 text-sm font-semibold mb-2">MÓDULO 2</div>
              <h3 className="text-lg font-semibold mb-3">Control de Flujo</h3>
              <ul className="text-slate-300 text-sm space-y-1">
                <li>• Condicionales (if, elif, else)</li>
                <li>• Bucles (for, while)</li>
                <li>• Manejo de excepciones</li>
              </ul>
            </div>

            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <div className="text-purple-400 text-sm font-semibold mb-2">MÓDULO 3</div>
              <h3 className="text-lg font-semibold mb-3">Estructuras de Datos</h3>
              <ul className="text-slate-300 text-sm space-y-1">
                <li>• Listas y tuplas</li>
                <li>• Diccionarios y sets</li>
                <li>• Manipulación de strings</li>
              </ul>
            </div>

            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <div className="text-orange-400 text-sm font-semibold mb-2">MÓDULO 4</div>
              <h3 className="text-lg font-semibold mb-3">Funciones y Módulos</h3>
              <ul className="text-slate-300 text-sm space-y-1">
                <li>• Definición de funciones</li>
                <li>• Parámetros y argumentos</li>
                <li>• Importación de módulos</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">2,500+</div>
              <div className="text-slate-300">Estudiantes Activos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">95%</div>
              <div className="text-slate-300">Tasa de Aprobación</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">50+</div>
              <div className="text-slate-300">Ejercicios Prácticos</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">¿Listo para comenzar tu journey en Python?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Únete a miles de estudiantes que ya están dominando Python con nuestra plataforma.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
            Empezar Ahora - Es Gratis
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">Py</span>
                </div>
                <span className="text-xl font-bold">PythonAcademy</span>
              </div>
              <p className="text-slate-400">
                La mejor plataforma para aprender Python diseñada para estudiantes de ingeniería.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Cursos</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Python Básico
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Estructuras de Datos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Algoritmos
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentación
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Ejercicios
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Proyectos
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Centro de Ayuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contacto
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Comunidad
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 PythonAcademy. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App


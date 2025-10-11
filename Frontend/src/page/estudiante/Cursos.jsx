import { useState } from "react";

const Cursos = () => {
  const [openSection, setOpenSection] = useState(null);

   //mock data
  const syllabus = [
    {
      id: 1,
      title: "Primeros Pasos",
      summary: "5 Tópicos, 2 Laboratorios, 1 Diagnóstico",
      lessons: [
        { type: "Tópico", title: "Introducción a Python" },
        { type: "Tópico", title: "Instalación del entorno" },
        { type: "Tópico", title: "Hola Mundo" },
        { type: "Tópico", title: "Comentarios en Python" },
        { type: "Tópico", title: "Sintaxis básica" },
        { type: "Laboratorio", title: "Prueba de instalación" },
        { type: "Laboratorio", title: "Ejercicio de impresión" },
        { type: "Diagnóstico", title: "Preguntas introductorias" },
      ],
    },
    {
      id: 2,
      title: "Operadores",
      summary: "4 Tópicos, 1 Laboratorio, 1 Diagnóstico",
      lessons: [
        { type: "Tópico", title: "Operadores aritméticos" },
        { type: "Tópico", title: "Operadores relacionales" },
        { type: "Tópico", title: "Operadores lógicos" },
        { type: "Tópico", title: "Precedencia de operadores" },
        { type: "Laboratorio", title: "Práctica con operadores" },
        { type: "Diagnóstico", title: "Evaluación de operadores" },
      ],
    },
    {
      id: 3,
      title: "Estructuras de Control de Flujo",
      summary: "6 Tópicos, 2 Laboratorios, 1 Diagnóstico",
      lessons: [
        { type: "Tópico", title: "Condicional if" },
        { type: "Tópico", title: "Else y elif" },
        { type: "Tópico", title: "Bucles for" },
        { type: "Tópico", title: "Bucles while" },
        { type: "Tópico", title: "Break y continue" },
        { type: "Tópico", title: "Estructuras anidadas" },
        { type: "Laboratorio", title: "Ciclo de multiplicación" },
        { type: "Laboratorio", title: "Verificación de números primos" },
        { type: "Diagnóstico", title: "Flujo de control en Python" },
      ],
    },
    {
      id: 4,
      title: "Funciones y Excepciones",
      summary: "5 Tópicos, 2 Laboratorios, 1 Diagnóstico",
      lessons: [
        { type: "Tópico", title: "Definición de funciones" },
        { type: "Tópico", title: "Parámetros y retorno" },
        { type: "Tópico", title: "Funciones lambda" },
        { type: "Tópico", title: "Manejo de errores" },
        { type: "Tópico", title: "Bloque try-except" },
        { type: "Laboratorio", title: "Función de suma con validación" },
        { type: "Laboratorio", title: "Captura de errores comunes" },
        { type: "Diagnóstico", title: "Evaluación de funciones" },
      ],
    },
    {
      id: 5,
      title: "Estructuras de Datos",
      summary: "6 Tópicos, 2 Laboratorios, 1 Diagnóstico",
      lessons: [
        { type: "Tópico", title: "Listas" },
        { type: "Tópico", title: "Métodos de listas" },
        { type: "Tópico", title: "Tuplas" },
        { type: "Tópico", title: "Diccionarios" },
        { type: "Tópico", title: "Conjuntos" },
        { type: "Tópico", title: "Iteración sobre colecciones" },
        { type: "Laboratorio", title: "Manipulación de listas" },
        { type: "Laboratorio", title: "Registro con diccionarios" },
        { type: "Diagnóstico", title: "Prueba de estructuras de datos" },
      ],
    },
    {
      id: 6,
      title: "Clases y Objetos",
      summary: "4 Tópicos, 2 Laboratorios, 1 Diagnóstico",
      lessons: [
        { type: "Tópico", title: "Introducción a POO" },
        { type: "Tópico", title: "Definición de clases" },
        { type: "Tópico", title: "Instancias y métodos" },
        { type: "Tópico", title: "Herencia y polimorfismo" },
        { type: "Laboratorio", title: "Clase Persona" },
        { type: "Laboratorio", title: "Sistema de estudiantes" },
        { type: "Diagnóstico", title: "Evaluación POO" },
      ],
    },
  ];

  const toggleSection = (id) => {
    setOpenSection(openSection === id ? null : id);
  };


  const getIcon = (type) => {
    switch (type) {
      case "Tópico":
        return "📘";
      case "Laboratorio":
        return "🧪";
      case "Diagnóstico":
        return "❓";
      default:
        return "🔹";
    }
  };

  return (
    <div className="p-8 bg-slate-950 text-slate-200 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-emerald-400">Curso de introducción a python</h1>

      <div className="space-y-4">
        {syllabus.map((section) => (
          <div
            key={section.id}
            className="border border-slate-800 bg-slate-900 rounded-lg overflow-hidden"
          >
            {}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-slate-800 transition-colors"
            >
              <div>
                <h2 className="text-lg font-semibold">{section.title}</h2>
                <p className="text-slate-400 text-sm">{section.summary}</p>
              </div>
              <span className="text-slate-400 text-xl">
                {openSection === section.id ? "▾" : "▸"}
              </span>
            </button>

            {}
            {openSection === section.id && (
              <div className="px-8 pb-4 space-y-2 animate-fadeIn">
                {section.lessons.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 py-2 border-b border-slate-800 last:border-0"
                  >
                    <span className="text-lg">{getIcon(item.type)}</span>
                    <p className="text-sm text-slate-300">
                      <span className="font-semibold text-emerald-400 mr-2">
                        {item.type}:
                      </span>
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cursos;

import React from "react";

const Topic1 = () => {
  return (
    <div className="p-8 text-white bg-slate-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Tema: Listas en Python
      </h1>

      {/* Contenedor principal dividido en dos columnas */}
      <div className="grid md:grid-cols-2 gap-8 mb-10">
        {/* Columna izquierda: Explicación teórica */}
        <div className="bg-slate-800 p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Concepto</h2>
          <p className="text-gray-300 mb-3">
            Una <strong>lista</strong> en Python es una colección ordenada y
            mutable de elementos. Puede contener diferentes tipos de datos, como
            números, cadenas, o incluso otras listas.
          </p>
          <p className="text-gray-300">
            Se definen utilizando corchetes <code>[]</code> y los elementos se
            separan por comas.
          </p>
        </div>

        {/* Columna derecha: Imagen o código de ejemplo */}
        <div className="bg-slate-800 p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Ejemplo de código</h2>
          <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto text-sm">
{`-- Definición de una lista
frutas = ["manzana", "pera", "uva"]

-- Acceso a elementos
print(frutas[0])   // manzana

-- Agregar un nuevo elemento
frutas.append("naranja")

print(frutas)`}
          </pre>
          {/* Si prefieres una imagen en lugar del código, reemplaza lo anterior por esto:
          <img src="/ruta/tu-imagen.png" alt="Ejemplo de listas" className="rounded-lg" />
          */}
        </div>
      </div>

      {/* Sección inferior: Ejercicio práctico */}
      <div className="bg-slate-800 p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Ejercicio</h2>
        <p className="text-gray-300 mb-4">
          Crea una lista llamada <code>numeros</code> que contenga los números
          del 1 al 5. Luego:
        </p>
        <ul className="list-disc list-inside text-gray-300 mb-4">
          <li>Agrega el número 6 a la lista.</li>
          <li>Elimina el número 3.</li>
          <li>Imprime la lista final.</li>
        </ul>
        <p className="text-gray-400 italic">
          💡 Consejo: utiliza los métodos <code>append()</code> y
          <code> remove()</code>.
        </p>
      </div>
    </div>
  );
};

export default Topic1;


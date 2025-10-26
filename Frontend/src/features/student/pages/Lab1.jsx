import React, { useState, useEffect } from "react";
import { loadPyodide } from "pyodide";

const Lab1 = () => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [pyodide, setPyodide] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar Pyodide una sola vez al iniciar el componente
  useEffect(() => {
    const initPyodide = async () => {
      const py = await loadPyodide();
      setPyodide(py);
      setLoading(false);
    };
    initPyodide();
  }, []);

  const handleRun = async () => {
    if (!pyodide) return;
    try {
      // Ejecuta el código Python
      let result = await pyodide.runPythonAsync(code);
      setOutput(result?.toString() || "Código ejecutado sin salida.");
    } catch (err) {
      setOutput("Error: " + err.message);
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-2">Laboratorio</h1>
      <p className="mb-6 text-gray-300">
        En este laboratorio repasaremos los <strong>operadores aritméticos, relacionales y lógicos</strong> de Python
        mediante un ejercicio práctico. Escribe el código en el editor y presiona <strong>Ejecutar</strong> para ver el resultado.
      </p>

      <div className="bg-blue-900/30 p-4 rounded-xl mb-6 border border-blue-500/40">
        <h2 className="text-xl font-semibold text-blue-300 mb-2">Ejercicio</h2>
        <p className="text-gray-200 leading-relaxed">
          Crea un programa en Python que:
          <br />1️⃣ Declare dos variables <code>a</code> y <code>b</code> con valores numéricos.
          <br />2️⃣ Muestre los resultados de las operaciones aritméticas: suma, resta, multiplicación, división y módulo.
          <br />3️⃣ Compare los valores usando operadores relacionales (<code>==, !=, &gt;, &lt;, &gt;=, &lt;=</code>).
          <br />4️⃣ Utilice operadores lógicos (<code>and, or, not</code>) para evaluar condiciones.
          <br />5️⃣ Finalmente, imprima un mensaje indicando si ambos números son positivos y si uno de ellos es mayor que 10.
        </p>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder={`# Ejemplo sugerido:
a = 12
b = 5
print("Suma:", a + b)

`}
        className="w-full h-64 p-3 rounded-lg bg-slate-800 text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      ></textarea>

      <button
        onClick={handleRun}
        disabled={!code.trim() || loading}
        className={`mt-4 px-6 py-2 rounded-lg font-semibold transition-colors ${
          code.trim() && !loading
            ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
            : "bg-gray-600 cursor-not-allowed"
        }`}
      >
        {loading ?"Ejecutar" : "Cargando entorno..." } 
      </button>

      <div className="mt-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
        <h3 className="font-semibold text-lg mb-2 text-gray-200">Salida:</h3>
        <pre className="text-green-400 whitespace-pre-wrap">
          {output || "# Aquí aparecerá la salida..."}
        </pre>
      </div>
    </div>
  );
};

export default Lab1;

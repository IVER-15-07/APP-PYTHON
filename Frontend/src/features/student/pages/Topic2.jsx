import React, { useState } from "react";
import { PlayCircle, FileText, MonitorPlay, FileType, Presentation } from "lucide-react";

const Topic2 = () => {
  const [selectedTab, setSelectedTab] = useState("video");

  const renderContent = () => {
    switch (selectedTab) {
      case "video":
        return (
          <div className="flex justify-center items-center">
            <iframe
              className="w-full h-96 rounded-xl border border-gray-700"
              src="https://www.youtube.com/embed/Rv910T1BJUw?si=hMdc60HcDPEWUKEI"
              title="Python Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        );
      case "slides":
        return (
          <div className="flex justify-center items-center h-96">
            <iframe
              src="https://docs.google.com/presentation/d/e/2PACX-1vT6rZoqsXK4hPciF3zmt7o4eIIZnYzJISAsLDom2Oa_yZ1HZ1GkQMMJSJH7Z5Oi1r8/pub?start=false&loop=false&delayms=3000"
              title="Slides de Python"
              className="w-full h-full rounded-lg border border-gray-700"
            ></iframe>
          </div>
        );
      case "txt":
        return (
          <div className="p-4 text-gray-200">
            <h2 className="text-xl font-semibold mb-2 text-blue-300">
              Variables y Tipos de Datos
            </h2>
            <p>
              En Python, no es necesario declarar el tipo de variable, ya que el intérprete lo infiere automáticamente.
            </p>
            <pre className="bg-slate-800 text-green-400 mt-3 p-3 rounded-lg font-mono">
{`# Ejemplo:
x = 10        # Entero
y = 3.14      # Flotante
nombre = "Juan"  # Cadena
print(type(x), type(y), type(nombre))`}
            </pre>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 text-white">
      {/* Tabs */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-2">
        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedTab("video")}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition ${
              selectedTab === "video" ? "bg-blue-600" : "bg-slate-800 hover:bg-slate-700"
            }`}
          >
            <MonitorPlay size={18} /> <span>Video</span>
          </button>
          <button
            onClick={() => setSelectedTab("slides")}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition ${
              selectedTab === "slides" ? "bg-blue-600" : "bg-slate-800 hover:bg-slate-700"
            }`}
          >
            <Presentation size={18} /> <span>Slides</span>
          </button>
          <button
            onClick={() => setSelectedTab("txt")}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition ${
              selectedTab === "txt" ? "bg-blue-600" : "bg-slate-800 hover:bg-slate-700"
            }`}
          >
            <FileText size={18} /> <span>Texto</span>
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div className="bg-slate-900 rounded-xl p-4 mb-6 border border-gray-700">
        {renderContent()}
      </div>

      {/* Sección inferior */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-900/40 rounded-xl p-4 flex flex-col justify-center items-center border border-blue-500/30">
          <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3">
            <PlayCircle size={28} />
          </button>
          <p className="mt-2 text-gray-200 font-semibold">Transcripción</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 flex flex-col justify-center items-center border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-100 mb-2">Slides</h3>
          <p className="text-gray-400 text-sm text-center">
            Revisa las diapositivas y ejemplos de variables y tipos de datos en Python.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Topic2;

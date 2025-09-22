import { useState } from 'react'



function App() {
 

  return (
    <>
     <div>
      <h1>hola  como estas 
         
      </h1>
         {/* Botón Tailwind */}
      <button
        type="button"
        className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:bg-blue-800"
        onClick={() => console.log('Botón clic')}
      >
        Botón Tailwind
      </button>
     </div>
    </>
  )
}

export default App

function index() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Título */}
      <h1 className="text-4xl text-white font-bold mb-6">Calculadora</h1>

      {/* Contenedor principal */}
      <div className="backdrop-blur-md bg-white/30 rounded-2xl p-6 w-[300px]">
        <div className="flex flex-col gap-4">
          {/* Botones del menú */}
          <button className="bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-400 transition">
            Distribución poisson
          </button>
          <button className="bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-400 transition">
            Distribución exponencial.
          </button>
          <button className="bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-400 transition">
            Líneas de espera de un servidor sin límite.
          </button>
          <button className="bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-400 transition">
           Líneas de espera de un servidor con límite.
          </button>
          <button className="bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-400 transition">
            Líneas de espera de varios servidores sin límite.
          </button>
          <button className="bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-400 transition">
            Líneas de espera de varios servidores con límite.
          </button>
        </div>
      </div>
    </div>
  )
}

export default index

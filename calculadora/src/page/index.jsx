import { Link } from "react-router-dom"

function index() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Título */}
      <h1 className="text-4xl font-bold mb-6">Calculadora</h1>

      {/* Contenedor principal */}
      <div className="bg-white shadow-lg  rounded-2xl p-6 w-[300px]">
        <div className="flex flex-col gap-4">
          {/* Botones del menú */}
          <Link  to="/calculadora/poisson" className="text-center bg-gray-300 shadow-lg  text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-400 transition">
            Distribución poisson
          </Link>
          <Link  to="/calculadora/exponencial" className="text-center bg-gray-300 shadow-lg  text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-400 transition">
            Distribución exponencial
          </Link>
          <Link  to="/calculadora/unServidorSinLimite" className="text-center bg-gray-300 shadow-lg  text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-400 transition">
            Líneas de espera de un servidor sin límite de cola
          </Link>
          <Link  to="/calculadora/unServidorConLimite" className="text-center bg-gray-300 shadow-lg  text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-400 transition">
           Líneas de espera de un servidor con límite de cola
          </Link>
          <Link  to="/calculadora/variosServidoresSinLimite" className="text-center bg-gray-300 shadow-lg  text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-400 transition">
            Líneas de espera de varios servidores sin límite de cola
          </Link>
          <Link  to="/calculadora/variosServidoresConLimite" className="text-center bg-gray-300  shadow-lg text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-400 transition">
            Líneas de espera de varios servidores con límite de cola
          </Link>
        </div>
      </div>
    </div>
  )
}
export default index

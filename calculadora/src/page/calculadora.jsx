import {useParams, Link} from "react-router-dom"
import Poisson from "../components/poisson.jsx"
import Exponencial from "../components/exponencial.jsx"
import UnServidorConLimite from "../components/unServidorConLimite.jsx";
import UnServidorSinLimite from "../components/unServidorSinLimite.jsx";
import VariosServidoresConLimite from "../components/variosServidoresConlimite.jsx";
import VariosServidoresSinLimite from "../components/variosServidoresSinLimite.jsx";

function Calculadora() {
  const { operacion } = useParams();

  return (
    <div className="flex flex-col items-center justify-start min-h-screen mt-10">
      {operacion === "poisson" && <Poisson />}
      {operacion === "exponencial" && <Exponencial />}
      {operacion === "unServidorConLimite" && <UnServidorConLimite />}
      {operacion === "unServidorSinLimite" && <UnServidorSinLimite />}
      {operacion === "variosServidoresConLimite" && <VariosServidoresConLimite />}
      {operacion === "variosServidoresSinLimite" && <VariosServidoresSinLimite />}

        <Link
        to="/"
        className="mt-8 px-6 py-2 text-white bg-red-500 font-semibold rounded-lg hover:bg-red-400 transition"
      >
        Volver al menú
      </Link>
    </div>

  );
}
export default Calculadora;

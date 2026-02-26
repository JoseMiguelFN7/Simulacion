import logoUnimar from '../assets/unimar_logo.png';

export default function LogoUnimar() {
  return (

    <nav className="bg-white text-Black p-4 shadow-lg sticky top-0 z-50 mb-5">
      <div className="container mx-auto flex justify-between items-center">
        {/* Sección del Logo */}
        <div className="flex items-center">
          <img src={logoUnimar} alt="Logo UNIMAR" className="h-10 md:h-12 mr-3" />
          <span className="text-xl md:text-2xl font-semibold tracking-wide hidden sm:block">
            Proyecto final | Calculadora de Procesos
          </span>
        </div>  
       
      </div>
    </nav>
  );
}



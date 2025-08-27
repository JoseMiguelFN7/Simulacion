export default function Footer() {  

const currentYear = new Date().getFullYear();

  return (
<footer className="bg-gray-800 text-gray-400 p-10 mt-5 text-center">
      <div className="container mx-auto">
        <p className="mb-2">
          &copy; {currentYear} Todos los derechos reservados.
        </p>
        <p className="text-sm">
          Desarrollado por: {' '}
          <span className="font-semibold text-gray-300">José M. Ferreira N.</span>, {' '}
          <span className="font-semibold text-gray-300">Moises A. Gómez S.</span> & {' '}
          <span className="font-semibold text-gray-300">Oscar A. Aguiar B.</span>
        </p>
      </div>
    </footer>
  );
}


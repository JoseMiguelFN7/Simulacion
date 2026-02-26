import React, { useState } from 'react';

// --- Función de Cálculo ---
// (Esta es la función que proporcionaste para la distribución exponencial)

function exponentialProbability(lambda, x, type = 'atMost') {
  if (lambda <= 0 || x < 0) {
    return "Error: lambda debe ser positivo y x no puede ser negativo.";
  }

  let rawProbability = 0;

  switch (type) {
    case 'atMost':
      // P(T ≤ x)
      rawProbability = 1 - Math.exp(-lambda * x);
      break;

    case 'moreThan':
      // P(T > x)
      rawProbability = Math.exp(-lambda * x);
      break;

    default:
      return "Error: Tipo no válido.";
  }

  return (rawProbability * 100).toFixed(2) + '%';
}


// --- Componente de React ---

export default function Exponencial() {
  // Estados para los inputs del usuario
  const [lambda, setLambda] = useState('');
  const [x, setX] = useState('');
  const [type, setType] = useState('atMost'); // Valor por defecto

  // Estado para guardar el resultado
  const [resultado, setResultado] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Convertimos los inputs a números
    const numLambda = parseFloat(lambda);
    const numX = parseFloat(x);
    
    // Validación
    if (isNaN(numLambda) || isNaN(numX) || numLambda <= 0 || numX < 0) {
      setResultado('Error: Ingresa valores válidos (λ > 0, x ≥ 0).');
      return;
    }
    
    const prob = exponentialProbability(numLambda, numX, type);
    setResultado(prob);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Calculadora de Distribución Exponencial ⏳
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input para Lambda (λ) */}
        <div>
          <label htmlFor="lambda" className="block text-sm font-medium text-gray-700 mb-1">
            Tasa media de eventos (λ)
          </label>
          <input
            type="number"
            id="lambda"
            step="any"
            value={lambda}
            onChange={(e) => setLambda(e.target.value)}
            placeholder="Ej: 0.5 (eventos por minuto)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Input para x */}
        <div>
          <label htmlFor="x" className="block text-sm font-medium text-gray-700 mb-1">
            Valor de tiempo (x)
          </label>
          <input
            type="number"
            id="x"
            step="any"
            value={x}
            onChange={(e) => setX(e.target.value)}
            placeholder="Ej: 3 (minutos)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Selector para el tipo de cálculo */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de cálculo
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="atMost">Menor o igual a x (P(T ≤ x))</option>
            <option value="moreThan">Mayor a x (P(T {">"} x))</option>
          </select>
        </div>

        {/* Botón para calcular */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Calcular Probabilidad
        </button>
      </form>

      {/* Área para mostrar el resultado */}
      {resultado && (
        <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
          <p className="text-sm text-gray-600">Resultado:</p>
          <p className="text-2xl font-semibold text-blue-800">{resultado}</p>
        </div>
      )}
    </div>
  );
};
import React, { useState } from 'react';

// --- Funciones de Cálculo ---
// (Estas son las funciones que proporcionaste, las colocamos fuera del componente)

function factorial(n) {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

function poissonProbability(lambda, k, type) {
  const calculateP_exact = (i) => {
    return (Math.pow(lambda, i) * Math.exp(-lambda)) / factorial(i);
  };

  let rawProbability = 0;

  switch (type) {
    case 'exact':
      rawProbability = calculateP_exact(k);
      break;
    case 'atMost':
      for (let i = 0; i <= k; i++) {
        rawProbability += calculateP_exact(i);
      }
      break;
    case 'lessThan':
      for (let i = 0; i < k; i++) {
        rawProbability += calculateP_exact(i);
      }
      break;
    case 'atLeast':
      let probLessThan = 0;
      for (let i = 0; i < k; i++) {
        probLessThan += calculateP_exact(i);
      }
      rawProbability = 1 - probLessThan;
      break;
    case 'moreThan':
      let probAtMost = 0;
      for (let i = 0; i <= k; i++) {
        probAtMost += calculateP_exact(i);
      }
      rawProbability = 1 - probAtMost;
      break;
    default:
      return "Error: Tipo no válido";
  }

  return (rawProbability * 100).toFixed(2) + '%';
}
// --- Componente de React ---
export default function Poisson() {
  // Estados para los inputs del usuario
  const [lambda, setLambda] = useState('');
  const [k, setK] = useState('');
  const [type, setType] = useState('exact'); // Valor por defecto para el selector

  // Estado para guardar el resultado del cálculo
  const [resultado, setResultado] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault(); // Evita que la página se recargue

    // Convertimos los inputs a números
    const numLambda = parseFloat(lambda);
    const numK = parseInt(k, 10);

    // Validación simple
    if (isNaN(numLambda) || isNaN(numK) || numLambda < 0 || numK < 0) {
      setResultado('Error: Por favor, introduce valores numéricos válidos y no negativos.');
      return;
    }
    
    const prob = poissonProbability(numLambda, numK, type);
    setResultado(prob);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Calculadora de Distribución de Poisson 🔢
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input para Lambda (λ) */}
        <div>
          <label htmlFor="lambda" className="block text-sm font-medium text-gray-700 mb-1">
            Tasa media de ocurrencias (λ)
          </label>
          <input
            type="number"
            id="lambda"
            step="any"
            value={lambda}
            onChange={(e) => setLambda(e.target.value)}
            placeholder="Ej: 3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Input para k */}
        <div>
          <label htmlFor="k" className="block text-sm font-medium text-gray-700 mb-1">
            Número de ocurrencias (k)
          </label>
          <input
            type="number"
            id="k"
            value={k}
            onChange={(e) => setK(e.target.value)}
            placeholder="Ej: 5"
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
            <option value="exact">Exactamente (P(X = k))</option>
            <option value="atMost">Como máximo (P(X ≤ k))</option>
            <option value="lessThan">Menos de (P(X - k))</option>
            <option value="atLeast">Al menos (P(X ≥ k))</option>
            <option value="moreThan">Más de (P(X + k))</option>
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
}
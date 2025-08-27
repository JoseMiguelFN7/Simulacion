import React, { useState } from 'react';

// --- Funciones de Cálculo ---
// (Funciones que proporcionaste para el modelo M/M/1)

function redondear(num, decimales) {
  const factor = Math.pow(10, decimales);
  return Math.round(num * factor) / factor;
}

// Nota: La función factorial no es necesaria para M/M/1,
// pero la incluyo si la quieres mantener por consistencia.
function factorial(n) {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

function getColaNoLimite1Servidor(lambda, mu, k) {
  let results = [];
  const rho = lambda / mu;

  // Las fórmulas M/M/1 solo son válidas si rho < 1
  if (rho >= 1) {
    return null; // Retornamos null para indicar un sistema inestable
  }

  const P0 = 1 - rho;
  const Lq = (rho * rho) / (1 - rho);
  const Ls = rho / (1 - rho);
  const Wq = Lq / lambda;
  const Ws = Ls / lambda;

  results.push({ name: "Factor de Utilización (ρ)", value: redondear(rho, 4) });
  results.push({ name: "Clientes en Cola (Lq)", value: redondear(Lq, 4) });
  results.push({ name: "Clientes en Sistema (Ls)", value: redondear(Ls, 4) });
  results.push({ name: "Tiempo en Cola (Wq)", value: redondear(Wq, 4) });
  results.push({ name: "Tiempo en Sistema (Ws)", value: redondear(Ws, 4) });
  results.push({ name: "Prob. de Sistema Vacío (P0)", value: redondear(P0, 4) });
  
  let distribution = [];
  let Fn = 0;
  for (let n = 0; n <= k; n++) {
    let Pn = P0 * Math.pow(rho, n);
    Fn += Pn;
    distribution.push({ n: n, Pn: redondear(Pn, 6), Fn: redondear(Fn, 6) });
  }
  results.push({ name: "distribution", value: distribution });
  return results;
}

// --- Componente de React ---

export default function UnServidorSinLimite() {
  // Estados para los inputs
  const [lambda, setLambda] = useState('');
  const [mu, setMu] = useState('');
  const [k, setK] = useState('');

  // Estados para los resultados y errores
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);
    setResults(null);

    const numLambda = parseFloat(lambda);
    const numMu = parseFloat(mu);
    const numK = parseInt(k, 10);

    if (isNaN(numLambda) || isNaN(numMu) || isNaN(numK) || numLambda <= 0 || numMu <= 0 || numK < 0) {
      setError('Por favor, introduce valores numéricos positivos. "k" debe ser >= 0.');
      return;
    }
    
    // Condición de estabilidad para M/M/1: λ < μ
    if (numLambda >= numMu) {
      setError('Error: El sistema es inestable (λ debe ser menor que μ). La cola crecerá infinitamente.');
      return;
    }

    const calculatedResults = getColaNoLimite1Servidor(numLambda, numMu, numK);
    setResults(calculatedResults);
  };
  
  // Extraemos las métricas y la tabla para mostrarlas por separado
  const metrics = results?.filter(r => r.name !== 'distribution');
  const distributionTable = results?.find(r => r.name === 'distribution')?.value;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Línea de Espera: Un Servidor, Cola Infinita (M/M/1) 🚶‍♂️...
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="lambda-mm1" className="block text-sm font-medium text-gray-700 mb-1">Tasa de llegada (λ)</label>
            <input type="number" id="lambda-mm1" step="any" value={lambda} onChange={(e) => setLambda(e.target.value)} placeholder="Ej: 8" className="w-full px-4 py-2 border border-gray-300 rounded-lg"/>
          </div>
          <div>
            <label htmlFor="mu-mm1" className="block text-sm font-medium text-gray-700 mb-1">Tasa de servicio (μ)</label>
            <input type="number" id="mu-mm1" step="any" value={mu} onChange={(e) => setMu(e.target.value)} placeholder="Ej: 10" className="w-full px-4 py-2 border border-gray-300 rounded-lg"/>
          </div>
          <div>
            <label htmlFor="k-mm1" className="block text-sm font-medium text-gray-700 mb-1">Clientes para tabla (k)</label>
            <input type="number" id="k-mm1" value={k} onChange={(e) => setK(e.target.value)} placeholder="Ej: 5" className="w-full px-4 py-2 border border-gray-300 rounded-lg"/>
          </div>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700">
          Calcular Métricas
        </button>
      </form>

      {error && <div className="text-center p-4 mb-4 text-red-700 bg-red-100 rounded-lg">{error}</div>}

      {results && (
        <div className="space-y-8">
          {/* Métricas de Rendimiento */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Métricas de Rendimiento</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {metrics.map(metric => (
                <div key={metric.name} className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">{metric.name}</p>
                  <p className="text-2xl font-bold text-blue-800">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Tabla de Distribución */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Tabla de Distribución de Probabilidad</h3>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Clientes (n)</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Probabilidad (Pn)</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Prob. Acumulada (Fn)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {distributionTable.map(row => (
                    <tr key={row.n} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{row.n}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">{row.Pn}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">{row.Fn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
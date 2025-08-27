import React, { useState } from 'react';

// --- Funciones de Cálculo ---

function redondear(num, decimales) {
  const factor = Math.pow(10, decimales);
  return Math.round(num * factor) / factor;
}

function factorial(n) {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

function getColaNoLimiteNServidor(lambda, mu, C, k) {
  let results = [];
  const rho = lambda / mu; // Intensidad de tráfico

  // Cálculo de P0
  let p0Denominador = 0;
  for (let i = 0; i < C; i++) {
    p0Denominador += Math.pow(rho, i) / factorial(i);
  }
  p0Denominador += Math.pow(rho, C) / (factorial(C) * (1 - rho / C));
  const P0 = 1 / p0Denominador;
  
  // Cálculo de las métricas principales
  const Lq = (P0 * Math.pow(rho, C) * (rho / C)) / (factorial(C) * Math.pow(1 - rho / C, 2));
  const Ls = Lq + rho;
  const Wq = Lq / lambda;
  const Ws = Wq + (1 / mu);
  const rhoUtilizacion = rho / C; // Factor de utilización del servidor

  results.push({ name: "Utilización (ρ serv.)", value: redondear(rhoUtilizacion, 4) });
  results.push({ name: "Clientes en Cola (Lq)", value: redondear(Lq, 4) });
  results.push({ name: "Clientes en Sistema (Ls)", value: redondear(Ls, 4) });
  results.push({ name: "Tiempo en Cola (Wq)", value: redondear(Wq, 4) });
  results.push({ name: "Tiempo en Sistema (Ws)", value: redondear(Ws, 4) });
  results.push({ name: "Prob. Sistema Vacío (P0)", value: redondear(P0, 4) });

  // Cálculo de la tabla de distribución
  let distribution = [];
  let Fn = 0;
  for (let n = 0; n <= k; n++) {
    let Pn = 0;
    if (n < C) {
      Pn = (Math.pow(rho, n) / factorial(n)) * P0;
    } else {
      Pn = (Math.pow(rho, n) / (factorial(C) * Math.pow(C, n - C))) * P0;
    }
    Fn += Pn;
    distribution.push({ n: n, Pn: redondear(Pn, 6), Fn: redondear(Fn, 6) });
  }
  results.push({ name: "distribution", value: distribution });
  return results;
}


// --- Componente de React ---

export default function VariosServidoresSinLimite() {
  const [lambda, setLambda] = useState('');
  const [mu, setMu] = useState('');
  const [C, setC] = useState('');
  const [k, setK] = useState('');

  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);
    setResults(null);

    const numLambda = parseFloat(lambda);
    const numMu = parseFloat(mu);
    const numC = parseInt(C, 10);
    const numK = parseInt(k, 10);

    if (isNaN(numLambda) || isNaN(numMu) || isNaN(numC) || isNaN(numK) || numLambda <= 0 || numMu <= 0 || numC <= 0 || numK < 0) {
      setError('Por favor, introduce valores numéricos válidos y positivos (k ≥ 0, C > 0).');
      return;
    }
    
    // Condición de estabilidad para M/M/c: λ < C * μ
    if (numLambda >= numC * numMu) {
      setError('Error: El sistema es inestable (λ debe ser menor que C * μ). La cola crecerá infinitamente.');
      return;
    }

    const calculatedResults = getColaNoLimiteNServidor(numLambda, numMu, numC, numK);
    setResults(calculatedResults);
  };

  const metrics = results?.filter(r => r.name !== 'distribution');
  const distributionTable = results?.find(r => r.name === 'distribution')?.value;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-3xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Línea de Espera: Múltiples Servidores, Cola Infinita (M/M/c) 🧑‍💼🧑‍💼...
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="lambda-mmc" className="block text-sm font-medium text-gray-700 mb-1">Tasa de llegada (λ)</label>
            <input type="number" id="lambda-mmc" step="any" value={lambda} onChange={(e) => setLambda(e.target.value)} placeholder="Ej: 15" className="w-full px-4 py-2 border border-gray-300 rounded-lg"/>
          </div>
          <div>
            <label htmlFor="mu-mmc" className="block text-sm font-medium text-gray-700 mb-1">Tasa de servicio (μ)</label>
            <input type="number" id="mu-mmc" step="any" value={mu} onChange={(e) => setMu(e.target.value)} placeholder="Ej: 10" className="w-full px-4 py-2 border border-gray-300 rounded-lg"/>
          </div>
          <div>
            <label htmlFor="c-mmc" className="block text-sm font-medium text-gray-700 mb-1">Nº Servidores (C)</label>
            <input type="number" id="c-mmc" value={C} onChange={(e) => setC(e.target.value)} placeholder="Ej: 2" className="w-full px-4 py-2 border border-gray-300 rounded-lg"/>
          </div>
          <div>
            <label htmlFor="k-mmc" className="block text-sm font-medium text-gray-700 mb-1">Clientes p/ tabla (k)</label>
            <input type="number" id="k-mmc" value={k} onChange={(e) => setK(e.target.value)} placeholder="Ej: 10" className="w-full px-4 py-2 border border-gray-300 rounded-lg"/>
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
            <div className="overflow-x-auto rounded-lg border border-gray-200 max-h-96">
              <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                <thead className="bg-gray-50 sticky top-0">
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
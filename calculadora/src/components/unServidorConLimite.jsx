import React, { useState } from 'react';

// --- Funciones de Cálculo ---

function redondear(num, decimales) {
  const factor = Math.pow(10, decimales);
  return Math.round(num * factor) / factor;
}

function getColaLimite1Servidor(lambda, mu, cola) {
  const N = cola + 1; // Capacidad total del sistema (1 en servicio + cola)
  let results = [];
  const rho = lambda / mu;

  let P0, Ls, Lq;

  // Manejo del caso especial cuando λ = μ (rho = 1)
  if (rho === 1) {
    P0 = 1 / (N + 1);
    Ls = N / 2;
  } else {
    P0 = (1 - rho) / (1 - Math.pow(rho, N + 1));
    const term1 = 1 - (N + 1) * Math.pow(rho, N) + N * Math.pow(rho, N + 1);
    const term2 = (1 - rho) * (1 - Math.pow(rho, N + 1));
    Ls = rho * (term1 / term2);
  }

  const PN = P0 * Math.pow(rho, N);
  const lambdaEfectiva = lambda * (1 - PN);
  const lambdaPerdida = lambda - lambdaEfectiva;
  
  if (rho === 1) {
    // Para rho=1, Lq tiene una fórmula diferente
    Lq = ((N * (N - 1)) / (2 * (N + 1)));
  } else {
    Lq = Ls - (lambdaEfectiva / mu);
  }
  
  const Wq = Lq / lambdaEfectiva;
  const Ws = Wq + (1 / mu);

  results.push({ name: "Factor de Utilización (ρ)", value: redondear(rho, 4) });
  results.push({ name: "Clientes en Cola (Lq)", value: redondear(Lq, 4) });
  results.push({ name: "Clientes en Sistema (Ls)", value: redondear(Ls, 4) });
  results.push({ name: "Tiempo en Cola (Wq)", value: redondear(Wq, 4) });
  results.push({ name: "Tiempo en Sistema (Ws)", value: redondear(Ws, 4) });
  results.push({ name: "λ Efectiva", value: redondear(lambdaEfectiva, 4) });
  results.push({ name: "λ Perdida", value: redondear(lambdaPerdida, 4) });
  results.push({ name: "Prob. de Rechazo (PN)", value: redondear(PN, 4) });
  
  let distribution = [];
  let Fn = 0;
  for (let n = 0; n <= N; n++) {
    const Pn = P0 * Math.pow(rho, n);
    Fn += Pn;
    distribution.push({ n: n, Pn: redondear(Pn, 6), Fn: redondear(Fn, 6) });
  }
  results.push({ name: "distribution", value: distribution });
  return results;
}

// --- Componente de React ---

export default function UnServidorConLimite() {
  const [lambda, setLambda] = useState('');
  const [mu, setMu] = useState('');
  const [cola, setCola] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);
    setResults(null);

    const numLambda = parseFloat(lambda);
    const numMu = parseFloat(mu);
    const numCola = parseInt(cola, 10);

    if (isNaN(numLambda) || isNaN(numMu) || isNaN(numCola) || numLambda <= 0 || numMu <= 0 || numCola < 0) {
      setError('Por favor, introduce valores numéricos positivos. La capacidad de la cola debe ser >= 0.');
      return;
    }

    const calculatedResults = getColaLimite1Servidor(numLambda, numMu, numCola);
    setResults(calculatedResults);
  };

  const metrics = results?.filter(r => r.name !== 'distribution');
  const distributionTable = results?.find(r => r.name === 'distribution')?.value;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-3xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Línea de Espera: Un Servidor, Cola Finita (M/M/1/N) 🚶‍♂️...🚶‍♂️|
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="lambda-mm1n" className="block text-sm font-medium text-gray-700 mb-1">Tasa de llegada (λ)</label>
            <input type="number" id="lambda-mm1n" step="any" value={lambda} onChange={(e) => setLambda(e.target.value)} placeholder="Ej: 10" className="w-full px-4 py-2 border border-gray-300 rounded-lg"/>
          </div>
          <div>
            <label htmlFor="mu-mm1n" className="block text-sm font-medium text-gray-700 mb-1">Tasa de servicio (μ)</label>
            <input type="number" id="mu-mm1n" step="any" value={mu} onChange={(e) => setMu(e.target.value)} placeholder="Ej: 12" className="w-full px-4 py-2 border border-gray-300 rounded-lg"/>
          </div>
          <div>
            <label htmlFor="cola-mm1n" className="block text-sm font-medium text-gray-700 mb-1">Capacidad de la cola</label>
            <input type="number" id="cola-mm1n" value={cola} onChange={(e) => setCola(e.target.value)} placeholder="Ej: 5" className="w-full px-4 py-2 border border-gray-300 rounded-lg"/>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
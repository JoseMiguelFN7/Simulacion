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

function getColaLimiteNServidor(lambda, mu, C, cola) {
  const N = C + cola;
  const rho = lambda / mu;
  const rhoC = rho / C;
  let results = [];

  // Cálculo de P0
  let p0Denominador = 0;
  for (let i = 0; i < C; i++) {
    p0Denominador += Math.pow(rho, i) / factorial(i);
  }
  
  const termC = Math.pow(rho, C) / factorial(C);
  if (rhoC === 1) {
    p0Denominador += termC * (N - C + 1);
  } else {
    p0Denominador += termC * ((1 - Math.pow(rhoC, N - C + 1)) / (1 - rhoC));
  }
  const P0 = 1 / p0Denominador;

  // Cálculo de Pn, Fn y Ls
  let distribution = [];
  let Fn = 0;
  let Ls_sum = 0;
  for (let n = 0; n <= N; n++) {
    let Pn;
    if (n < C) {
      Pn = (Math.pow(rho, n) / factorial(n)) * P0;
    } else {
      Pn = (Math.pow(rho, n) / (factorial(C) * Math.pow(C, n - C))) * P0;
    }
    Fn += Pn;
    Ls_sum += n * Pn; // Suma para Ls
    distribution.push({ n, Pn: redondear(Pn, 6), Fn: redondear(Fn, 6) });
  }

  const Ls = Ls_sum;
  const PN = distribution[N].Pn;
  const lambdaEfectiva = lambda * (1 - PN);
  const lambdaPerdida = lambda - lambdaEfectiva;
  const Ws = Ls / lambdaEfectiva;
  const Wq = Ws - (1 / mu);
  const Lq = lambdaEfectiva * Wq;
  const rhoUtilizacion = lambdaEfectiva / (C * mu);

  results.push({ name: "Utilización (ρ serv.)", value: redondear(rhoUtilizacion, 4) });
  results.push({ name: "Clientes en Cola (Lq)", value: redondear(Lq, 4) });
  results.push({ name: "Clientes en Sistema (Ls)", value: redondear(Ls, 4) });
  results.push({ name: "Tiempo en Cola (Wq)", value: redondear(Wq, 4) });
  results.push({ name: "Tiempo en Sistema (Ws)", value: redondear(Ws, 4) });
  results.push({ name: "λ Efectiva", value: redondear(lambdaEfectiva, 4) });
  results.push({ name: "λ Perdida", value: redondear(lambdaPerdida, 4) });
  results.push({ name: "Prob. Rechazo (PN)", value: redondear(PN, 4) });
  results.push({ name: "distribution", value: distribution });

  return results;
}

// --- Componente de React ---

export default function VariosServidoresConLimite() {
  const [lambda, setLambda] = useState('');
  const [mu, setMu] = useState('');
  const [C, setC] = useState('');
  const [cola, setCola] = useState('');

  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);
    setResults(null);

    const numLambda = parseFloat(lambda);
    const numMu = parseFloat(mu);
    const numC = parseInt(C, 10);
    const numCola = parseInt(cola, 10);

    if (isNaN(numLambda) || isNaN(numMu) || isNaN(numC) || isNaN(numCola) || numLambda <= 0 || numMu <= 0 || numC <= 0 || numCola < 0) {
      setError('Por favor, introduce valores numéricos válidos y positivos (C > 0, cola ≥ 0).');
      return;
    }

    const calculatedResults = getColaLimiteNServidor(numLambda, numMu, numC, numCola);
    setResults(calculatedResults);
  };

  const metrics = results?.filter(r => r.name !== 'distribution');
  const distributionTable = results?.find(r => r.name === 'distribution')?.value;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Línea de Espera: Múltiples Servidores, Cola Finita (M/M/c/N) 🧑‍💼...🚶‍♂️|
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="lambda-mmcn" className="block text-sm font-medium text-gray-700 mb-1">Tasa de llegada (λ)</label>
            <input type="number" id="lambda-mmcn" step="any" value={lambda} onChange={(e) => setLambda(e.target.value)} placeholder="Ej: 20" className="w-full px-4 py-2 border border-gray-300 rounded-lg"/>
          </div>
          <div>
            <label htmlFor="mu-mmcn" className="block text-sm font-medium text-gray-700 mb-1">Tasa de servicio (μ)</label>
            <input type="number" id="mu-mmcn" step="any" value={mu} onChange={(e) => setMu(e.target.value)} placeholder="Ej: 15" className="w-full px-4 py-2 border border-gray-300 rounded-lg"/>
          </div>
          <div>
            <label htmlFor="c-mmcn" className="block text-sm font-medium text-gray-700 mb-1">Nº Servidores (C)</label>
            <input type="number" id="c-mmcn" value={C} onChange={(e) => setC(e.target.value)} placeholder="Ej: 2" className="w-full px-4 py-2 border border-gray-300 rounded-lg"/>
          </div>
          <div>
            <label htmlFor="cola-mmcn" className="block text-sm font-medium text-gray-700 mb-1">Capacidad de cola</label>
            <input type="number" id="cola-mmcn" value={cola} onChange={(e) => setCola(e.target.value)} placeholder="Ej: 3" className="w-full px-4 py-2 border border-gray-300 rounded-lg"/>
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